from django.db import models
from uuid import uuid4
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    uid = models.UUIDField(primary_key=True, default=uuid4)
    email = models.EmailField(_('email address'), unique=True)

    def __str__(self):
        if self.first_name:
            return f'{self.first_name} {self.last_name}'
        return self.username
