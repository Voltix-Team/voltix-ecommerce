from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    # This ensures the frontend gets the full https://res.cloudinary.com/... URL
    thumbnail = serializers.ImageField(use_url=True)

    class Meta:
        model = Product
        fields = '__all__'