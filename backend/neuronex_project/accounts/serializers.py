from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
        #meta class tells the serializer which model to use and which fields to expose 
    class Meta:
        model=User
        fields=[
            "email",
            "password",
            "first_name",
            "last_name",
            "phno",
            "address",
            "state",
            "pincode",
        ]
        extra_kwargs={
            "password":{"write_only":True}
        }
    def create(self,validated_data):
        return User.objects.create_user(**validated_data) 


from rest_framework import serializers
from accounts.models import User, EmailVerification


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Invalid email or password."}
            )

        if not user.check_password(password):
            raise serializers.ValidationError(
                {"email": "Invalid email or password."}
            )

        if not user.is_active:
            raise serializers.ValidationError(
                {"email": "User account is inactive."}
            )

        verification = EmailVerification.objects.filter(
            user=user
        ).first()

        if not verification or not verification.is_verified:
            raise serializers.ValidationError({
                "email": (
                    "Please verify your email before logging in. "
                    "Check your inbox for the verification link."
                )
            })

        data["user"] = user
        return data
