from django.urls import path
from . import views

urlpatterns = [
    # /users/userId
    path('users/<int:userID>/', views.user_details_view, name='user_details'),
    # /users/userId/games
    path('users/<int:userID>/games/', views.user_games_view, name='user_games'),
    # /games/gameId
    path('games/<int:gameID>/', views.game_details_view, name='game_details'),
    # /guilds/guildId
    path('guilds/<int:guildID>/', views.guild_details_view, name='guild_details'),
    # /guilds/guildId/members
    path('guilds/<int:guildID>/members/', views.guild_members_view, name='guild_members'),
    # /session
    path('sessions/', views.session_view, name='sessions'),
    # /sessions/sessionId
    path('sessions/<int:sessionID>/', views.session_details_view, name='session_details'),
    # /sessions/sessionId/votes
    path('sessions/<int:sessionID>/votes/', views.session_votes_view, name='session_votes'),
]




