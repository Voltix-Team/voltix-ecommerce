# models.py
from django.db import models
from cloudinary.models import CloudinaryField

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)    
    stock = models.PositiveIntegerField(default=0)
    category = models.CharField(max_length=100, default='general', blank=True)
    description = models.TextField(null=True, blank=True)
    thumbnail = CloudinaryField('image', folder='products', null=True, blank=True)
    brand = models.CharField(max_length=100, null=True, blank=True)
    discount_percentage = models.FloatField(default=0)
    # added rating field 
    rating = models.FloatField(default=0) 

    def __str__(self):
        return self.name

    @property
    def thumbnail_url(self):
        if self.thumbnail:
            return self.thumbnail.url
        return None