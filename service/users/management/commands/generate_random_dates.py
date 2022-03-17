from django.core.management.base import BaseCommand
from datetime import timedelta

from django.db.models import F

from todo.models import Todo
from random import randint


class Command(BaseCommand):
    def handle(self, *args, **options):
        for todo in Todo.objects.all():
            days = randint(0, 20)
            todo.created = F('created') - timedelta(days=days)
            todo.save()
