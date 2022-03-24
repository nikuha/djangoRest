import requests

response = requests.post(
    'http://127.0.0.1:8000/api-token-auth/',
    data={
        'username': 'django',
        'password': 'geekbrains'
    }
)

print(response.json())

# use jwt token
response = requests.post(
    'http://127.0.0.1:8000/api/token/',
    json={
        'username': 'django',
        'password': 'geekbrains'
    }
)

print(response.json())
