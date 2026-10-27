from urllib.parse import urlencode

from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

User=get_user_model()

@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=30
)
def send_verification_email(self,user_id,token):
    try:
        user=User.objects.get(pk=user_id)
        query=urlencode({"token":token})
        verification_url=f"{settings.FRONTEND_URL}/accounts/verify-email?{query}"
        subject="verification of email"
        message=(
            f"Hi {user.get_username()}, \n \n "
            "Thank you for registering into NEURONEX \n"
            "verfy your EMAIL to continue\n"
            "CLICK : "
            f"{verification_url}"
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[user.email],
            fail_silently=False,
        )
    except Exception as exp:
        raise self.retry(exc=exp)