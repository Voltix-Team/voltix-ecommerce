from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
import random
from django.utils import timezone

class RegisterSerializer(serializers.ModelSerializer):
    # write-only = true so the password is not returned in the API response
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        # fields the frontend sends when signing up
        fields = ['id', 'username', 'email', 'password', 'password2']

    def validate(self, data) :
        # checking if both passwords match
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password" : "Passwords do not match."})
        return data
    
    def validate_email(self, value) :
        # checking if email already registered
        if User.objects.filter(email=value).exists() :
            raise serializers.ValidationError({"email" : "Email already registered."})
        return value

    def create(self, validated_data):
        # remove password2 - we do not store it
        validated_data.pop('password2')
        
        # create_user handles password hashing automatically
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        # --- FIX STARTS HERE ---
        # 1. Generate a random 6-digit code
        user.otp = str(random.randint(100000, 999999)) 
        
        # 2. Store the current time so the 10-minute expiry works
        user.otp_created_at = timezone.now()
        
        # 3. Save the user again to store the OTP and timestamp in the DB
        user.save()
        # --- FIX ENDS HERE ---
        
        return user
    
class LoginSerializer(serializers.Serializer) : 
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data) :
        # authenticate checks email and password against the db
        user = authenticate(username=data['email'], password=data['password'])
        
        if not user : 
            raise serializers.ValidationError("Invalid email or password.")
        
        if not user.is_active :
            raise serializers.ValidationError("User account has been deactivated.")
        
        # attaching the user object so the view can access it
        data['user'] = user
        return data
    
class UserProfileSerializer(serializers.ModelSerializer) :
    # read only so the email is returned but cannot be changed via the serializer
    email = serializers.EmailField(read_only=True)
    
    class Meta :
        model = User
        fields = ['id', 'username', 'email', 
                    'phone', 'street', 'suite', 
                    'city', 'state', 'zip', 'country',
                    'is_verified' ]
        
        # is verified is set by the backend only - user cannot change it
        read_only_fields = ['is_verified']
        
class ChangePasswordSerializer(serializers.Serializer) :
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data) :
        # check if new passwords match
        if data['new_password'] != data['new_password2'] :
            raise serializers.ValidationError({"new_password" : "New passwords do not match."})
        return data
    
class PasswordResetRequestSerializer(serializers.Serializer) :
    # frontend sends just the email to request a reset
    email = serializers.EmailField()
    
    def validate_email(self, value) :
        # we do not tell the user if the email is registered or not for security reasons
        return value
    
class PasswordResetConfirmSerializer(serializers.Serializer) :
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, min_length=8)
    
    def validate(self, data) :
        if data['new_password'] != data['new_password2'] :
            raise serializers.ValidationError({"new_password" : "New passwords do not match."})     
        return data
    
class VerifyEmailSerializer(serializers.Serializer) :
    # user provides their email and the otp they received after signup
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)