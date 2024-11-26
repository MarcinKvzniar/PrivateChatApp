from django.contrib.auth.models import User
from .models import FriendInvitation
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class FriendInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendInvitation
        fields = ['id', 'inviter', 'receiver', 'question', 'answer', 'status']
        read_only_fields = ['id', 'inviter', 'status']

    def create(self, validated_data):
        validated_data['inviter'] = self.context['request'].user
        receiver = validated_data.get('receiver')

        if receiver == validated_data['inviter']:
            raise serializers.ValidationError("You can't invite yourself to be friends.")

        return super().create(validated_data)