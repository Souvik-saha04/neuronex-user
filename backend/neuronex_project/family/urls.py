
from django.urls import path

from .views import (
    FamilyInvitationView,
    FamilyInvitationResponseView,
    FamilyMemberListView,
    FamilyMemberRemoveView,
    FamilyMemberDocumentsView,
)

urlpatterns = [
    path(
        "invitations/",
        FamilyInvitationView.as_view(),
        name="family-invitations",
    ),

    path(
        "invitations/<uuid:invitation_id>/respond/",
        FamilyInvitationResponseView.as_view(),
        name="family-invitation-response",
    ),

    path(
        "members/",
        FamilyMemberListView.as_view(),
        name="family-members",
    ),

    path(
        "members/<int:member_id>/",
        FamilyMemberRemoveView.as_view(),
        name="family-member-remove",
    ),

    path(
        "members/<int:member_id>/documents/",
        FamilyMemberDocumentsView.as_view(),
        name="family-member-documents",
    ),
]
