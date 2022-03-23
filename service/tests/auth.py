import requests

response = requests.post(
    'http://127.0.0.1:8000/api-token-auth/',
    data={
        'username': 'veniam',
        'password': 'geekbrains'
    }
)

print(response.json())
