from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import OrderItem, Order
from cart.models import CartItem # Imported correctly from the cart app models
from django.db import transaction
from .serializers import OrderSerializer
from .services import send_order_confirmation

class OrderView(APIView):
    # before doing anything -> we have to make sure the user is authenticated and have the right permissions 
    authentication_classes = [JWTAuthentication]  # "Identify the user using their JWT token"
    permission_classes = [IsAuthenticated] # "Only allow access if the user is successfully identified"

    def get(self, request):
        # We use the Meta ordering in the model to ensure newest is first
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True) 
        return Response(serializer.data)
    
    def post(self, request):
        # Using atomic transaction ensures the whole process succeeds or fails together
        with transaction.atomic():
            cart = CartItem.objects.filter(cart__user=request.user) # this will give us the cart object for this user 
            
            if not cart.exists(): 
                return Response({"error": "the cart is empty"}, status=400)
            else : 
                total_price = 0 
                for p in cart: 
                    # Validation: check if we have enough products in stock
                    if p.product.stock < p.quantity:
                        return Response({
                            "error": f"Not enough stock for {p.product.name}. Only {p.product.stock} left."
                        }, status=400)

                    price = p.product.price * p.quantity
                    total_price += price  # loop through each product in the cart and take its price 

                # create a new order(parent) based on the price we just calculated 
                new_order = Order.objects.create(
                    user=request.user, 
                    total_price=total_price, 
                    status='pending'
                )
            
            # another loop in the same cart : It takes every individual item in that temporary cart and turns it into a permanent part of the order history.
            for p in cart: 
                # creating the child [items in the order aka the products ]
                OrderItem.objects.create(
                    order=new_order,
                    product=p.product,
                    quantity=p.quantity,
                    price=p.product.price # Locking the price!
                )
                
                # Deducting stock from the product model
                p.product.stock -= p.quantity
                p.product.save()

            # 2. Delete the cart items (The cleanup) after the checkout 
            cart.delete() 

           # Trigger the email service
            try:
                send_order_confirmation(new_order)
            except Exception as e:
                # We log the error but don't stop the response 
                # so the user still sees their 'Success' screen
                print(f"Email error: {e}")

            # 3. Return the new order data to React
            serializer = OrderSerializer(new_order)
            return Response(serializer.data, status=201)