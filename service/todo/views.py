# from rest_framework.decorators import api_view, renderer_classes
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
