from rest_framework import serializers
from django.contrib.auth.models import User
from .models import FriendInvitation


class FriendInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = ['id', 'inviter', 'receiver', 'question', 'status']
        read_only_fields = ['id', 'inviter', 'status']

    def create(self, validated_data):
        validated_data['inviter'] = self.context['request'].user
        receiver = validated_data.get('receiver')

        if receiver == validated_data['inviter']:
            raise serializers.ValidationError("You can't invite yourself to be friends.")

        return super().create(validated_data)