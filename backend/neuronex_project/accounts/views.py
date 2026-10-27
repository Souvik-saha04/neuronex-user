import cloudinary.uploader
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer, LoginSerializer
from .models import MedicalDocument
from django.core import signing
from accounts.tokens import verify_verification_token
from rest_framework_simplejwt.views import TokenObtainPairView

from django.db import transaction

from accounts.models import EmailVerification
from accounts.tasks import send_verification_email
from accounts.tokens import generate_verification_token


ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]
MAX_SIZE = 10 * 1024 * 1024


from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            with transaction.atomic():
                user = serializer.save(is_active=False)

                verification, _ = EmailVerification.objects.get_or_create(
                    user=user
                )

                token = generate_verification_token(user)

                if not verification.is_verified:
                    transaction.on_commit(
                        lambda: send_verification_email.delay(
                            user.pk,
                            token
                        )
                    )

            return Response({
                "message": "Registration successful. Please verify your email before logging in.",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email
                }
            }, status=status.HTTP_201_CREATED)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data["user"]

            if not user.is_active:
                return Response({
                    "message": "Please verify your email before logging in."
                }, status=status.HTTP_403_FORBIDDEN)

            refresh = RefreshToken.for_user(user)

            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "address": user.address,
                    "state": user.state,
                    "pincode": user.pincode,
                    "phno": user.phno
                }
            }, status=status.HTTP_200_OK)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "email": request.user.email
        })


class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        file = request.FILES.get("file")

        if not file:
            return Response({"error": "file is required"}, status=status.HTTP_400_BAD_REQUEST)

        if file.content_type not in ALLOWED_TYPES:
            return Response(
                {"error": "Only PDF, JPG and PNG files are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if file.size > MAX_SIZE:
            return Response(
                {"error": "File must be 10MB or smaller"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            upload_result = cloudinary.uploader.upload(
                file,
                folder="medaxis_documents",
                resource_type="auto",
            )
        except Exception as e:
            print("CLOUDINARY ERROR:", repr(e))
            return Response(
                {"error": "Could not upload file to Cloudinary"},
                status=status.HTTP_502_BAD_GATEWAY
            )

        document = MedicalDocument.objects.create(
            user=request.user,
            title=request.data.get("title") or file.name,
            document_type=request.data.get("document_type", "OTHER"),
            description=request.data.get("description", ""),
            file_url=upload_result["secure_url"],
            file_name=file.name,
            file_size=file.size,
            file_type=file.content_type,
        )

        return Response({
            "message": "Document uploaded successfully",
            "document": {
                "id": document.id,
                "title": document.title,
                "document_type": document.document_type,
                "document_date": document.document_date,
                "file_url": document.file_url,
                "file_name": document.file_name,
                "file_size": document.file_size,
                "uploaded_at": document.uploaded_at,
            }
        }, status=status.HTTP_201_CREATED)


class DocumentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        documents = MedicalDocument.objects.filter(user=request.user)

        data = [
            {
                "id": doc.id,
                "title": doc.title,
                "document_type": doc.document_type,
                "document_date": doc.document_date,
                "file_url": doc.file_url,
                "file_name": doc.file_name,
                "file_size": doc.file_size,
                "file_type": doc.file_type,
                "uploaded_at": doc.uploaded_at,
            }
            for doc in documents
        ]

        return Response(data, status=status.HTTP_200_OK)


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        token = request.data.get("token")

        if not token:
            return Response(
                {"error": "Verification token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payload = verify_verification_token(token)
        except signing.SignatureExpired:
            return Response(
                {"error": "Verification link has expired. Please request a new one."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except signing.BadSignature:
            return Response(
                {"error": "Invalid verification token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_id = payload.get("user_id")
        email = payload.get("email")

        if not user_id or not email:
            return Response(
                {"error": "Invalid verification token."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(
            pk=user_id,
            email__iexact=email,
        ).first()

        if not user:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        verification = EmailVerification.objects.filter(
            user=user
        ).first()

        if not verification:
            return Response(
                {"error": "Verification record not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if verification.is_verified:
            return Response(
                {"message": "Email already verified."},
                status=status.HTTP_200_OK,
            )

        verification.is_verified = True
        verification.save(update_fields=["is_verified"])

        user.is_active = True
        user.save(update_fields=["is_active"])

        return Response(
            {"message": "Email verified successfully."},
            status=status.HTTP_200_OK,
        )


from .models import User
class ResendVerificationEmailView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        email = request.data.get("email", "").strip()

        if email:
            user = User.objects.filter(
                email__iexact=email
            ).first()

            if user:
                verification = (
                    EmailVerification.objects.filter(
                        user=user
                    ).first()
                )

                if (
                    verification
                    and not verification.is_verified
                ):
                    token = generate_verification_token(user)

                    transaction.on_commit(
                        lambda: send_verification_email.delay(
                            user.pk,
                            token
                        )
                    )

        return Response(
            {
                "message": (
                    "If an unverified account exists for "
                    "that email, a verification email "
                    "will be sent."
                )
            },
            status=status.HTTP_200_OK
        )