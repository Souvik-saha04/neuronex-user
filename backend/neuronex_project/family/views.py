
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction
from .tasks import send_family_invitation_email
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import FamilyInvitation, FamilyRelationship

from accounts.models import MedicalDocument


User = get_user_model()


class FamilyInvitationView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        invitations = FamilyInvitation.objects.filter(
            Q(sender=request.user) | Q(recipient=request.user)
        ).select_related("sender", "recipient").order_by("-created_at")

        data = []

        for invitation in invitations:
            data.append({
                "id": str(invitation.id),
                "sender": invitation.sender.email,
                "recipient": invitation.recipient.email,
                "relationship": invitation.relationship,
                "status": invitation.status,
                "created_at": invitation.created_at,
                "expires_at": invitation.expires_at,
                "is_sender": invitation.sender_id == request.user.id,
            })

        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        email = request.data.get("email", "").strip().lower()
        relationship = request.data.get("relationship", "").upper()

        if not email:
            return Response(
                {"error": "Family member email is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if relationship not in dict(
            FamilyRelationship.RELATIONSHIP_CHOICES
        ):
            return Response(
                {"error": "Invalid family relationship."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if email == request.user.email.lower():
            return Response(
                {"error": "You cannot add yourself as a family member."},
                status=status.HTTP_400_BAD_REQUEST
            )

        recipient = User.objects.filter(
            email__iexact=email,
            is_active=True
        ).first()

        if not recipient:
            return Response(
                {
                    "message": (
                        "This user does not exist on Neuronex. "
                        "Ask them to register before connecting."
                    ),
                    "registration_required": True,
                },
                status=status.HTTP_404_NOT_FOUND
            )

        relationship_exists = FamilyRelationship.objects.filter(
            Q(user=request.user, family_member=recipient)
            | Q(user=recipient, family_member=request.user),
            is_active=True
        ).exists()

        if relationship_exists:
            return Response(
                {"error": "You are already connected to this user."},
                status=status.HTTP_400_BAD_REQUEST
            )

        pending_exists = FamilyInvitation.objects.filter(
            sender=request.user,
            recipient=recipient,
            status="PENDING",
            expires_at__gt=timezone.now()
        ).exists()

        if pending_exists:
            return Response(
                {"error": "An invitation is already pending."},
                status=status.HTTP_400_BAD_REQUEST
            )

        invitation = FamilyInvitation.objects.create(
            sender=request.user,
            recipient=recipient,
            relationship=relationship,
            expires_at=timezone.now() + timedelta(days=7)
        )
        transaction.on_commit(
            lambda: send_family_invitation_email.delay(str(invitation.id))
        )

        return Response(
            {
                "message": "Family connection invitation created.",
                "invitation_id": str(invitation.id),
                "recipient": recipient.email,
                "status": invitation.status,
            },
            status=status.HTTP_201_CREATED
        )


class FamilyInvitationResponseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, invitation_id):
        action = request.data.get("action", "").lower()

        if action not in ["accept", "decline"]:
            return Response(
                {"error": "Action must be accept or decline."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            invitation = get_object_or_404(
                FamilyInvitation.objects.select_for_update(),
                id=invitation_id,
                recipient=request.user
            )

            if invitation.status != "PENDING":
                return Response(
                    {"error": "This invitation is no longer pending."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if invitation.is_expired():
                invitation.status = "EXPIRED"
                invitation.save(update_fields=["status"])

                return Response(
                    {"error": "This invitation has expired."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if action == "decline":
                invitation.status = "DECLINED"
                invitation.responded_at = timezone.now()
                invitation.save(
                    update_fields=["status", "responded_at"]
                )

                return Response({
                    "message": "Family invitation declined."
                })

            relationship, created = FamilyRelationship.objects.get_or_create(
                user=invitation.sender,
                family_member=invitation.recipient,
                defaults={
                    "relationship": invitation.relationship,
                    "invitation": invitation,
                    "is_active": True,
                }
            )

            if not created:
                if relationship.is_active:
                    return Response(
                        {"error": "You are already connected."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                relationship.relationship = invitation.relationship
                relationship.invitation = invitation
                relationship.is_active = True
                relationship.save()

            invitation.status = "ACCEPTED"
            invitation.responded_at = timezone.now()
            invitation.save(
                update_fields=["status", "responded_at"]
            )

        return Response({
            "message": "Family connection established successfully."
        })


class FamilyMemberListView(APIView):
    permission_classes = [IsAuthenticated]

    # List all connected family members.
    def get(self, request):
        relationships = FamilyRelationship.objects.filter(
            Q(user=request.user) | Q(family_member=request.user),
            is_active=True
        ).select_related("user", "family_member")

        members = []

        for relationship in relationships:
            if relationship.user_id == request.user.id:
                member = relationship.family_member
                relation = relationship.relationship
            else:
                member = relationship.user
                relation = relationship.relationship

            members.append({
                "relationship_id": str(relationship.id),
                "user_id": member.id,
                "email": member.email,
                "first_name": member.first_name,
                "last_name": member.last_name,
                "relationship": relation,
                "connected_at": relationship.created_at,
            })

        return Response(members, status=status.HTTP_200_OK)


class FamilyMemberRemoveView(APIView):
    permission_classes = [IsAuthenticated]

    # Either connected user can remove the relationship.
    def delete(self, request, member_id):
        relationship = get_object_or_404(
            FamilyRelationship,
            Q(user=request.user, family_member_id=member_id)
            | Q(user_id=member_id, family_member=request.user),
            is_active=True
        )

        relationship.is_active = False
        relationship.save(update_fields=["is_active", "updated_at"])

        return Response(
            {"message": "Family connection removed successfully."},
            status=status.HTTP_200_OK
        )


class FamilyMemberDocumentsView(APIView):
    permission_classes = [IsAuthenticated]

    # View the medical documents of a connected family member.
    def get(self, request, member_id):
        member = get_object_or_404(
            User,
            id=member_id,
            is_active=True
        )

        connected = FamilyRelationship.objects.filter(
            Q(user=request.user, family_member=member)
            | Q(user=member, family_member=request.user),
            is_active=True
        ).exists()

        if not connected:
            return Response(
                {"error": "You are not connected to this family member."},
                status=status.HTTP_403_FORBIDDEN
            )

        documents = MedicalDocument.objects.filter(
            user=member
        ).order_by("-uploaded_at")

        data = []

        for document in documents:
            data.append({
                "id": document.id,
                "title": document.title,
                "document_type": document.document_type,
                "description": document.description,
                "document_date": document.document_date,
                "file_name": document.file_name,
                "file_size": document.file_size,
                "file_type": document.file_type,
                "file_url": document.file_url,
                "uploaded_at": document.uploaded_at,
            })

        return Response(data, status=status.HTTP_200_OK)
