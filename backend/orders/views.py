"""
Order and payment views.
Handles order creation, Stripe payment processing, and M-Pesa STK Push.
"""

import base64
from datetime import datetime
from decimal import Decimal
import re

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.conf import settings
import requests
import stripe

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer

# Configure Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

FREE_SHIPPING_THRESHOLD = Decimal('5000.00')
STANDARD_SHIPPING_COST = Decimal('500.00')
TAX_RATE = Decimal('0.10')


def normalize_mpesa_phone(phone):
    digits = re.sub(r'\D', '', phone or '')
    if digits.startswith('0') and len(digits) == 10:
        return '254' + digits[1:]
    if digits.startswith('7') and len(digits) == 9:
        return '254' + digits
    if digits.startswith('254') and len(digits) == 12:
        return digits
    raise ValueError('Enter a valid Kenyan phone number, for example 0712345678.')


def get_mpesa_base_url():
    environment = getattr(settings, 'MPESA_ENVIRONMENT', 'sandbox').lower()
    if environment == 'production':
        return 'https://api.safaricom.co.ke'
    return 'https://sandbox.safaricom.co.ke'


def get_mpesa_access_token():
    consumer_key = settings.MPESA_CONSUMER_KEY
    consumer_secret = settings.MPESA_CONSUMER_SECRET

    if not consumer_key or not consumer_secret:
        raise ValueError('M-Pesa consumer key and secret are not configured.')

    response = requests.get(
        f'{get_mpesa_base_url()}/oauth/v1/generate',
        params={'grant_type': 'client_credentials'},
        auth=(consumer_key, consumer_secret),
        timeout=20,
    )
    response.raise_for_status()
    return response.json()['access_token']


def extract_callback_value(callback_items, name):
    for item in callback_items:
        if item.get('Name') == name:
            return item.get('Value')
    return None


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action == 'mpesa_callback':
            return [AllowAny()]
        return super().get_permissions()
    
    def get_queryset(self):
        """Return orders for the current user"""
        return Order.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new order"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Calculate totals
        items = serializer.validated_data.pop('items')
        subtotal = sum(item['product'].price * item['quantity'] for item in items)
        
        shipping_cost = Decimal('0.00') if subtotal >= FREE_SHIPPING_THRESHOLD else STANDARD_SHIPPING_COST
        tax_amount = subtotal * TAX_RATE
        
        # Create order
        order = Order.objects.create(
            user=request.user,
            total_price=subtotal,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            payment_method='mpesa',
            **serializer.validated_data
        )
        
        # Create order items
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                product_name=item['product'].name,
                price=item['product'].price,
                quantity=item['quantity']
            )
            
            # Update product stock
            product = item['product']
            product.stock -= item['quantity']
            product.save()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def initiate_mpesa_payment(self, request, pk=None):
        """
        Initiate M-Pesa STK Push for an order.
        POST /api/orders/{id}/initiate_mpesa_payment/
        """
        order = self.get_object()

        if order.payment_status == 'completed':
            return Response(
                {'error': 'This order is already paid.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            phone = normalize_mpesa_phone(request.data.get('phone') or order.phone)
        except ValueError as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            shortcode = settings.MPESA_SHORTCODE
            passkey = settings.MPESA_PASSKEY
            callback_url = settings.MPESA_CALLBACK_URL

            if not shortcode or not passkey or not callback_url:
                raise ValueError('M-Pesa shortcode, passkey, and callback URL are required.')

            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(f'{shortcode}{passkey}{timestamp}'.encode()).decode()
            amount = max(1, int(order.grand_total))
            token = get_mpesa_access_token()

            payload = {
                'BusinessShortCode': shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'TransactionType': settings.MPESA_TRANSACTION_TYPE,
                'Amount': amount,
                'PartyA': phone,
                'PartyB': shortcode,
                'PhoneNumber': phone,
                'CallBackURL': callback_url,
                'AccountReference': f'Order{order.id}',
                'TransactionDesc': f'HuslersShop Order #{order.id}',
            }

            response = requests.post(
                f'{get_mpesa_base_url()}/mpesa/stkpush/v1/processrequest',
                json=payload,
                headers={'Authorization': f'Bearer {token}'},
                timeout=30,
            )
            response.raise_for_status()
            data = response.json()

            order.payment_method = 'mpesa'
            order.payment_status = 'pending'
            order.mpesa_checkout_request_id = data.get('CheckoutRequestID')
            order.mpesa_merchant_request_id = data.get('MerchantRequestID')
            order.mpesa_result_description = data.get('ResponseDescription', '')
            order.save()

            return Response({
                'message': 'M-Pesa prompt sent. Enter your PIN on your phone to complete payment.',
                'order': OrderSerializer(order, context={'request': request}).data,
                'mpesa': data,
            })
        except requests.HTTPError as error:
            detail = error.response.text if error.response is not None else str(error)
            return Response({'error': detail}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as error:
            return Response({'error': str(error)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'])
    def payment_status_check(self, request, pk=None):
        """
        Return the latest payment status for an order.
        GET /api/orders/{id}/payment_status_check/
        """
        order = self.get_object()
        return Response(OrderSerializer(order, context={'request': request}).data)

    @action(detail=False, methods=['post'], url_path='mpesa-callback')
    def mpesa_callback(self, request):
        """
        Receive M-Pesa STK Push callback.
        POST /api/orders/mpesa-callback/
        """
        callback = request.data.get('Body', {}).get('stkCallback', {})
        checkout_request_id = callback.get('CheckoutRequestID')
        result_code = str(callback.get('ResultCode', ''))
        result_description = callback.get('ResultDesc', '')
        metadata = callback.get('CallbackMetadata', {}).get('Item', [])

        try:
            order = Order.objects.get(mpesa_checkout_request_id=checkout_request_id)
        except Order.DoesNotExist:
            return Response({'message': 'Order not found for callback'}, status=status.HTTP_200_OK)

        order.mpesa_result_code = result_code
        order.mpesa_result_description = result_description

        if result_code == '0':
            order.payment_status = 'completed'
            order.status = 'processing'
            order.mpesa_receipt_number = extract_callback_value(metadata, 'MpesaReceiptNumber')
        else:
            order.payment_status = 'failed'

        order.save()
        return Response({'message': 'Callback received'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        """
        Create Stripe payment intent for checkout
        POST /api/orders/create_payment_intent/
        """
        try:
            amount = request.data.get('amount')  # Amount in dollars
            
            # Create a PaymentIntent with Stripe
            intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),  # Convert to cents
                currency='usd',
                metadata={
                    'user_id': request.user.id,
                    'user_email': request.user.email
                }
            )
            
            return Response({
                'clientSecret': intent['client_secret'],
                'paymentIntentId': intent['id']
            })
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    @action(detail=True, methods=['post'])
    def confirm_payment(self, request, pk=None):
        """
        Confirm payment for an order
        POST /api/orders/{id}/confirm_payment/
        """
        order = self.get_object()
        payment_intent_id = request.data.get('payment_intent_id')
        
        try:
            # Retrieve the payment intent from Stripe
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if intent['status'] == 'succeeded':
                order.payment_status = 'completed'
                order.status = 'processing'
                order.stripe_payment_intent_id = payment_intent_id
                order.payment_method = 'stripe'
                order.save()
                
                return Response({
                    'message': 'Payment confirmed successfully',
                    'order': OrderSerializer(order).data
                })
            else:
                return Response(
                    {'error': 'Payment not completed'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
