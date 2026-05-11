from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import transaction
from .models import Order, OrderItem
from .serializers import OrderSerializer
from .services import send_order_confirmation


class OrderView(APIView):
    # before doing anything -> we have to make sure the user is authenticated and have the right permissions 
    authentication_classes = [JWTAuthentication]  
    permission_classes = [IsAuthenticated] 

    def get(self, request):
        # We use the Meta ordering in the model to ensure newest is first
        orders = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(orders, many=True) 
        return Response(serializer.data)
    
    def post(self, request):
        with transaction.atomic():
            data = request.data
            
            items_data = data.get('items', [])
            
            if not items_data:
                return Response({"error": "the cart is empty"}, status=400)

            total_price = data.get('total_price', 0)

            # Create the new Order
            new_order = Order.objects.create(
                user=request.user, 
                total_price=total_price, 
                status='pending'
            )
            
            # Create Order Items from frontend data
            for item in items_data:
                OrderItem.objects.create(
                    order=new_order,
                    product_id=item.get('product'),      # product id from frontend
                    quantity=item.get('quantity'),
                    price=item.get('price')
                )

            # Trigger the email service
            try:
                send_order_confirmation(new_order)
            except Exception as e:
                print(f"Email error: {e}")

            # Return the new order data to React
            serializer = OrderSerializer(new_order)
            return Response(serializer.data, status=201)