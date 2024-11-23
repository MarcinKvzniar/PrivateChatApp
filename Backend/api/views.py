from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from .models import FriendInvitation, Friendship
from .serializers import FriendInvitationSerializer


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({'detail': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'User does not exist.'}, status=status.HTTP_404_NOT_FOUND)

        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_401_UNAUTHORIZED:
            return Response({'detail': 'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)

        return response


class FriendInvitationView(APIView):
    """
    Send or respond to a friend invitation.
    """
    permission_classes = [IsAuthenticated]

    # Create a new friend invitation 
    def post(self, request):
        receiver_id = request.data.get('receiver')
        question = request.data.get('question')
        answer = request.data.get('answer')

        if receiver_id and question and answer:
            receiver = User.objects.filter(id=receiver_id).first()
            if not receiver:
                return Response({'detail': 'Receiver not found.'}, status=status.HTTP_404_NOT_FOUND)
            
            if receiver == request.user:
                return Response({'detail': 'You cannot send invitation to yourself.'}, status=status.HTTP_400_BAD_REQUEST)

            existing_invitation = FriendInvitation.objects.filter(
                inviter=request.user, receiver=receiver, status='PENDING'
            ).first()

            if existing_invitation:
                return Response({'detail': 'You already have a pending invitation.'}, status=status.HTTP_400_BAD_REQUEST)

            invitation = FriendInvitation(
                inviter=request.user,
                receiver=receiver,
                question=question,
                answer=answer
            )
            invitation.save()
            return Response({'detail': 'Invitation sent.'}, status=status.HTTP_201_CREATED)

        return Response({'detail': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)

    # Respond to a friend invitation
    def put(self, request):
        invitation_id = request.data.get('invitation_id')
        provided_answer = request.data.get('answer')

        if invitation_id and provided_answer:
            invitation = FriendInvitation.objects.filter(id=invitation_id).first()
            if not invitation:
                return Response({'detail': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)

            if invitation.status != 'PENDING':
                return Response({'detail': 'Invitation has already been responded to.'}, status=status.HTTP_400_BAD_REQUEST)

            if invitation.answer != provided_answer:
                return Response({'detail': 'Incorrect answer.'}, status=status.HTTP_400_BAD_REQUEST)

            invitation.status = 'ACCEPTED'
            invitation.save()

            Friendship.objects.create(user1=request.user, user2=invitation.inviter)

            return Response({'detail': 'Friend invitation accepted.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid request data.'}, status=status.HTTP_400_BAD_REQUEST)