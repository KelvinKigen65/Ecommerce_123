"""
Views handle API endpoints and business logic.
These views provide data to the React frontend.
"""

from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product
from .serializers import (
    CategorySerializer, 
    ProductListSerializer, 
    ProductDetailSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for categories
    GET /api/categories/ - List all categories
    GET /api/categories/{id}/ - Get single category
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for products with filtering and search
    GET /api/products/ - List all products
    GET /api/products/{slug}/ - Get single product
    GET /api/products/featured/ - Get featured products
    GET /api/products/search/?search=keyword - Search products
    """
    queryset = Product.objects.filter(available=True).select_related('category')
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'featured']
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'created_at']
    
    def get_serializer_class(self):
        """Use different serializers for list and detail views"""
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Custom endpoint for featured products
        GET /api/products/featured/
        """
        featured_products = self.queryset.filter(featured=True)[:8]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def latest(self, request):
        """
        Custom endpoint for latest products
        GET /api/products/latest/
        """
        latest_products = self.queryset.order_by('-created_at')[:8]
        serializer = self.get_serializer(latest_products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Get products by category slug
        GET /api/products/by_category/?category=electronics
        """
        category_slug = request.query_params.get('category')
        if category_slug:
            products = self.queryset.filter(category__slug=category_slug)
            page = self.paginate_queryset(products)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            serializer = self.get_serializer(products, many=True)
            return Response(serializer.data)
        return Response({'error': 'Category parameter is required'}, status=400)