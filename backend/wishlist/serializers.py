from rest_framework import serializers
from .models import WishlistItem
from products.serializers import ProductSerializer # Import your teammate's serializer

class WishlistItemSerializer(serializers.ModelSerializer):
    # This nests the full product details inside the wishlist response
    product = ProductSerializer(read_only=True)

    class Meta:
        model = WishlistItem
        #  include 'product' for the GET display and 'product_id' if needed for reference
        fields = ['id', 'product', 'added_at']