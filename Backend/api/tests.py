import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status


@pytest.mark.django_db
def test_create_user_view():
    client = APIClient()
    url = reverse('register') 
    data = {
        'username': 'testuser',
        'password': 'testpassword'
    }
    response = client.post(url, data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(username='testuser').exists()

@pytest.mark.django_db
def test_login_view():
    user = User.objects.create_user(username='testuser', password='testpassword')
    client = APIClient()
    url = reverse('get_token')
    data = {
        'username': 'testuser',
        'password': 'testpassword'
    }
    response = client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data

    data = {
        'username': 'testuser',
        'password': 'wrongpassword'
    }
    response = client.post(url, data, format='json')
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.data['detail'] == 'No active account found with the given credentials'


@pytest.mark.django_db
def test_token_refresh():
    user = User.objects.create_user(username='testuser', password='testpassword')
    client = APIClient()

    url = reverse('get_token')
    data = {
        'username': 'testuser',
        'password': 'testpassword'
    }
    response = client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data
    assert 'refresh' in response.data

    refresh_token = response.data['refresh']

    url = reverse('refresh')
    data = {
        'refresh': refresh_token
    }
    response = client.post(url, data, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert 'access' in response.data