from uuid import uuid4

from django.db import models

from users.models import User


class Project(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid4)
    name = models.CharField(verbose_name='Название', max_length=128)
    repository = models.CharField(verbose_name='Репозиторий', max_length=256)
    users = models.ManyToManyField(User)

    def __str__(self):
        return self.name


class Todo(models.Model):
    uid = models.UUIDField(primary_key=True, default=uuid4)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, verbose_name='Проект')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='Пользователь')
    text = models.TextField(verbose_name='Текст')
    done = models.BooleanField(verbose_name='Выполнена', db_index=True, default=0)
    created = models.DateTimeField(verbose_name='Создана', auto_now_add=True)
    updated = models.DateTimeField(verbose_name='Обновлена', auto_now=True)

    def __str__(self):
        if len(self.text) > 15:
            return f'{self.text[:15]}...'
        return self.text

