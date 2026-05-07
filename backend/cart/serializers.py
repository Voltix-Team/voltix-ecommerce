from rest_framework import serializers
from .models import Cart, CartItem
from products.models import Product  # ← import from products app, not cart


class CartItemSerializer(serializers.ModelSerializer):
    # read only fields pulled from the related Product model
    product_name  = serializers.ReadOnlyField(source='product.name')
    product_price = serializers.ReadOnlyField(source='product.price')
    thumbnail     = serializers.ReadOnlyField(source='product.thumbnail')

    # subtotal is a @property on the model — SerializerMethodField reads it correctly
    subtotal = serializers.SerializerMethodField()

    class Meta:
        model  = CartItem
        fields = ['id', 'product', 'product_name', 'product_price', 'thumbnail', 'quantity', 'subtotal']

    def get_subtotal(self, obj):
        # call the @property method on the CartItem model
        return obj.subtotal


class CartSerializer(serializers.ModelSerializer):
    # nested — shows full item details inside the cart response
    items = CartItemSerializer(many=True, read_only=True)

    # total_price is a @property on the Cart model
    total_price = serializers.SerializerMethodField()

    class Meta:
        model  = Cart
        fields = ['id', 'items', 'total_price']

    def get_total_price(self, obj):
        return obj.total_price