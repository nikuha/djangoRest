# from rest_framework.decorators import api_view, renderer_classes
# from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
# from rest_framework.response import Response
# from rest_framework.renderers import JSONRenderer
# from rest_framework.views import APIView
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.viewsets import ModelViewSet

from .models import Project, Todo
from .serializers import ProjectModelSerializer, TodoModelSerializer, SimpleProjectModelSerializer, \
    ProjectUserRelatedSerializer, TodoRelatedModelSerializer
from .filters import ProjectFilter, TodoFilter


class ProjectLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 10


class ProjectModelViewSet(ModelViewSet):
    queryset = Project.objects.all()
    filterset_class = ProjectFilter
    pagination_class = ProjectLimitOffsetPagination
    serializers = {
        'list': ProjectModelSerializer,
        'retrieve': ProjectModelSerializer,
        'default': ProjectUserRelatedSerializer,
    }

    def get_serializer_class(self):
        return self.serializers.get(self.action, self.serializers['default'])


class TodoLimitOffsetPagination(LimitOffsetPagination):
    default_limit = 20


class TodoModelViewSet(ModelViewSet):
    queryset = Todo.objects.order_by('done', 'created')
    pagination_class = TodoLimitOffsetPagination
    # filterset_fields = ['project']
    filterset_class = TodoFilter

    # def perform_destroy(self, instance):
    #     instance.done = True
    #     instance.save()

    def get_serializer_class(self):
        if self.request.method in ['GET']:
            return TodoModelSerializer
        else:
            return TodoRelatedModelSerializer

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
