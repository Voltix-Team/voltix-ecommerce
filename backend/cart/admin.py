from django.contrib import admin
from .models import Cart, CartItem

class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0  # Removes empty placeholder rows
    fields = ('product', 'quantity', 'subtotal')
    readonly_fields = ('subtotal',) # Property from your model

@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'item_count', 'total_price', 'created_at')
    inlines = [CartItemInline]
    readonly_fields = ('total_price', 'created_at')

    def item_count(self, obj):
        return obj.items.count()
    item_count.short_description = 'Total Items'

    def total_price(self, obj):
        # Displays the @property from your Cart model
        return f"${obj.total_price:.2f}"
    total_price.short_description = 'Cart Total'

# Optional: Register CartItem separately if you need to search for specific items
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('product', 'cart', 'quantity', 'subtotal')
    list_filter = ('product__category',)