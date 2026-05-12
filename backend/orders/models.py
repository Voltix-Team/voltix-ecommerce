from django.db import models

# Create your models here.
class Order (models.Model) : 
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('shipped', 'Shipped'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey('users.User' , on_delete=models.CASCADE ) 
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(max_digits=10 , decimal_places=2)
    status = models.CharField( max_length=20, choices=STATUS_CHOICES , default='pending' ) 

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.id} - {self.user.username}"
    

class OrderItem (models.Model) : 
    order = models.ForeignKey('orders.Order' , related_name='items' , on_delete=models.CASCADE ) 
    product = models.ForeignKey('products.product' , on_delete= models.CASCADE) 
    price = models.DecimalField( max_digits=10 , decimal_places=2)
    quantity = models.IntegerField(default= 1 )

    def __str__ (self) : 
        return f"Item for Order #{self.order.id}: {self.product.name}"

