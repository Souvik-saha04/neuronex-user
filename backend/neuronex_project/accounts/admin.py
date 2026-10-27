from django.contrib import admin
from .models import User,MedicalDocument, EmailVerification
# Register your models here.
admin.site.register(User)
admin.site.register(MedicalDocument)
admin.site.register(EmailVerification)