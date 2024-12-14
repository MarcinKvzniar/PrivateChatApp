"""
author: Dominik Cedro
"""

from .models import Chat, Message, User
from rest_framework import serializers
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
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
    chat = serializers.ReadOnlyField(source='chat.chat_id')
    sender = serializers.ReadOnlyField(source='sender.id')

    class Meta:
        model = Message
        fields = ['message_id', 'chat', 'sender', 'content', 'sent_at']