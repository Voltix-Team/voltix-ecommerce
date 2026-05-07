from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CartViewSet

# router automatically creates these URLs:
# GET    /api/cart/          → list    → get current user's cart
# POST   /api/cart/          → create  → add item to cart
# PATCH  /api/cart/{id}/     → partial_update → update item quantity
# DELETE /api/cart/{id}/     → destroy → remove specific item
# DELETE /api/cart/clear/    → clear   → remove all items
router = DefaultRouter()
router.register(r'', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),
]