from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Review
from .serializers import ReviewSerializer

class ReviewListCreateView(APIView) :
    # anyone can read reviews, but only authenticated users can create
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request) :
        # ?product=5 → filter reviews for product with id=5
        product_id = request.query_params.get('product')
        
        if not product_id :
            return Response(
                {"error" : "Product ID is required as a query parameter."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        reviews = Review.objects.filter(product_id=product_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request) :
        # pass request in context so serializer can access request.user
        serializer = ReviewSerializer(data=request.data, context={'request' : request})
        
        if serializer.is_valid() :
            # save the review, automatically setting the user to the logged in user
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class ReviewDetailView(APIView) :
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_object(self, pk, user) :
        try :
            # only return the review if it belongs to this user
            return Review.objects.get(pk=pk, user=user)
        except Review.DoesNotExist :
            return None
        
    def delete(self, request, pk) :
        review = self.get_object(pk, request.user)
        
        if not review :
            return Response({
                "error" : "Review not found or you do not own this review."},
                            status=status.HTTP_404_NOT_FOUND
            )
            
        review.delete()
        return Response({"message" : "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    def patch(self, request, pk) :
        review = self.get_object(pk, request.user)
        
        if not review :
            return Response({
                "error" : "Review not found or you do not own this review."},
                status=status.HTTP_404_NOT_FOUND
            )
            
        # only update the fields that are provided in the request
        serializer = ReviewSerializer(review, data=request.data, partial=True, context={'request' : request})
        
        if serializer.is_valid() :
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)