"""
author: Dominik Cedro
"""
from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True, unique=True) # this will be used to create unique chat room id==name
    chat_name = models.CharField(max_length=255)
    creator = models.ForeignKey(User, related_name='created_chats', on_delete=models.CASCADE, default=None)
    members = models.ManyToManyField(User, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)



from django.db import models
from django.contrib.auth.models import User

class ChatRoom(models.Model):
    name = models.CharField(max_length=255, unique=True)
    creator = models.ForeignKey(User, related_name='created_chat_rooms', on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name