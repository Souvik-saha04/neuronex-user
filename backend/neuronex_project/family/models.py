import uuid

from django.db import models
from django.conf import settings
from django.utils import timezone


class FamilyInvitation(models.Model):

    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("ACCEPTED", "Accepted"),
        ("DECLINED", "Declined"),
        ("EXPIRED", "Expired"),
        ("CANCELLED", "Cancelled"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_family_invitations"
    )

    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="received_family_invitations"
    )
    RELATIONSHIP_CHOICES = [
            ("PARENT", "Parent"),
            ("CHILD", "Child"),
            ("SPOUSE", "Spouse"),
            ("SIBLING", "Sibling"),
            ("GRANDPARENT", "Grandparent"),
            ("GRANDCHILD", "Grandchild"),
            ("OTHER", "Other"),
        ]
    relationship = models.CharField(
        max_length=30,
        choices=RELATIONSHIP_CHOICES,
    )

    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default="PENDING"
    )

    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )

    expires_at = models.DateTimeField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    responded_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(sender=models.F("recipient")),
                name="family_invitation_different_users"
            )
        ]
        indexes = [
            models.Index(fields=["recipient", "status"]),
            models.Index(fields=["sender", "status"]),
        ]

    def is_expired(self):
        return timezone.now() >= self.expires_at

    def __str__(self):
        return (
            f"{self.sender} -> {self.recipient} "
            f"({self.status})"
        )


class FamilyRelationship(models.Model):

    RELATIONSHIP_CHOICES = [
        ("PARENT", "Parent"),
        ("CHILD", "Child"),
        ("SPOUSE", "Spouse"),
        ("SIBLING", "Sibling"),
        ("GRANDPARENT", "Grandparent"),
        ("GRANDCHILD", "Grandchild"),
        ("OTHER", "Other"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="family_relationships"
    )

    family_member = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="connected_to"
    )

    relationship = models.CharField(
        max_length=20,
        choices=RELATIONSHIP_CHOICES
    )

    invitation = models.OneToOneField(
        FamilyInvitation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="created_relationship"
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(user=models.F("family_member")),
                name="family_relationship_different_users"
            ),
            models.UniqueConstraint(
                fields=["user", "family_member"],
                name="unique_direct_family_relationship"
            ),
        ]
        indexes = [
            models.Index(fields=["user", "is_active"]),
            models.Index(fields=["family_member", "is_active"]),
        ]

    def __str__(self):
        return (
            f"{self.user} - {self.family_member} "
            f"({self.relationship})"
        )
