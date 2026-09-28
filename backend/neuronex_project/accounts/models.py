from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.contrib.auth.base_user import BaseUserManager
from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self,email,password=None,**extra_fields):
        if not email:
            raise ValueError("email not found")
        email=self.normalize_email(email)
        user=self.model(email=email,**extra_fields)
        user.set_password(password)
        user.save(using = self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("is_staff",True)
        extra_fields.setdefault("is_superuser",True)
        extra_fields.setdefault("is_active",True)
        if(extra_fields.get("is_superuser") is not True):
            raise ValueError("Superuser must have is_superuser = True")
        if(extra_fields.get("is_staff") is not True):
            raise ValueError("Superuser must have is_staff = True")
        return self.create_user(email,password, **extra_fields)
        
class User(AbstractBaseUser, PermissionsMixin):

    email = models.EmailField(
        unique=True
    )

    first_name = models.CharField(
        max_length=100
    )

    last_name = models.CharField(
        max_length=100
    )

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )
    address=models.CharField(max_length=200,blank=True, null=True, default="")
    state=models.CharField(max_length=50,blank=True, null=True, default="")
    pincode=models.CharField(max_length= 6 ,blank=True,null = True)
    phno=models.CharField(max_length=10, blank=True , default="")

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email





class MedicalDocument(models.Model):

    DOCUMENT_TYPES = [
        ("REPORT", "Medical Report"),
        ("PRESCRIPTION", "Prescription"),
        ("SCAN", "Scan / Imaging"),
        ("LAB", "Lab Report"),
        ("DISCHARGE", "Discharge Summary"),
        ("OTHER", "Other"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="medical_documents"
    )

    title = models.CharField(max_length=200)

    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPES,
        default="OTHER"
    )

    description = models.TextField(blank=True)

    document_date = models.DateField(
        null=True,
        blank=True
    )

    file_url = models.URLField()

    file_name = models.CharField(max_length=255)

    file_size = models.PositiveIntegerField(
        help_text="File size in bytes"
    )

    file_type = models.CharField(
        max_length=100
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return self.title