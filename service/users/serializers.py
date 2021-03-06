from rest_framework.serializers import HyperlinkedModelSerializer, RelatedField
from .models import User


class UserModelSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('uid', 'username', 'email', 'first_name', 'last_name')


class UserExtendedModelSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('uid', 'username', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff')


class UserListRelatedField(RelatedField):
    def to_representation(self, value):
        return f'{value.uid}'

    def to_internal_value(self, data):
        return User.objects.get(uid=data)

    def get_queryset(self):
        return User.objects.all()

