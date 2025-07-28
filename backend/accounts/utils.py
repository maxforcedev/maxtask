import secrets
from django.utils import timezone
from datetime import timedelta
from .models import PasswordResetToken


def generate_token(length):
    return secrets.token_urlsafe(length)


def create_reset_token(user):
    token = generate_token(45)

    if token and user:
        PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=timezone.now() + timedelta(days=1)
        )
        return token
    return None
