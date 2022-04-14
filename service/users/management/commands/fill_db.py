import random
from lorem_text import lorem
from django.core.management.base import BaseCommand

from todo.models import Project, Todo
from users.models import User
from datetime import timedelta
from django.db.models import F


class Command(BaseCommand):
    def handle(self, *args, **options):

        if not User.objects.filter(username='django').exists():
            User.objects.create_superuser(username='django', first_name='Django', last_name='Rest',
                                          email='django@rest.local', password='geekbrains')

        users = []
        for i in range(1, 10):
            username = lorem.words(1)
            while User.objects.filter(username=username).count():
                username = lorem.words(1)
            email = f'{username}@{lorem.words(1)}.com'
            user = User.objects.create(username=username, email=email, first_name=username.capitalize(),
                                       last_name=lorem.words(1).capitalize())
            users.append(user)

        projects = []
        for i in range(5):
            repository_name = lorem.words(1)
            name = f'Project {repository_name.capitalize()}'
            repository = f'https://github.com/somecompany/{repository_name}'
            project = Project.objects.create(name=name, repository=repository)
            projects.append(project)

            for project_user in random.sample(users, random.randint(1, 5)):
                project.users.add(project_user)

                for j in range(random.randint(0, 5)):
                    Todo.objects.create(user=project_user, project=project, text=lorem.sentence(),
                                        done=random.randint(0, 1))

        for todo in Todo.objects.all():
            days = random.randint(0, 60)
            todo.created = F('created') - timedelta(days=days)
            todo.save()
