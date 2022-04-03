from django.contrib.auth import get_user_model
from django.test import TestCase
from requests.auth import HTTPBasicAuth
from rest_framework.test import APIRequestFactory, force_authenticate, \
    APIClient, APITestCase, CoreAPIClient
from rest_framework import status
from mixer.backend.django import mixer

from todo.models import Project, Todo
from todo.views import ProjectModelViewSet


class TestProjectViewSet(TestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            'user_1', 'user_1@gmail.com', 'geekbrains'
        )
        self.admin = get_user_model().objects.create_superuser(
            'superuser', 'superuser_1@gmail.com', 'geekbrains'
        )
        self.project_data = {
            'name': 'project_1',
            'repository': 'https://github.com/company/project_1',
            'users': [self.admin.uid, self.user.uid]
        }

    def test_get_list_for_guest(self):
        factory = APIRequestFactory()
        request = factory.get('/api/projects/')
        view = ProjectModelViewSet.as_view({'get': 'list'})
        response = view(request)
        # response.render()
        # print(response.content)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_list_for_user(self):
        factory = APIRequestFactory()
        request = factory.get('/api/projects/')
        force_authenticate(request, self.user)
        view = ProjectModelViewSet.as_view({'get': 'list'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_for_user(self):
        factory = APIRequestFactory()
        request = factory.post('/api/projects/', self.project_data, format='json')
        force_authenticate(request, self.user)
        view = ProjectModelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_for_admin(self):
        factory = APIRequestFactory()
        request = factory.post('/api/projects/', self.project_data, format='json')
        force_authenticate(request, self.admin)
        view = ProjectModelViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_retrieve_for_guest(self):
        self.project_data.pop('users', None)
        project = Project.objects.create(**self.project_data)
        client = APIClient()
        response = client.get(f'/api/projects/{project.uid}/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        client.logout()

    def test_retrieve_for_user(self):
        self.project_data.pop('users', None)
        project = Project.objects.create(**self.project_data)
        client = APIClient()
        client.login(username=self.user.username, password='geekbrains')
        response = client.get(f'/api/projects/{project.uid}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        client.logout()


class TestApiTodoViewSet(APITestCase):

    def setUp(self):
        self.user = get_user_model().objects.create_user(
            'user_1', 'user_1@gmail.com', 'geekbrains'
        )
        self.admin = get_user_model().objects.create_superuser(
            'superuser', 'superuser_1@gmail.com', 'geekbrains'
        )
        self.project_data = {
            'name': 'project_1',
            'repository': 'https://github.com/company/project_1'
        }
        self.project = Project.objects.create(**self.project_data)
        self.todo_data = {
            'user': self.user,
            'project': self.project,
            'text': 'Todo text'
        }
        self.todo = Todo.objects.create(**self.todo_data)

    def test_put_for_admin(self):
        self.client.login(username=self.admin.username, password='geekbrains')
        new_todo_data = {
            'user': self.admin.uid,
            'project': self.project.uid,
            'text': 'Todo text 2'
        }
        response = self.client.put(f'/api/todos/{self.todo.uid}/', new_todo_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        todo = Todo.objects.get(uid=self.todo.uid)
        self.assertEqual(todo.user_id, self.admin.uid)
        self.assertEqual(todo.text, 'Todo text 2')

    def test_put_for_admin_mixer(self):
        self.client.force_login(self.admin)
        todo = mixer.blend(Todo)
        response = self.client.patch(f'/api/todos/{todo.uid}/', {'text': 'New Text'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        todo = Todo.objects.get(uid=todo.uid)
        self.assertEqual(todo.text, 'New Text')

    def test_core_api_client(self):
        client = CoreAPIClient()
        client.session.auth = HTTPBasicAuth(self.admin.username, 'geekbrains')
        client.session.headers.update({'x-test': 'true'})
        data = client.get('http://127.0.0.1:8000/api/projects/')
        assert 'results' in data.keys()

        # использовать, если установлена schema
        # schema = client.get('http://127.0.0.1:8000/schema/')
        # data = client.action(schema, ['projects', 'create'], self.project_data)
