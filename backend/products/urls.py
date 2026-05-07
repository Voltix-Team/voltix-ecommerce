from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet

# router automatically creates these URLs:
# GET /api/products/        → list all products
# GET /api/products/1/      → single product detail
router = DefaultRouter()
router.register(r'', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]