from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]



class LoginView(TokenObtainPairView):
    """
    This view handles the login functionality.
    It uses the TokenObtainPairView from SimpleJWT to generate JWT tokens.
    """
    pass