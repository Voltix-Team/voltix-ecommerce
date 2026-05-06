from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin) :
    # columns shown in the user list in admin panel
    list_display = ['email', 'username', 'is_verified', 'is_active', 'date_joined']
    
    # filters on the right side of the admin list
    list_filter = ['is_verified', 'is_active', 'is_staff']
    
    # fields to search by in the search box
    search_fields = ['email', 'username']
    
    # default sort order 
    ordering = ['date_joined']
    
    # adding custom fields to the admin edit form
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields' : ('phone', 'street', 'suite', 'city', 'state', 'zip', 'country')}),
        ('Verification', {'fields' : ('is_verified', 'otp', 'otp_created_at')}),
    )