import random
from lorem_text import lorem
from django.core.management.base import BaseCommand

from todo.models import Project, Todo
from users.models import User
from random import choice
from string import ascii_lowercase


# def random_string(length):
#     letters = ascii_lowercase
#     return ''.join(choice(letters) for i in range(length))


class Command(BaseCommand):
    def handle(self, *args, **options):

        if not User.objects.filter(username='django').exists():
            User.objects.create_superuser(username='django', email='django@rest.local', password='geekbrains')

        users = []
        for i in range(1, 10):
            username = lorem.words(1)
            email = f'{username}@{lorem.words(1)}.com'
            user = User.objects.create(username=lorem.words(1), email=email, first_name=lorem.words(1).capitalize(),
                                       last_name=lorem.words(1).capitalize())
            users.append(user)

        projects = []
        for i in range(1, 4):
            name = f'Название проекта № {i}'
            repository = f'https://github.com/{lorem.words(1)}/{lorem.words(1)}'
            project = Project.objects.create(name=name, repository=repository)
            projects.append(project)

            for project_user in random.sample(users, random.randint(1, 5)):
                project.users.add(project_user)

                for j in range(random.randint(0, 5)):
                    Todo.objects.create(user=project_user, project=project, text=lorem.sentence(),
                                        done=random.randint(0, 1))
