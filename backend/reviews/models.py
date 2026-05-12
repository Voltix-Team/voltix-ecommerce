from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Review(models.Model) :
    # which product this review belongs to
    # using string reference 'products.Product' to avoid circular import issues
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE, # delete review if product is deleted
        related_name='reviews'
    )
    
    # which user wrote this review
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE, # delete review if user is deleted
        related_name='reviews'
    )
    
    # rating 1-5
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta :
        # one review per user per product - at DB level
        unique_together = ('product', 'user')
        ordering = ['-created_at'] # newest reviews first
        
    def __str__(self) :
        return f"Review by {self.user.email} on {self.product.name} ({self.rating}★)"