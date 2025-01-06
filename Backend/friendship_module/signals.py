"""
author: Dominik Cedro
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Friendship
from chat.models import Chat

@receiver(post_save, sender=Friendship)
def create_chat_for_new_friendship(sender, instance, created, **kwargs):
    if created:
        chat = Chat.objects.create(creator=instance.user1, chat_name=f"Chat between {instance.user1.username} and {instance.user2.username}")
        chat.members.add(instance.user1, instance.user2)
        chat.save()