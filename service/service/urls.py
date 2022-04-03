from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as auth_views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

import todo.views as todo_views
from users.views import UserViewSet
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView)

schema_view = get_schema_view(
    openapi.Info(
        title="TODO API",
        default_version='0.1',
        description="Documentation to out project",
        contact=openapi.Contact(email="admin@admin.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register('users', UserViewSet)
router.register('projects', todo_views.ProjectModelViewSet)
router.register('todos', todo_views.TodoModelViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api-auth/', include('rest_framework.urls')),
    path('api-token-auth/', auth_views.obtain_auth_token),
    path('api/', include(router.urls)),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # path('view/projects/', todo_views.ProjectApiView.as_view()),
    # path('view/projects/create/', todo_views.CreateProjectApiView.as_view()),
    # path('view/projects/delete/<uid>/', todo_views.DeleteProjectApiView.as_view()),
    # path('view/projects/update/<uid>/', todo_views.UpdateProjectApiView.as_view()),
]
