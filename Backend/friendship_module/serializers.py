from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendInvitation
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendInvitation

class FriendInvitationSerializer(serializers.ModelSerializer):
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

from rest_framework import serializers
from .models import Friendship

class FriendshipSerializer(serializers.ModelSerializer):
    user1_username = serializers.CharField(source='user1.username', read_only=True)
    user2_username = serializers.CharField(source='user2.username', read_only=True)

    class Meta:
        model = Friendship
        fields = ['user1_username', 'user2_username', 'created_at']
        read_only_fields = ['user1_username', 'user2_username', 'created_at']
