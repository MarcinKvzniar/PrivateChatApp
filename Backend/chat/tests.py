import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Chat, Message, ChatRoom

@pytest.mark.django_db
def test_create_chat():
  client = APIClient()
  url = reverse('chat-list-create')
  user = User.objects.create_user(username='testuser', password='testpassword')
  client.force_authenticate(user=user)
  data = {
    'chat_name': 'Test Chat'
  }
  response = client.post(url, data, format='json')
  assert response.status_code == status.HTTP_201_CREATED
  assert Chat.objects.filter(chat_name='Test Chat', creator=user).exists()

@pytest.mark.django_db
def test_add_member_to_chat():
  client = APIClient()
  creator = User.objects.create_user(username='creator', password='testpassword')
  chat = Chat.objects.create(chat_name='Test Chat', creator=creator)
  chat.members.add(creator)
  client.force_authenticate(user=creator)
  url = reverse('add-member', args=[chat.chat_id])
  data = {
    'username': 'member'
  }
  response = client.post(url, data, format='json')
  assert response.status_code == status.HTTP_200_OK
  assert chat.members.filter(username='member').exists()

@pytest.mark.django_db
def test_send_message():
  client = APIClient()
  user = User.objects.create_user(username='testuser', password='testpassword')
  chat = Chat.objects.create(chat_name='Test Chat', creator=user)
  chat.members.add(user)
  client.force_authenticate(user=user)
  url = reverse('message-list-create', args=[chat.chat_id])
  data = {
    'content': 'Test message'
  }
  response = client.post(url, data, format='json')
  assert response.status_code == status.HTTP_201_CREATED
  assert Message.objects.filter(chat=chat, sender=user, content='Test message').exists()

@pytest.mark.django_db
def test_get_user_chats():
  client = APIClient()
  user = User.objects.create_user(username='testuser', password='testpassword')
  chat1 = Chat.objects.create(chat_name='Test Chat 1', creator=user)
  chat2 = Chat.objects.create(chat_name='Test Chat 2', creator=user)
  chat1.members.add(user)
  chat2.members.add(user)
  client.force_authenticate(user=user)
  url = reverse('user-chats')
  response = client.get(url, format='json')
  assert response.status_code == status.HTTP_200_OK
  assert len(response.data) == 2

@pytest.mark.django_db
def test_create_chat_room():
  client = APIClient()
  user = User.objects.create_user(username='testuser', password='testpassword')
  client.force_authenticate(user=user)
  url = reverse('create-room')
  data = {
    'room_name': 'Test Room'
  }
  response = client.post(url, data, format='json')
  assert response.status_code == status.HTTP_201_CREATED
  assert ChatRoom.objects.filter(name='Test Room').exists()
  