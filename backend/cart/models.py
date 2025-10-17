"""
Shopping cart models.
Handles cart and cart items for users.
"""

from django.db import models
from django.contrib.auth.models import User
from products.models import Product


class Cart(models.Model):
    """
    Shopping cart for each user session
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=40, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        if self.user:
            return f"Cart for {self.user.username}"
        return f"Cart {self.session_key}"
    
    @property
    def total_price(self):
        """Calculate total cart price"""
        return sum(item.subtotal for item in self.items.all())
    
    @property
    def total_items(self):
        """Calculate total number of items"""
        return sum(item.quantity for item in self.items.all())


class CartItem(models.Model):
    """
    Individual items in the cart
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['cart', 'product']
    
    def __str__(self):
        return f"{self.quantity}x {self.product.name}"
    
    @property
    def subtotal(self):
        """Calculate subtotal for this item"""
        return self.product.price * self.quantity
    
    def save(self, *args, **kwargs):
        """Ensure quantity doesn't exceed stock"""
        if self.quantity > self.product.stock:
            self.quantity = self.product.stock
        super().save(*args, **kwargs)