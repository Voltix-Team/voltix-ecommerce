from django.core.mail import send_mail
from django.conf import settings

def send_order_confirmation(order):
    """
    Sends a confirmation email to the user after a successful purchase.
    """
    subject = f"Voltix Order Confirmed - #{order.id}"
    
    # We use the user's data from the related User model
    message = (
        f"Hi {order.user.username},\n\n"
        f"Thank you for shopping with Voltix! Your order #{order.id} has been received.\n"
        f"Total Amount: ${order.total_price}\n\n"
        "We will send you another update once your items are shipped."
    )
    
    # This uses the credentials you just set up in settings.py
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [order.user.email], # Make sure the user has an email in the DB
        fail_silently=False, 
    )