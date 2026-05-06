import random
from django.core.mail import send_mail # importing built in function to send email
from django.conf import settings # importing settings to access email configuration
from django.utils import timezone # importing timezone to set expiration time for OTP

def generate_otp():
    # generate a random 6 digit OTP
    return str(random.randint(100000, 999999))

def send_verification_email(user) :
    # Fetch the OTP that was already generated and saved in the Serializer
    otp = user.otp 
    
    send_mail(
        subject = "Verify your Voltix account",
        message = f"Hi {user.username}, \n\nYour Verification code is : {otp}\n\nThis code expires in 10 minutes.\n\n Voltix Team.",
        from_email= settings.DEFAULT_FROM_EMAIL,
        recipient_list = [user.email],
        # raising an error if the email fails 
        fail_silently = False,
    )
    
def send_password_reset_email(user) : 
    # called when user requests a password reset, generates a new otp and emails it
    otp = generate_otp()
    
    user.otp = otp
    user.otp_created_at = timezone.now()
    user.save()
    
    send_mail(
        subject = "Reset your Voltix password",
        message = f"Hi {user.username},\n\nYour password reset code is: {otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, ignore this email.\n\nVoltix Team",
        from_email     = settings.DEFAULT_FROM_EMAIL,
        recipient_list = [user.email],
        fail_silently  = False,
    )

def is_otp_valid(user, otp) :
    # checks : 1. the otp matches what is stored on the user
    #          2. the otp was created within the last 10 mins
    # returns true if both conditions pass, false otherwise
    
    # FIX: We now check if the timestamp is missing (not if it exists)
    if not user.otp or not user.otp_created_at :
        return False
    
    # check OTP matches 
    if user.otp != otp :
        return False
    
    # checking if OTP is expired (older than 10 mins)
    expiry_time = user.otp_created_at + timezone.timedelta(minutes=10)
    if timezone.now() > expiry_time :     
        return False                    
    
    return True

def clear_otp(user) :
    # called after otp is successfully used, clears it so it cannot be reused
    user.otp = ''
    user.otp_created_at = None      
    user.save()