"""
Order serializers for API responses.
"""

from rest_framework import serializers
from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for order items
    """
    product_image = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product_name', 'price', 'quantity', 'subtotal', 'product_image']
    
    def get_product_image(self, obj):
        if obj.product and obj.product.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.product.image.url)
        return None


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for order details
    """
    items = OrderItemSerializer(many=True, read_only=True)
    grand_total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = Order
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone',
            'address', 'city', 'postal_code', 'country',
            'total_price', 'shipping_cost', 'tax_amount', 'grand_total',
            'status', 'payment_status', 'payment_method',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'payment_status']


class OrderItemCreateSerializer(serializers.Serializer):
    """
    Serializer for creating order items
    """
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)
    
    def validate_product_id(self, value):
        try:
            product = Product.objects.get(id=value)
            if not product.available:
                raise serializers.ValidationError("Product is not available")
            return product
        except Product.DoesNotExist:
            raise serializers.ValidationError("Product not found")
    
    def validate(self, data):
        product = data['product_id']
        quantity = data['quantity']
        
        if quantity > product.stock:
            raise serializers.ValidationError(
                f"Only {product.stock} items available in stock"
            )
        
        return {
            'product': product,
            'quantity': quantity
        }


class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating orders
    """
    items = OrderItemCreateSerializer(many=True, write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'first_name', 'last_name', 'email', 'phone',
            'address', 'city', 'postal_code', 'country',
            'items'
        ]
    
    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Order must contain at least one item")
        return value