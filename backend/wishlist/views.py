from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import WishlistItem
from products.models import Product
from .serializers import WishlistItemSerializer
from django.db import transaction



class WishlistView(APIView) : 
    # before doing anything -> we have to make sure the user is authenticated and have the right permissions 
    authentication_classes = [JWTAuthentication]  # "Identify the user using their JWT token"
    permission_classes = [IsAuthenticated]#  "Only allow access if the user is successfully identified"

    def get (self , request) : 
        
        items = WishlistItem.objects.filter(user=request.user) # It goes to your database table and grabs only the rows where the user ID matches the person currently logged in
        serializer = WishlistItemSerializer(items, many=True) # this convert the python respone into json format so the frontend know how to deal with it 
        return Response(serializer.data) # takes that translated JSON data and sends it back across the internet to your React app with a 200 OK status code.
    
 
    def post(self, request):
            product_id = request.data.get('product_id') # get the product from the front end 

            # 1. Validate Input FIRST
            if not product_id:
                return Response({"error": "product_id is required"}, status=400)

            # 2. Validate Existence
            if not Product.objects.filter(id=product_id).exists():
                return Response({"error": "Product not found"}, status=404)

            # 3.first() here to get the specific object or None
            wishlist_item = WishlistItem.objects.filter(user=request.user, product_id=product_id).first()

            if wishlist_item: # the item exist in the wishlist
                wishlist_item.delete()
                return Response({"message": "Removed", "is_wishlisted": False}, status=200)
            
            WishlistItem.objects.create(user=request.user, product_id=product_id) # none -> added in the list
            return Response({"message": "Added", "is_wishlisted": True}, status=201)