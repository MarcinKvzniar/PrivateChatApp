"""
author: Dominik Cedro
"""

from .models import Chat, Message, User
from rest_framework import serializers
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    """
    Serializer for the Chat model.
    Fields:
        creator (ReadOnlyField): The ID of the user who created the chat.
        members (SlugRelatedField): A list of user IDs who are members of the chat.
        chat_id (int): The unique identifier of the chat.
        chat_name (str): The name of the chat.
        created_at (datetime): The timestamp when the chat was created.
    """
    creator = serializers.ReadOnlyField(source='creator.id')
    members = serializers.SlugRelatedField(
        many=True,
        slug_field='id',
        queryset=User.objects.all(),
        required=False
    )

    class Meta:
        model = Chat
        fields = ['chat_id', 'chat_name', 'creator', 'members', 'created_at']


class MessageSerializer(serializers.ModelSerializer):
    """
    Serializer for the Message model.
    This serializer converts Message model instances into JSON format and vice versa.
    Fields:
        - message_id: The unique identifier for the message.
        - chat: The ID of the chat to which the message belongs (read-only).
        - sender: The ID of the user who sent the message (read-only).
        - content: The text content of the message.
        - sent_at: The timestamp when the message was sent.
    """
    chat = serializers.ReadOnlyField(source='chat.chat_id')
    sender = serializers.ReadOnlyField(source='sender.id')

    class Meta:
        model = Message
        fields = ['message_id', 'chat', 'sender', 'content', 'sent_at']