import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from backend.chat.models import Chat, Message

@pytest.mark.django_db
def test_create_chat():
    client = APIClient()
    data = {
        'chat_name': 'Test Chat'
    }
    response = client.post('/api/chats/', data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert Chat.objects.filter(chat_name='Test Chat').exists()

@pytest.mark.django_db
def test_send_message():
    user = User.objects.create_user(username='testuser', password='testpassword')
    chat = Chat.objects.create(chat_name='Test Chat')
    client = APIClient()
    client.login(username='testuser', password='testpassword')
    data = {
        'chat': chat.chat_id,
        'sender': user.id,
        'content': 'Hello, World!'
    }
    response = client.post(f'/api/chats/{chat.chat_id}/messages/', data, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert Message.objects.filter(content='Hello, World!').exists()