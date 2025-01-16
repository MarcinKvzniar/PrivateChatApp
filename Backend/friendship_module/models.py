from django.db import models
from django.contrib.auth.models import User

class FriendInvitation(models.Model):
    """
    Model representing a friend invitation between two users.
    Attributes:
        inviter (ForeignKey): The user who sends the invitation.
        receiver (ForeignKey): The user who receives the invitation.
        question (CharField): A question posed by the inviter to the receiver.
        receiver_answer (CharField): The answer provided by the receiver to the question.
        status (CharField): The current status of the invitation. Can be 'PENDING', 'AWAITING_REVIEW', 'ACCEPTED', or 'REJECTED'.
        created_at (DateTimeField): The date and time when the invitation was created.
        updated_at (DateTimeField): The date and time when the invitation was last updated.
    Meta:
        unique_together (list): Ensures that each pair of inviter and receiver is unique.
    Methods:
        __str__(): Returns a string representation of the friend invitation.
    """
    class Meta:
        unique_together = ['inviter', 'receiver']

    STATUS_CHOICES = [
        ('PENDING', 'PENDING'),
        ('AWAITING_REVIEW', 'AWAITING_REVIEW'),
        ('ACCEPTED', 'ACCEPTED'),
        ('REJECTED', 'REJECTED'),
    ]

    inviter = models.ForeignKey(User, related_name="sent_invitations", on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name="received_invitations", on_delete=models.CASCADE)
    question = models.CharField(max_length=255)
    receiver_answer = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='PENDING')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.inviter} invited {self.receiver} to be friends. Question: {self.question}"


class Friendship(models.Model):
    """
    Represents a friendship relationship between two users.
    Attributes:
        user1 (User): The first user in the friendship.
        user2 (User): The second user in the friendship.
        created_at (datetime): The date and time when the friendship was created.
    Meta:
        unique_together (list): Ensures that the combination of user1 and user2 is unique.
    Methods:
        __str__(): Returns a string representation of the friendship.
    """
    user1 = models.ForeignKey(User, related_name="friends", on_delete=models.CASCADE)
    user2 = models.ForeignKey(User, related_name="friends_with", on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user1', 'user2']

    def __str__(self):
        return f"{self.user1} is now friends with {self.user2}."