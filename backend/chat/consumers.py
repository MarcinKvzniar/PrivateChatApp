import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Chat, Message
from django.contrib.auth.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.chat_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(
            self.chat_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.chat_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']

        chat = await Chat.objects.get(chat_id=self.chat_id)
        sender = await User.objects.get(id=sender_id)
        message = await Message.objects.create(chat=chat, sender=sender, content=message)

        await self.channel_layer.group_send(
            self.chat_group_name,
            {
                'type': 'chat_message',
                'message': message.content,
                'sender_id': sender_id,
                'sent_at': str(message.sent_at)
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        sent_at = event['sent_at']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
            'sent_at': sent_at
        }))

