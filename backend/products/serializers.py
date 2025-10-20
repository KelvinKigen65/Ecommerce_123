"""
Serializers convert Django models to JSON for the API.
These handle the transformation of product data for the React frontend.
"""

from rest_framework import serializers
from .models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for Category model
    """
    product_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'product_count', 'created_at']
    
    def get_product_count(self, obj):
        """Get the number of products in this category"""
        return obj.products.filter(available=True).count()


class ProductImageSerializer(serializers.ModelSerializer):
    """
    Serializer for additional product images
    """
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text']


class ProductListSerializer(serializers.ModelSerializer):
    """
    Simplified serializer for product lists (homepage, category pages)
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'price', 'compare_price', 
            'category_name', 'image', 'stock', 'available', 
            'featured', 'discount_percentage', 'is_in_stock'
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for single product view
    Includes all product information and related images
    """
    category = CategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    is_in_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 
            'compare_price', 'category', 'image', 'images', 
            'stock', 'available', 'featured', 'discount_percentage', 
            'is_in_stock', 'created_at', 'updated_at'
        ]
        
class ProductSerializer(serializers.ModelSerializer):
    """
    Minimal serializer for embedding product info in cart items
    """
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'image', 'slug']