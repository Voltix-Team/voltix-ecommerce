from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User
import random
from django.utils import timezone

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model  = User
        fields = ['id', 'username', 'email', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return data

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError({"email": "Email already registered."})
        return value

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        user.otp           = str(random.randint(100000, 999999))
        user.otp_created_at = timezone.now()
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['email'], password=data['password'])

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.is_active:
            raise serializers.ValidationError("User account has been deactivated.")

        # ── BUG FIX ──────────────────────────────────────────────────────────
        # Previously missing: unverified users could log in and receive valid
        # JWT tokens. Now we block them here with a clear message so the
        # frontend can tell the user to check their email.
        if not user.is_verified:
            raise serializers.ValidationError(
                "Please verify your email before logging in."
            )
        # ─────────────────────────────────────────────────────────────────────

        data['user'] = user
        return data


class UserProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(read_only=True)

    class Meta:
        model  = User
        fields = [
            'id', 'username', 'email',
            'phone', 'street', 'suite',
            'city', 'state', 'zip', 'country',
            'is_verified',
        ]
        read_only_fields = ['is_verified']


class ChangePasswordSerializer(serializers.Serializer):
    old_password  = serializers.CharField(write_only=True)
    new_password  = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password": "New passwords do not match."})
        return data


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    email         = serializers.EmailField()
    otp           = serializers.CharField(max_length=6)
    new_password  = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True, min_length=8)

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({"new_password": "New passwords do not match."})
        return data


class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp   = serializers.CharField(max_length=6)