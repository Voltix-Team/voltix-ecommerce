from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Cart, CartItem, Product
from .serializers import CartSerializer

class CartViewSet(viewsets.ViewSet):
    
    def get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def list(self, request):
        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

   
    def create(self, request):
        product_id = request.data.get('product_id')
        quantity = int(request.data.get('quantity', 1))
        
        try:
            product = Product.objects.get(id=product_id)
            cart = self.get_cart(request.user)
            
         
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart, product=product
            )
            
            if not created:
                cart_item.quantity += quantity
            else:
                cart_item.quantity = quantity
                
            cart_item.save() 
            return Response({"message": "Cart updated"}, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

   
    def destroy(self, request, pk=None):
        CartItem.objects.filter(id=pk, cart__user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)