"""
author: Dominik Cedro
"""
from django.urls import path
from .views import ChatListCreateView, MessageListCreateView, AddMemberView, AvailableChatsView, ChatRoomCreateView


urlpatterns = [
    path('chats/', ChatListCreateView.as_view(), name='chat-list-create'),
    path('chats/<int:chat_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('chats/<int:chat_id>/add_member/', AddMemberView.as_view(), name='add-member'),
    path('chats/available/', AvailableChatsView.as_view(), name='available-chats'),

    path('create-room/', ChatRoomCreateView.as_view(), name='create-room'),
    path('user/chats/', UserChatsView.as_view(), name='user-chats'),
]