from django_filters import rest_framework as filters
from todo.models import Project, Todo


class ProjectFilter(filters.FilterSet):
    name = filters.CharFilter(lookup_expr='contains')

    class Meta:
        model = Project
        fields = ['name']


class TodoFilter(filters.FilterSet):
    start_date = filters.DateFilter(field_name='created', lookup_expr='gte')
    end_date = filters.DateFilter(field_name='created', lookup_expr='lte')

    class Meta:
        model = Todo
        fields = ['project', 'start_date', 'end_date']
