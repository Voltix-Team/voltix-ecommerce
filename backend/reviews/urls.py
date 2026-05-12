from django.urls import path
from .views import ReviewListCreateView, ReviewDetailView

urlpatterns = [
    # GET /api/reviews/?product_id= => list all reviews for product 
    # POST /api/reviews/ => submit a new review
    path('', ReviewListCreateView.as_view(), name='review-list-create'),
    
    # PATCH /api/reviews/id/ => edit your own review
    # DELETE /api/reviews/id/ => delete your own review
    path('<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]