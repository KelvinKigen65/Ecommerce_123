"""
URL routing for the products app.
Maps URLs to views using Django REST Framework's router.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

# The API URLs are determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
]

"""
This creates the following endpoints:
- /api/categories/ - List categories
- /api/categories/{slug}/ - Category detail
- /api/products/ - List products
- /api/products/{slug}/ - Product detail
- /api/products/featured/ - Featured products
- /api/products/latest/ - Latest products
- /api/products/by_category/?category=slug - Products by category
"""