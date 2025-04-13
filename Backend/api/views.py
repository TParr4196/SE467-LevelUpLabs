from django.http import JsonResponse

# /users/userId
def user_details_view(request, userID):
    # Example response
    return JsonResponse({
        'userID': userID,
        'details': {
            'name': 'John Doe',
            'img': 'https://example.com/user_image.jpg'
        }
    })

# /users/userId/games
def user_games_view(request, userID):
    # Example response
    return JsonResponse({
        'userID': userID,
        'games': {
            1: {'gameName': 'Game 1', 'img': 'https://example.com/game1.jpg'},
            2: {'gameName': 'Game 2', 'img': 'https://example.com/game2.jpg'}
        }
    })

# /games/gameId
def game_details_view(request, gameID):
    # Example response
    return JsonResponse({
        'gameID': gameID,
        'details': {
            'gameName': 'Game Name',
            'rating': 4.5,
            'tags': ['Action', 'Adventure'],
            'playerCount': 1000,
            'playTime': '2 hours',
            'img': 'https://example.com/game_image.jpg'
        }
    })

# /guilds/guildId
def guild_details_view(request, guildID):
    # Example response
    return JsonResponse({
        'guildID': guildID,
        'guildName': 'Guild Name',
        'img': 'https://example.com/guild_image.jpg',
        'members': [1, 2, 3],
        'log': 'Guild activity log here'
    })

# /guilds/guildId/members
def guild_members_view(request, guildID):
    # Example response for POST request
    if request.method == 'POST':
        return JsonResponse({'status': 'Member added successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# /session
def session_view(request):
    # Example response for POST request
    if request.method == 'POST':
        return JsonResponse({'status': 'Session created successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# /sessions/sessionId
def session_details_view(request, sessionID):
    # Example response for GET and DELETE requests
    if request.method == 'GET':
        return JsonResponse({
            'sessionID': sessionID,
            'gameIDs': [1, 2, 3],
            'userIDs': [101, 102, 103]
        })
    elif request.method == 'DELETE':
        return JsonResponse({'status': 'Session deleted successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

# /sessions/sessionId/votes
def session_votes_view(request, sessionID):
    # Example response for GET request
    if request.method == 'GET':
        return JsonResponse({'status': 'Vote registered successfully'}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=400)