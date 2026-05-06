from django.urls import path
from .views import (
    RegisterView,
    VerifyEmailView,
    LoginView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    PasswordResetRequestView,
    PasswordResetConfirmView
)

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # POST /api/auth/register/ => create new account
    path('register/', RegisterView.as_view(), name='register'),
    
    # POST /api/auth/verify-email/ => verify email with otp after signup
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    
    # POST /apu/auth/login/ => login with email and password, returns JWT tokens
    path('login/', LoginView.as_view(), name='login'),
    
    # POST /api/logout/ => blacklist refresh token
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # POST /api/auth/token/refresh/ => get new access token using refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # GET /api/auth/me/ => get current user profile
    # PATCH /api/auth/me/ => update current user profile
    path('me/', ProfileView.as_view(), name='profile'),
    
    # POST /api/auth/change-password/ => change password - requires old password
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # POST /api/auth/password-reset/ => request reset otp via email
    path('password-reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    
    # POST /api/auth/password-reset-confirm/ => confirm password reset with otp and set new password
    path('password-reset-confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
