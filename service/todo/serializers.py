from rest_framework.relations import StringRelatedField, RelatedField
from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer

from users.models import User
from users.serializers import UserModelSerializer, UserListRelatedField
from .models import Project, Todo


class ProjectModelSerializer(ModelSerializer):
    users = UserModelSerializer(many=True)

    class Meta:
        model = Project
        fields = '__all__'


class ProjectUserRelatedSerializer(ModelSerializer):
    users = UserListRelatedField(many=True)

    class Meta:
        model = Project
        fields = '__all__'


class SimpleProjectModelSerializer(ModelSerializer):
    class Meta:
        model = Project
        fields = ('name',)


class ProjectRelatedField(RelatedField):
    def to_representation(self, value):
        return f'{value.uid}'

    def to_internal_value(self, data):
        return Project.objects.get(uid=data)

    def get_queryset(self):
        return Project.objects.all()


class TodoModelSerializer(ModelSerializer):
    user = UserModelSerializer()
    project = SimpleProjectModelSerializer()

    class Meta:
        model = Todo
        fields = '__all__'


class TodoRelatedModelSerializer(ModelSerializer):
    user = UserListRelatedField()
    project = ProjectRelatedField()

    class Meta:
        model = Todo
        fields = '__all__'
