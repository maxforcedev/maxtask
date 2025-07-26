from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):

    def create_user(self, phone, email, password=None, **extra_fields):

        if not email:
            raise ValueError(("O campo email é obrigatorio."))

        if not phone:
            raise ValueError(("O campo telefone é obrigatorio."))

        email = self.normalize_email(email)
        user = self.model(email=email, phone=phone, **extra_fields)

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(('Usuario deve ter is_staff=True.'))

        if extra_fields.get('is_superuser') is not True:
            raise ValueError(('Usuario deve ter is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)
