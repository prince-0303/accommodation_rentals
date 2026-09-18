from django.contrib.auth.models import AbstractUser, UserManager as DefaultUserManager
from django.db import models

class UserManager(DefaultUserManager):
    def create_superuser(self, username, email=None, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')  # Automatically assign the admin role

        return self._create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        USER = 'user', 'User'
        ADMIN = 'admin', 'Admin'
    
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.USER)
    phone = models.CharField(max_length=20, blank=True, null=True)

    objects = UserManager()

    def is_admin(self):
        return self.role == self.Role.ADMIN