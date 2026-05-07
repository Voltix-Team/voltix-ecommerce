from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # What columns to show in the list
    list_display = ('name', 'category', 'price', 'stock', 'brand', 'discount_percentage')
    
    # Allow quick updates for stock and price directly in the table
    list_editable = ('price', 'stock', 'discount_percentage')
    
    # Filters on the right sidebar
    list_filter = ('category', 'brand')
    
    # Search functionality
    search_fields = ('name', 'description', 'brand', 'category')
    
    # Organize the layout of the "Edit" page
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'brand', 'category')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'discount_percentage', 'stock')
        }),
        ('Media', {
            'fields': ('thumbnail',)
        }),
    )