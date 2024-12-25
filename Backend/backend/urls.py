from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from chat.views import ChatListCreateView, MessageListCreateView
from friendship_module.views import FriendInvitationView, PendingInvitationsView, AvailableFriendshipsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/user/login/', LoginView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/', include('chat.urls')),
    path('api/invite/', FriendInvitationView.as_view(), name='invite'),
    path('pending-invitations/', PendingInvitationsView.as_view(), name='pending-invitations'),
    path('friendships/', AvailableFriendshipsView.as_view(), name='friendships'),
]