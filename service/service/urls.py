from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from todo.views import ProjectModelViewSet, TodoModelViewSet
from users.views import UserModelViewSet

router = DefaultRouter()
router.register('users', UserModelViewSet)
router.register('projects', ProjectModelViewSet)
router.register('todos', TodoModelViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include(router.urls)),
    # path('view/projects', project_list),
]
