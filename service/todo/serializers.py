from rest_framework.relations import StringRelatedField
from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer

from users.serializers import UserModelSerializer
from .models import Project, Todo


class ProjectModelSerializer(HyperlinkedModelSerializer):
    users = StringRelatedField(many=True)

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
