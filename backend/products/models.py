from django.db import models

class Product(models.Model):
    # Add just one field so it's valid
    name = models.CharField(max_length=100)