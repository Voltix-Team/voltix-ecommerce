# admin.py
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Fixed: added 'discount_percentage' to this list
    list_display = (
        'name', 
        'category', 
        'price', 
        'stock', 
        'brand', 
        'rating', 
        'discount_percentage'  # Must be here to be editable below
    )
    
    # Allow quick updates for these fields
    list_editable = ('price', 'stock', 'rating', 'discount_percentage')
    
    # Filters on the right sidebar
    list_filter = ('category', 'brand')
    
    # Search functionality
    search_fields = ('name', 'description', 'brand', 'category')
    
    # Organize the layout of the "Edit" page
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'brand', 'category', 'rating')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'discount_percentage', 'stock')
        }),
        ('Media', {
            'fields': ('thumbnail',)
        }),
    )