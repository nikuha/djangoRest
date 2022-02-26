from django.core.management.base import BaseCommand
from users.models import User
from random import choice
from string import ascii_lowercase


def random_string(length):
    letters = ascii_lowercase
    return ''.join(choice(letters) for i in range(length))


class Command(BaseCommand):
    def handle(self, *args, **options):

        if not User.objects.filter(username='django').exists():
            User.objects.create_superuser(username='django', email='django@rest.local', password='geekbrains')

        for i in range(1, 10):
            email = f'{random_string(10)}@{random_string(5)}.{random_string(2)}'
            User.objects.create(username=random_string(10), email=email, first_name=random_string(8),
                                last_name=random_string(10))
