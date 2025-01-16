from rest_framework import serializers
from .models import FriendInvitation, Friendship

class FriendInvitationSerializer(serializers.ModelSerializer):
    """
    Serializer for FriendInvitation model.
    This serializer includes the usernames of the inviter and the receiver of the invitation.

    Attributes:
        inviter_username (str): Read-only field for the username of the inviter.
        receiver_username (str): Read-only field for the username of the receiver.
    Meta:
        model (FriendInvitation): The model that this serializer is based on.
        fields (list): List of fields to be included in the serialized representation.
        read_only_fields (list): List of fields that are read-only.
    Methods:
        get_receiver_answer(obj):
            Returns the receiver's answer if it exists, otherwise returns None.
        create(validated_data):
            Creates a new FriendInvitation instance with the validated data.
            Sets the inviter to the current user from the request context.
            Raises a ValidationError if the inviter is the same as the receiver.
    """
    inviter_username = serializers.CharField(source='inviter.username', read_only=True)
    receiver_username = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = FriendInvitation
        fields = ['id', 'inviter_username', 'receiver_username', 'question', 'receiver_answer',  'status']
        read_only_fields = ['id', 'inviter_username', 'status']

    def get_receiver_answer(self, obj):
        return obj.receiver_answer if obj.receiver_answer else None

    def create(self, validated_data):
        validated_data['inviter'] = self.context['request'].user
        receiver = validated_data.get('receiver')

        if receiver == validated_data['inviter']:
            raise serializers.ValidationError("You can't invite yourself to be friends.")

        return super().create(validated_data)

class FriendshipSerializer(serializers.ModelSerializer):
    """
    Serializer for the Friendship model.
    This serializer includes the usernames of the two users involved in the friendship
    and the timestamp when the friendship was created. All fields are read-only.
    Fields:
        user1_username (str): The username of the first user in the friendship.
        user2_username (str): The username of the second user in the friendship.
        created_at (datetime): The timestamp when the friendship was created.
    """
    user1_username = serializers.CharField(source='user1.username', read_only=True)
    user2_username = serializers.CharField(source='user2.username', read_only=True)

    class Meta:
        model = Friendship
        fields = ['user1_username', 'user2_username', 'created_at']
        read_only_fields = ['user1_username', 'user2_username', 'created_at']
