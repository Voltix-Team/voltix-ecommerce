# serializers.py
from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    thumbnail = serializers.ImageField(use_url=True)
    
    # This maps 'image' to your 'thumbnail' field so the frontend is happy
    image = serializers.ImageField(source='thumbnail', read_only=True, use_url=True)

    class Meta:
        model = Product
        # '__all__' will now include 'rating' and our new 'image' alias
        fields = '__all__'