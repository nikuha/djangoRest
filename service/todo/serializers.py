from rest_framework.relations import StringRelatedField
from rest_framework.serializers import HyperlinkedModelSerializer

from users.models import User
from users.serializers import UserModelSerializer, UserListRelatedField
from .models import Project, Todo


class ProjectModelSerializer(HyperlinkedModelSerializer):
    users = UserListRelatedField(many=True)

    class Meta:
        model = Project
        fields = '__all__'


class SimpleProjectModelSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ('name',)


class TodoModelSerializer(HyperlinkedModelSerializer):
    user = UserModelSerializer()
    project = SimpleProjectModelSerializer()

    class Meta:
        model = Todo
        fields = '__all__'
