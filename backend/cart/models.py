from django.db import models
from django.conf import settings  # ← use settings.AUTH_USER_MODEL for custom User
from django.core.exceptions import ValidationError


class Cart(models.Model):
    # OneToOneField — each user has exactly one cart
    # settings.AUTH_USER_MODEL points to our custom users.User model
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='cart'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def total_price(self):
        # sum up the subtotal of all items in this cart
        return sum(item.subtotal for item in self.items.all())

    def __str__(self):
        return f"Cart for {self.user.email}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')

    # 'products.Product' — must include app name to reference a model in another app
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)

    quantity = models.PositiveIntegerField(default=1)

    @property  # ← @property so serializer can read it like a field
    def subtotal(self):
        return self.product.price * self.quantity

    def clean(self):
        if self.quantity < 1:
            raise ValidationError('Quantity must be at least 1')

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.product.name}"