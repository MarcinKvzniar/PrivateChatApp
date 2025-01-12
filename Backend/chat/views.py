"""
author: Dominik Cedro
"""
from .serializers import ChatSerializer, MessageSerializer
from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from icecream import ic
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from .models import Chat, Message
from .serializers import MessageSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q


class UserChatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        chats = Chat.objects.filter(members=user).distinct()
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)

class ChatListCreateView(generics.ListCreateAPIView):
    queryset = Chat.objects.all()
    serializer_class = ChatSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        serializer.save(creator=user)



class AddMemberView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, chat_id):
        chat = Chat.objects.get(chat_id=chat_id)
        if chat.creator != request.user:
            return Response({'detail': 'Only the creator can add members.'}, status=status.HTTP_403_FORBIDDEN)
        username = request.data.get('username')
        try:
            user = User.objects.get(username=username)
            ic(f"Adding user {username} to chat {chat_id}")
            chat.members.add(user)
            chat.save()
            added_user = chat.members.get(username=username)
            ic(f"User {username} added to chat {chat_id}")

            return Response({'detail': 'Member added successfully.'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        chat_id = self.kwargs['chat_id']
        try:
            chat = Chat.objects.get(chat_id=chat_id)
        except Chat.DoesNotExist:
            ic(f"Chat with id {chat_id} does not exist")
            raise PermissionDenied('User is not a member of this chat.')
        user = self.request.user
        if user == chat.creator or user in chat.members.all():
            ic(f"User {user.username} is a member of chat {chat_id}")
            return Message.objects.filter(chat=chat)
        else:
            ic(f"User {user.username} is NOT a member of chat {chat_id}")
            raise PermissionDenied('User is not a member of this chat.')

    def perform_create(self, serializer):
        chat_id = self.kwargs['chat_id']
        try:
            chat = Chat.objects.get(chat_id=chat_id)
        except Chat.DoesNotExist:
            ic(f"Chat with id {chat_id} does not exist")
            raise PermissionDenied('User is not a member of this chat.')
        user = self.request.user
        if user == chat.creator or user in chat.members.all():
            ic(f"User {user.username} is sending a message to chat {chat_id}")
            serializer.save(chat=chat, sender=user)
        else:
            ic(f"User {user.username} does NOT have permission to send messages in chat {chat_id}")
            raise PermissionDenied('User is not a member of this chat.')



class AvailableChatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        # chats = Chat.objects.filter(Q(creator=user) | Q(members=user))
        chats = Chat.objects.filter(Q(creator=user)) # that depends if
        serializer = ChatSerializer(chats, many=True)
        return Response(serializer.data)


# CHANNELS WEBSOCKET FOR CHAT_FINAL_JOIN

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import ChatRoom

class ChatRoomCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_name = request.data.get('room_name')
        if not room_name:
            return Response({'error': 'Room name is required'}, status=status.HTTP_400_BAD_REQUEST)

        chat_room, created = ChatRoom.objects.get_or_create(name=room_name, creator=request.user)
        if created:
            return Response({'message': 'Chat room created successfully'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Chat room already exists'}, status=status.HTTP_200_OK)