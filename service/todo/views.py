# from rest_framework.decorators import api_view, renderer_classes
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from todo.models import Project, Todo
from todo.serializers import ProjectModelSerializer, TodoModelSerializer, SimpleProjectModelSerializer


class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer


class TodoModelViewSet(ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoModelSerializer


# @api_view(['GET'])
# @renderer_classes([JSONRenderer])
# def project_list(request):
#     projects = Project.objects.all()
#     serializer = SimpleProjectModelSerializer(projects, many=True)
#     return Response(serializer.data)


# class ProjectApiView(APIView):
#     renderer_classes = [JSONRenderer]
#
#     def get(self, request, format=None):
#         projects = Project.objects.all()
#         serializer = SimpleProjectModelSerializer(projects, many=True)
#         return Response(serializer.data)
#
#
# class CreateProjectApiView(CreateAPIView):
#     queryset = Project.objects.all()
#     serializer_class = ProjectModelSerializer
#
#
# class DeleteProjectApiView(DestroyAPIView):
#     queryset = Project.objects.all()
#     serializer_class = ProjectModelSerializer
#     lookup_field = 'uid'
#
#
# class UpdateProjectApiView(UpdateAPIView):
#     queryset = Project.objects.all()
#     serializer_class = ProjectModelSerializer
#     lookup_field = 'uid'
