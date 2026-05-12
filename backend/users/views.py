from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from django.contrib.auth import update_session_auth_hash

from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    VerifyEmailSerializer,
)
from .utils import (
    send_verification_email,
    send_password_reset_email,
    is_otp_valid,
    clear_otp,
)

class RegisterView(APIView) :
    # allow only - anyone can register, no token needed
    permission_classes = [AllowAny]
    
    def post(self, request) :
        serializer = RegisterSerializer(data=request.data)
        
        if serializer.is_valid() :
            user = serializer.save()
            # send verification email with OTP
            # --- ADD THIS PRINT HERE ---
            print(f"DEBUG: OTP for {user.email} is {user.otp}")
            # ---------------------------
            send_verification_email(user)
            
            return Response({
                "message" : "Account created. Please check your email for verification code.",
                "user_id" : user.id,
                "email" : user.email,
            }, status=status.HTTP_201_CREATED)
            
        # return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class VerifyEmailView(APIView) :
    # user is not logged in yet when verifying
    permission_classes = [AllowAny]
    
    def post(self, request) :
        serializer = VerifyEmailSerializer(data=request.data)
        
        if serializer.is_valid() :
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            
            try :
                user = User.objects.get(email=email)
            except User.DoesNotExist :
                return Response({"error" : "User Not Found."}, status=status.HTTP_404_NOT_FOUND)
            
            if user.is_verified :
                return Response({"message" : "Email is already verified."}, status=status.HTTP_200_OK)
            
            # check otp is correct and not expired
            if not is_otp_valid(user, otp) :
                return Response({"error" : "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
            
            # mark user as verified and clear otp
            user.is_verified = True
            user.save()
            clear_otp(user)
            
            return Response({"message" : "Email verified successfully. You can now log in."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class LoginView(APIView) :
    # user is not logged in yet
    permission_classes = [AllowAny]
    
    def post(self, request) :
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid() :
            user = serializer.validated_data['user']
            
            # generate JWT tokens for this user
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "access" : str(refresh.access_token),
                "refresh" : str(refresh),
                "user" : {
                    "id" : user.id,
                    "email" : user.email,
                    "username" : user.username,
                    "is_verified" : user.is_verified,
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutView(APIView) :
    # must be logged in to logout
    permission_classes = [IsAuthenticated]
    
    def post(self, request) :
        try : 
            # get the refresh token from the request body
            refresh_token = request.data.get("refresh")
            
            if not refresh_token :
                return Response({"error" : "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)
            
            # blacklist the refresh token so it cannot be used again
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response({"message" : "Logged out successfully."}, status=status.HTTP_200_OK)
        
        except TokenError :
            return Response({"error" : "Invalid or expired refresh token."}, status=status.HTTP_400_BAD_REQUEST)
        
class ProfileView(APIView) :
    # must be logged in to view or update profile
    permission_classes = [IsAuthenticated]
    
    def get(self, request) :
        # request.user is automatically set by JWT authentication middleware
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def patch(self, request) : 
        # partial=true means only send the fields you want to update
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid() :
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ChangePasswordView(APIView) :
    permission_classes = [IsAuthenticated]
    
    def post(self, request) :
        serializer = ChangePasswordSerializer(data=request.data)
        
        if serializer.is_valid() :
            user = request.user
            old_password = serializer.validated_data['old_password']
            new_password = serializer.validated_data['new_password']
            
            # verify the old password is correct before allowing change
            if not user.check_password(old_password) :
                return Response({"old_password" : "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
            
            # set and save the new password
            user.set_password(new_password)
            user.save()
            
            return Response({"message" : "Password changed successfully."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class PasswordResetRequestView(APIView) :
    # user is not logged in when they forgot their password
    permission_classes = [AllowAny]
    
    def post(self, request) :
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid() :
            email = serializer.validated_data['email']
            
            try :
                user = User.objects.get(email=email)
                send_password_reset_email(user)
            except User.DoesNotExist :
                # we do not reveal whether the email exists - security best practice
                pass
            
            # always return success so attackers cannot enumerate emails
            return Response({
                "message" : "If this email is registered, a rest code has been sent."
            }, status=status.HTTP_200_OK)
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class PasswordResetConfirmView(APIView) :
    permission_classes = [AllowAny]
    
    def post(self, request) :
        serializer = PasswordResetConfirmSerializer(data=request.data)
        
        if serializer.is_valid() :
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            new_password = serializer.validated_data['new_password']
            
            try :
                user = User.objects.get(email=email)
            except User.DoesNotExist :
                return Response({"error" : "User Not Found."}, status=status.HTTP_404_NOT_FOUND)
            
            # validate the otp
            if not is_otp_valid(user, otp) :
                return Response({"error" : "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)
            
            # set the new password and clear the otp
            user.set_password(new_password)
            user.save()
            clear_otp(user)
            
            return Response({"message" : "Password reset successfully. You can now log in with your new password."}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)