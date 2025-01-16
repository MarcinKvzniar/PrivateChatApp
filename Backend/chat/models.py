"""
author: Dominik Cedro
"""
from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    """
    Represents a chat in the application.
    Attributes:
        chat_id (int): The primary key for the chat.
        chat_name (str): The name of the chat.
        creator (User): The user who created the chat.
        members (QuerySet[User]): The users who are members of the chat.
        created_at (datetime): The date and time when the chat was created.
    """
    chat_id = models.AutoField(primary_key=True, unique=True)
    chat_name = models.CharField(max_length=255)
    creator = models.ForeignKey(User, related_name='created_chats', on_delete=models.CASCADE, default=None)
    members = models.ManyToManyField(User, related_name='chats')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'chat'

class Message(models.Model):
    """
    Represents a message in a chat.
    Attributes:
        message_id (int): The primary key for the message.
        chat (Chat): The chat to which this message belongs.
        sender (User): The user who sent the message.
        content (str): The content of the message.
        sent_at (datetime): The timestamp when the message was sent.
    """
    message_id = models.AutoField(primary_key=True)
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(User, related_name='messages', on_delete=models.CASCADE)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'chat'

class ChatRoom(models.Model):
    """
    Represents a chat room in the application.
    Attributes:
        name (str): The name of the chat room. Must be unique.
        creator (User): The user who created the chat room.
        members (QuerySet[User]): The users who are members of the chat room.
        created_at (datetime): The date and time when the chat room was created.
    Methods:
        __str__(): Returns the name of the chat room.
    """
    name = models.CharField(max_length=255, unique=True)
    creator = models.ForeignKey(User, related_name='created_chat_rooms', on_delete=models.CASCADE)
    members = models.ManyToManyField(User, related_name='chat_rooms')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        app_label = 'chat'

    def __str__(self):
        return self.name