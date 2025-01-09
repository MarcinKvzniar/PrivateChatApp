from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response


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
    


    
"""
class FriendInvitationView(APIView):

    permission_classes = [IsAuthenticated]

    # Create a new friend invitation 
    def post(self, request):
        receiver_username = request.data.get('receiver_username')  # Change here
        question = request.data.get('question')

        if receiver_username and question:
            receiver = User.objects.filter(username=receiver_username).first()  # Query by username
            if not receiver:
                return Response({'detail': 'Receiver not found.'}, status=status.HTTP_404_NOT_FOUND)

            if receiver == request.user:
                return Response({'detail': 'You cannot send an invitation to yourself.'}, status=status.HTTP_400_BAD_REQUEST)

            existing_invitation = FriendInvitation.objects.filter(
                inviter=request.user, receiver=receiver, status='PENDING'
            ).first()

            if existing_invitation:
                return Response({'detail': 'You already have a pending invitation.'}, status=status.HTTP_400_BAD_REQUEST)

            invitation = FriendInvitation(
                inviter=request.user,
                receiver=receiver,
                question=question
            )
            invitation.save()
            return Response({'detail': 'Invitation sent.'}, status=status.HTTP_201_CREATED)

        return Response({'detail': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        invitations = FriendInvitation.objects.filter(receiver=request.user).order_by('-created_at')
        serializer = FriendInvitationSerializer(invitations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # Respond to a friend invitation
    def put(self, request):
        invitation_id = request.data.get('invitation_id')
        receiver_answer = request.data.get('answer')

        if invitation_id and receiver_answer:
            invitation = FriendInvitation.objects.filter(id=invitation_id).first()
            if not invitation:
                return Response({'detail': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)

            if invitation.status != 'PENDING':
                return Response({'detail': 'Invitation has already been responded to.'}, status=status.HTTP_400_BAD_REQUEST)

            invitation.receiver_answer = receiver_answer
            invitation.status = 'AWAITING_REVIEW'  
            invitation.save()

            return Response({'detail': 'Your answer has been submitted for review.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid request data.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Inviter reviews and decides on the answer
    def patch(self, request):
        invitation_id = request.data.get('invitation_id')
        action = request.data.get('action')  

        if invitation_id and action in ['accept', 'reject']:
            invitation = FriendInvitation.objects.filter(id=invitation_id, inviter=request.user).first()
            if not invitation:
                return Response({'detail': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)

            if invitation.status != 'AWAITING_REVIEW':
                return Response({'detail': 'Invitation is not awaiting review.'}, status=status.HTTP_400_BAD_REQUEST)

            if action == 'accept':
                invitation.status = 'ACCEPTED'
                Friendship.objects.create(user1=invitation.inviter, user2=invitation.receiver)
                Friendship.objects.create(user1=invitation.receiver, user2=invitation.inviter)
            else:
                invitation.status = 'REJECTED'

            invitation.save()
            return Response({'detail': f'Invitation {action}ed successfully.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid request data.'}, status=status.HTTP_400_BAD_REQUEST)

"""