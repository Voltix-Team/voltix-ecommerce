from django.contrib.auth.models import AbstractUser
from django.db import models

# for now so i can run migrations

class User(AbstractUser):
    # override email to be unique - we can user it as the login field
    email = models.EmailField(unique=True)
    
    # profile fields - now stored in db not firebase
    phone = models.CharField(max_length=20, blank=True)
    street = models.CharField(max_length=255, blank=True)
    suite = models.CharField(max_length=100, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    zip = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, blank=True)
    
    # tracking whether the user verified their email after signup
    is_verified = models.BooleanField(default=False)
    
    # storing the OTP code for email verification and password reset
    # it can be empty when not in use
    otp = models.CharField(max_length=6, blank=True)
    
    # stores when the OTP was generated so we can expire it after 10 mins
    otp_created_at = models.DateTimeField(null=True, blank=True)

    # telling django to use email instead of username for the login
    USERNAME_FIELD = 'email'
    
    # username is still required when creating a superuser via terminal
    REQUIRED_FIELDS = ['username']
    
    def __str__(self) :
        return self.email