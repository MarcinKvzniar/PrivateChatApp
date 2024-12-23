from django.db import models
from django.contrib.auth.models import User

class FriendInvitation(models.Model):
    class Meta:
        unique_together = ['inviter', 'receiver']

    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('ACCEPTED', 'ACCEPTED'),
        ('REJECTED', 'REJECTED'),
    ]

    inviter = models.ForeignKey(User, related_name="sent_invitations", on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name="received_invitations", on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.inviter} invited {self.receiver} to be friends. Question: {self.question}"
    

class Friendship(models.Model):
    user1 = models.ForeignKey(User, related_name="friends", on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name="friends_with", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user1', 'user2']

    def __str__(self):
        return f"{self.user1} is now friends with {self.user2}"
