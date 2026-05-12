from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticatedOrReadOnly
from .models import Product
from .serializers import ProductSerializer
from rest_framework.parsers import MultiPartParser, FormParser # Import these for images

# Change ReadOnlyModelViewSet -> ModelViewSet
class ProductViewSet(viewsets.ModelViewSet):
    # This allows public viewing, but requires a login to Add/Edit/Delete
    permission_classes = [IsAuthenticatedOrReadOnly] 
    
    serializer_class = ProductSerializer
    
    # You MUST uncomment these to handle image uploads from Postman
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')

        if category and category != 'all':
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset