from rest_framework.viewsets import ModelViewSet
from .models import User
from .serializers import UserModelSerializer
# from rest_framework.viewsets import GenericViewSet
# from rest_framework import mixins


# class UserCustomViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, GenericViewSet):
class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserModelSerializer
