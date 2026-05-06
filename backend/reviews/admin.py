from django.contrib import admin
from .models import Review

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin) :
    # columns shown in the review list
    list_display = ['user', 'product', 'rating', 'created_at']
    
    # filters on the right side
    list_filter = ['rating']
    
    # search by reviewer email or product name
    search_fields = ['user__email', 'product__name']
    
    # newest first
    ordering = ['-created_at']