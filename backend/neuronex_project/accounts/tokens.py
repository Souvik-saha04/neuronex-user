from django.core import signing
from .models import User
TOKEN_SALT="neuronex.email-verification"

def generate_verification_token(user):
    return signing.dumps(
        {
            "user_id":user.pk,
            "email":user.email,
        },
        salt=TOKEN_SALT
    )

def verify_verification_token(token):
    return signing.loads(
        token,
        salt=TOKEN_SALT,
        max_age=60*60*24
    )