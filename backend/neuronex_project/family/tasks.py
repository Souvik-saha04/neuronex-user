
from urllib.parse import urlencode

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from .models import FamilyInvitation


@shared_task(
    bind=True,
    max_retries=3,
    default_retry_delay=30
)
def send_family_invitation_email(self, invitation_id):
    try:
        invitation = FamilyInvitation.objects.select_related(
            "sender",
            "recipient"
        ).get(pk=invitation_id)
        if invitation.status != "PENDING":
            return "Invitation is no longer pending."

        if invitation.is_expired():
            invitation.status = "EXPIRED"
            invitation.save(update_fields=["status"])
            return "Invitation has expired."

        query = urlencode({
            "token": str(invitation.token)
        })

        invitation_url = (
            f"{settings.FRONTEND_URL.rstrip('/')}"
            f"/family/invitations/accept?id={invitation.id}"
        )

        sender_name = (
            f"{invitation.sender.first_name} "
            f"{invitation.sender.last_name}"
        ).strip() or invitation.sender.email

        relationship = invitation.get_relationship_display()

        subject = "Family Connection Invitation - Neuronex"

        message = (
            f"Hello {invitation.recipient.first_name or 'there'},\n\n"
            f"{sender_name} has invited you to connect with them "
            f"on Neuronex as their {relationship.lower()}.\n\n"
            "Accepting this invitation will establish a family "
            "connection. Connected family members can view each "
            "other's medical reports according to Neuronex's "
            "family-sharing rules.\n\n"
            "To review this invitation, open the link below:\n\n"
            f"{invitation_url}\n\n"
            "Please sign in to Neuronex before accepting. "
            "If you do not have an account, register first.\n\n"
            "This invitation expires after 7 days.\n\n"
            "If you were not expecting this invitation, you can "
            "ignore this email.\n\n"
            "Regards,\n"
            "Neuronex Team"
        )

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[invitation.recipient.email],
            fail_silently=False,
        )

        return "Family invitation email sent successfully."

    except FamilyInvitation.DoesNotExist:
        return "Invitation not found."

    except Exception as exc:
        raise self.retry(exc=exc)
