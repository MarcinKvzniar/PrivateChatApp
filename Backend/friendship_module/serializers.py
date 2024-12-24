from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendInvitation

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendInvitation

class FriendInvitationSerializer(serializers.ModelSerializer):
    inviter_username = serializers.CharField(source='inviter.username', read_only=True)

    class Meta:
        model = FriendInvitation
        fields = ['id', 'inviter_username', 'question', 'status']
        read_only_fields = ['id', 'inviter_username', 'status']

    def create(self, validated_data):
        validated_data['inviter'] = self.context['request'].user
        receiver = validated_data.get('receiver')

        if receiver == validated_data['inviter']:
            raise serializers.ValidationError("You can't invite yourself to be friends.")

        return super().create(validated_data)

