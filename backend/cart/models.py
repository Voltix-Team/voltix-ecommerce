from django.db import models
from django.core.exceptions import ValidationError
from products.models import Product 


class Cart(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())
    def __str__(self):
        return f"Cart {self.id} for {self.user.username}"
    

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def subtotal(self):
        return self.product.price * self.quantity
    def clean(self):
        if self.quantity < 1:
            raise ValidationError('Quantity must be at least 1') 
        
    def save(self, *args, **kwargs):
        self.clean() 
        super().save(*args, **kwargs)
    

