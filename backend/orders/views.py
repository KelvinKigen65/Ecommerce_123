
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import stripe

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderCreateSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        items = serializer.validated_data.pop('items')
        subtotal = sum(item['product'].price * item['quantity'] for item in items)
        
        shipping_cost = 0 if subtotal >= 50 else 10
        tax_amount = subtotal * 0.1
        
        order = Order.objects.create(
            user=request.user,
            total_price=subtotal,
            shipping_cost=shipping_cost,
            tax_amount=tax_amount,
            **serializer.validated_data
        )
        
        for item in items:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                product_name=item['product'].name,
                price=item['product'].price,
                quantity=item['quantity']
            )
            
            product = item['product']
            product.stock -= item['quantity']
            product.save()
        
        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )
    
    @action(detail=False, methods=['post'])
    def create_payment_intent(self, request):
        try:
            amount = request.data.get('amount')
            intent = stripe.PaymentIntent.create(
                amount=int(float(amount) * 100),
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
        order = self.get_object()
        payment_intent_id = request.data.get('payment_intent_id')
        
        try:
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
