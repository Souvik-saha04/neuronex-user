import cloudinary.uploader
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, LoginSerializer
from .models import MedicalDocument

ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]
MAX_SIZE = 10 * 1024 * 1024


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "user created successfully",
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email
                }
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data["user"]
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

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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