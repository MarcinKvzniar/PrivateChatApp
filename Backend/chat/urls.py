"""
author: Dominik Cedro
"""
from django.urls import path
from .views import ChatListCreateView, MessageListCreateView, AddMemberView

urlpatterns = [
    path('chats/', ChatListCreateView.as_view(), name='chat-list-create'),
    path('chats/<int:chat_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
    path('chats/<int:chat_id>/add_member/', AddMemberView.as_view(), name='add-member'),
]