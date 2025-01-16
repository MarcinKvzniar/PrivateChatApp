"""
author: Dominik Cedro
"""
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Friendship
from chat.models import Chat

@receiver(post_save, sender=Friendship)
def create_chat_for_new_friendship(sender, instance, created, **kwargs):
    """
    Signal receiver that creates a new chat when a new friendship is created.
    Args:
        sender (Model): The model class that sent the signal.
        instance (Friendship): The instance of the Friendship model that triggered the signal.
        created (bool): A boolean indicating whether a new record was created.
        **kwargs: Additional keyword arguments.
    Returns:
        None
    """
    if created:
        chat = Chat.objects.create(creator=instance.user1, chat_name=f"Chat between {instance.user1.username} and {instance.user2.username}")
        chat.members.add(instance.user1, instance.user2)
        chat.save()