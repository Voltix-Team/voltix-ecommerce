from rest_framework import serializers
from .models import Order , OrderItem
from products.serializers import ProductSerializer # To show product details

class OrderItemSerializer(serializers.ModelSerializer):
    # Nesting the ProductSerializer gives the frontend the name, image, etc.
    product = ProductSerializer(read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    # This pulls in the list of items belonging to this order
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'created_at', 'total_price', 'status', 'items']
        