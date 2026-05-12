from django.db import models


# Create your models here.
class WishlistItem(models.Model) : 
    user = models.ForeignKey( 'users.User'  ,  on_delete=models.CASCADE)
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"
    
    class Meta : # It doesn’t store data — it controls how Django treats your model. 
        unique_together = ('user', 'product') # prevents the same user from adding the same product twice 
        ordering = ['-created_at']  # The minus sign - tells Django to sort in descending order (newest first).