# cart/serializers.py
from rest_framework import serializers
from .models import Cart, CartItem

class CartItemSerializer(serializers.ModelSerializer):
    # Using ReadOnlyField is fine for text/numbers
    name = serializers.ReadOnlyField(source='product.name')
    price = serializers.ReadOnlyField(source='product.price')
    
    # IMPORTANT: Use ImageField for the thumbnail to ensure 
    # the full Cloudinary URL is generated and sent to React.
    image = serializers.ImageField(source='product.thumbnail', read_only=True, use_url=True)
    thumbnail = serializers.ImageField(source='product.thumbnail', read_only=True, use_url=True)

    subtotal = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        # Ensure 'image' and 'thumbnail' are both here to match React helpers
        fields = ['id', 'product', 'name', 'price', 'image', 'thumbnail', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        return obj.subtotal

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'items', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price