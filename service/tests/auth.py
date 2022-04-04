import requests

# token auth
response = requests.post(
    'http://127.0.0.1:8000/api/token-auth/',
    data={
        'username': 'django',
        'password': 'geekbrains'
    }
)
print(response.json())

# jwt auth
response = requests.post(
    'http://127.0.0.1:8000/api/jwt/token/',
    json={
        'username': 'django',
        'password': 'geekbrains'
    }
)
result = response.json()
print(result)

response = requests.post(
    'http://127.0.0.1:8000/api/jwt/token/refresh/',
    json={
        'refresh': result['refresh']
    }
)
print(response.json())


