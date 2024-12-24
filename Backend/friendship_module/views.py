from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from .models import FriendInvitation, Friendship
from .serializers import FriendInvitationSerializer
# Create your views here.

class FriendInvitationView(APIView):
    """
    Send or respond to a friend invitation.
    """
    permission_classes = [IsAuthenticated]

    # Create a new friend invitation
    def post(self, request):
        receiver_username = request.data.get('receiver_username')
        question = request.data.get('question')

        if receiver_username and question:
            receiver = User.objects.filter(username=receiver_username).first()
            if not receiver:
                return Response({'detail': 'Receiver not found.'}, status=status.HTTP_404_NOT_FOUND)

            if receiver == request.user:
                return Response({'detail': 'You cannot send an invitation to yourself.'},
                                status=status.HTTP_400_BAD_REQUEST)

            if Friendship.objects.filter(user1=request.user, user2=receiver).exists():
                return Response({'detail': 'You are already friends with this user.'},
                                status=status.HTTP_400_BAD_REQUEST)

            existing_invitation = FriendInvitation.objects.filter(
                inviter=request.user, receiver=receiver, status='PENDING'
            ).first()

            if existing_invitation:
                return Response({'detail': 'You already have a pending invitation.'},
                                status=status.HTTP_400_BAD_REQUEST)

            invitation = FriendInvitation(
                inviter=request.user,
                receiver=receiver,
                question=question
            )
            invitation.save()
            return Response({'detail': 'Invitation sent.'}, status=status.HTTP_201_CREATED)

        return Response({'detail': 'Invalid data.'}, status=status.HTTP_400_BAD_REQUEST)

    # Respond to a friend invitation
    def put(self, request):
        invitation_id = request.data.get('invitation_id')
        receiver_answer = request.data.get('answer')

        if invitation_id and receiver_answer:
            invitation = FriendInvitation.objects.filter(id=invitation_id).first()
            if not invitation:
                return Response({'detail': 'Invitation not found.'}, status=status.HTTP_404_NOT_FOUND)

            if invitation.status != 'PENDING':
                return Response({'detail': 'Invitation has already been responded to.'},
                                status=status.HTTP_400_BAD_REQUEST)

            invitation.receiver_answer = receiver_answer
            invitation.status = 'AWAITING_REVIEW'
            invitation.save()

            return Response({'detail': 'Your answer has been submitted for review.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid request data.'}, status=status.HTTP_400_BAD_REQUEST)

    # Accept or reject a friend invitation
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
                invitation.save()

                friendship1 = Friendship.objects.create(user1=invitation.inviter, user2=invitation.receiver)
                friendship2 = Friendship.objects.create(user1=invitation.receiver, user2=invitation.inviter)

                return Response({
                    'detail': 'Friendship created successfully.',
                    'friendship_ids': [friendship1.id, friendship2.id]
                }, status=status.HTTP_200_OK)

            elif action == 'reject':
                invitation.status = 'REJECTED'
                invitation.save()
                return Response({'detail': 'Friendship invitation rejected.'}, status=status.HTTP_200_OK)

        return Response({'detail': 'Invalid request data.'}, status=status.HTTP_400_BAD_REQUEST)


class PendingInvitationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pending_invitations_recieved = list(FriendInvitation.objects.filter( receiver=request.user))
        pending_invitations_sent = list(FriendInvitation.objects.filter(inviter=request.user))

        serializer = FriendInvitationSerializer(pending_invitations_recieved+pending_invitations_sent, many=True)
        return Response(serializer.data)