from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as auth_views

import todo.views as todo_views
from users.views import UserCustomViewSet

router = DefaultRouter()
router.register('users', UserCustomViewSet)
router.register('projects', todo_views.ProjectModelViewSet)
router.register('todos', todo_views.TodoModelViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api-auth/', include('rest_framework.urls')),
    path('api-token-auth/', auth_views.obtain_auth_token),
    path('api/', include(router.urls)),

    # path('view/projects/', todo_views.ProjectApiView.as_view()),
    # path('view/projects/create/', todo_views.CreateProjectApiView.as_view()),
    # path('view/projects/delete/<uid>/', todo_views.DeleteProjectApiView.as_view()),
    # path('view/projects/update/<uid>/', todo_views.UpdateProjectApiView.as_view()),
]
