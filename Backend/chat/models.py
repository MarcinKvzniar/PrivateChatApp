from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    chat_id = models.AutoField(primary_key=True)
    chat_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)