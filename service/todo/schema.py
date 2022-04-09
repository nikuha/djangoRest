from graphene import Schema, ObjectType, String, List, Field, ID, Boolean, Mutation
from graphene_django import DjangoObjectType

from todo.models import Project, Todo
from users.models import User


class ProjectObjectType(DjangoObjectType):
    class Meta:
        model = Project
        fields = '__all__'


class TodoObjectType(DjangoObjectType):
    class Meta:
        model = Todo
        fields = '__all__'


class UserObjectType(DjangoObjectType):
    class Meta:
        model = User
        fields = '__all__'


class Query(ObjectType):
    projects = List(ProjectObjectType)
    todos = List(TodoObjectType)
    users = List(UserObjectType)
    user_by_id = Field(UserObjectType, uid=ID(required=True))
    projects_by_name = List(ProjectObjectType, name=String(default_value=''))

    def resolve_projects(self, info):
        return Project.objects.all()

    def resolve_todos(self, info):
        return Todo.objects.all()

    def resolve_users(self, info):
        return User.objects.all()

    def resolve_user_by_id(self, info, uid):
        return User.objects.get(uid=uid)

    def resolve_projects_by_name(self, info, name):
        return Project.objects.filter(name__contains=name)


class TodoMutation(Mutation):
    class Arguments:
        uid = ID()
        done = Boolean(required=True)

    todo = Field(TodoObjectType)

    @classmethod
    def mutate(cls, root, info, uid, done):
        todo = Todo.objects.get(uid=uid)
        todo.done = done
        todo.save()
        return TodoMutation(todo=todo)


class Mutation(ObjectType):
    update_todo = TodoMutation.Field()


schema = Schema(query=Query, mutation=Mutation)


# поиск по названию проекта
# {
#   projectsByName(name: "проект") {
#     name
#   }
# }

# запрос на получение всех todo с проектом и его пользователями
# {
#   todos {
#     uid
#     text
#     user {
#       uid
#       firstName
#       lastName
#     }
#     project {
#       uid
#       name
#       users {
#         uid
#         username
#       }
#     }
#   }
# }

# запрос на изменение "выполнено" для todo
# mutation {
#   updateTodo(uid: "5445d524-9f50-488a-bd45-51f36e81e2f6", done: false) {
#     todo {
#       uid
#       done
#     }
#   }
# }
