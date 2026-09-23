from django.shortcuts import render
from .serializers import RegisterSerializer,LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework_simplejwt.

class RegisterView(APIView):
    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            return Response({
                "message":"user created successfully",
                "user":{
                    "id":user.id,
                    "first_name":user.first_name,
                    "last_name":user.last_name,
                    "email":user.email
                }
            },
            status=status.HTTP_201_CREATED
            )

class LoginView(APIView):
    def post(self,request):
        serializer=LoginSerializer( data=request.data)
        if serializer.is_valid():
            user=serializer.validated_data["user"]
            return Response(
                {
                    "message": "Login successful",
                    "user": {
                        "id": user.id,
                        "email": user.email,
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                    }
                },
                status=status.HTTP_200_OK
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )