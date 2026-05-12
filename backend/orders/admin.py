from django.contrib import admin

from .models import Order, OrderItem

# This allows you to see OrderItems inside the Order page (very professional!)
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0 # No empty extra rows
    readonly_fields = ('product', 'quantity', 'price') # Safety check

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'total_price', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    inlines = [OrderItemInline]

admin.site.register(OrderItem)