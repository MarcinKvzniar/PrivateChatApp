from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, LoginView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from friendship_module.views import current_user
from friendship_module.views import FriendInvitationView, PendingInvitationsView, AvailableFriendshipsView
from chat.routing import websocket_urlpatterns

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # User authentication
    path('api-auth/', include('rest_framework.urls')),
    path('api/user/register/', CreateUserView.as_view(), name='register'),
    path('api/user/login/', LoginView.as_view(), name='login'),
    path('api/token/', TokenObtainPairView.as_view(), name='get_token'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
    
    # Current user
    path('api/current-user/', current_user, name='current_user'),

    # Chat module
    path('api/', include('chat.urls')),

    # Friendship module
    path('friendships/', AvailableFriendshipsView.as_view(), name='friendships'),
    
    # Invitations
    path('api/invite/', FriendInvitationView.as_view(), name='invite'),
    path('pending-invitations/', PendingInvitationsView.as_view(), name='pending-invitations'),
    
    # Websockets
    path('ws/', include(websocket_urlpatterns)),
]