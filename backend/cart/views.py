from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Cart, CartItem
from products.models import Product  # ← import Product from products app, not cart
from .serializers import CartSerializer, CartItemSerializer


class CartViewSet(viewsets.ViewSet):

    def get_cart(self, user):
        # get or create a cart for this user
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    # GET /api/cart/ → return the current user's cart with all items
    def list(self, request):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    # POST /api/cart/ → add a product to the cart
    def create(self, request):
        product_id = request.data.get('product_id')
        quantity   = int(request.data.get('quantity', 1))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        # check if enough stock is available
        if quantity > product.stock:
            return Response(
                {"error": f"Only {product.stock} items available in stock."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart = self.get_cart(request.user)

        # if item already in cart, increment quantity
        cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
        if not created:
            cart_item.quantity += quantity
        else:
            cart_item.quantity = quantity

        # check combined quantity doesn't exceed stock
        if cart_item.quantity > product.stock:
            return Response(
                {"error": f"Cannot add more than {product.stock} of this item."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.save()
        return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)

    # DELETE /api/cart/{id}/ → remove a specific item from the cart
    def destroy(self, request, pk=None):
        deleted, _ = CartItem.objects.filter(id=pk, cart__user=request.user).delete()
        if not deleted:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Item removed."}, status=status.HTTP_204_NO_CONTENT)

    # PATCH /api/cart/{id}/ → update quantity of a specific cart item
    def partial_update(self, request, pk=None):
        quantity = request.data.get('quantity')
        if not quantity:
            return Response({"error": "Quantity is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_item = CartItem.objects.get(id=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({"error": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

        # check stock before updating
        if int(quantity) > cart_item.product.stock:
            return Response(
                {"error": f"Only {cart_item.product.stock} items available."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = int(quantity)
        cart_item.save()
        return Response(CartSerializer(cart_item.cart).data, status=status.HTTP_200_OK)

    # DELETE /api/cart/clear/ → remove all items from the cart
    @action(detail=False, methods=['delete'])
    def clear(self, request):
        cart = self.get_cart(request.user)
        cart.items.all().delete()
        return Response({"message": "Cart cleared."}, status=status.HTTP_204_NO_CONTENT)