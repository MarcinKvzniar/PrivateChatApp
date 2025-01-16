from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import re

class UserSerializer(serializers.ModelSerializer):
    """
    UserSerializer is a ModelSerializer for the User model.
    Fields:
        - id: The unique identifier for the user.
        - username: The username of the user.
        - password: The password of the user (write-only).
    Validations:
        - validate_username: Ensures the username is alphanumeric and between 4 and 30 characters.
        - validate_password: Ensures the password is at least 8 characters long, contains at least one digit, one letter, and one special character.
    Methods:
        - create: Creates a new user instance with the validated data.
    """
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True, "required": True}}

    def validate_username(self, value):
        if not re.match(r"^[a-zA-Z0-9]{4,30}$", value):
            raise ValidationError(
                "Username must be alphanumeric and between 3 and 30 characters."
            )
        return value

    def validate_password(self, value):
        if len(value) < 8:
            raise ValidationError("Password must be at least 8 characters long.")
        if not any(char.isdigit() for char in value):
            raise ValidationError("Password must contain at least one digit.")
        if not any(char.isalpha() for char in value):
            raise ValidationError("Password must contain at least one letter.")
        if not any(char in "!@#$%^&*()_+-=[]{}|;:',.<>?/`~" for char in value):
            raise ValidationError(
                "Password must contain at least one special character."
            )
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"]
        )
        return user

