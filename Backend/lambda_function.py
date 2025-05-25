import json
import boto3
from decimal import Decimal

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")

users_table = dynamodb.Table('users')
user_games_map_table = dynamodb.Table('user_gamesOwned_map')
games_table = dynamodb.Table('games')
user_friends_map_table = dynamodb.Table('user_friends_map')
guilds_table = dynamodb.Table('guilds')
guild_members_map_table = dynamodb.Table('guild_members_map')

def lambda_handler(event, context):
    print(event)
    body = {}
    statusCode = 200

    try:
        # Get all the users from a list of users
        if event['routeKey'] == "GET /users":
            # Extract user IDs from query parameters
            user_ids = event.get('queryStringParameters', {}).get('ids', '')
            if not user_ids:
                raise KeyError("Missing 'ids' query parameter")

            # Split the user IDs into a list
            user_ids_list = user_ids.split(',')

            # Query the DynamoDB tables for each user ID
            users = []
            for user_id in user_ids_list:
                # Get user details from the users table
                user_response = users_table.get_item(
                    Key={
                        'userId': user_id
                    }
                )
                user_item = user_response.get("Item")
                if user_item:
                    # Get gamesOwned from the user_gamesOwned_map table
                    games_response = user_games_map_table.query(
                        KeyConditionExpression=boto3.dynamodb.conditions.Key('entityId').eq(user_id)
                    )
                    games_owned = [game['relatedId'] for game in games_response.get('Items', [])]

                    # Append user details with gamesOwned
                    users.append({
                        'userId': user_item.get('userId', ''),
                        'name': user_item.get('name', ''),
                        'imageUrl': user_item.get('imageUrl', ''),
                        'gamesOwned': games_owned,  # List of game IDs owned by the user
                        'description': user_item.get('description','')
                    })
            body = users
        
        # Get all the games from a list of games
        elif event['routeKey'] == "GET /games":
            # Extract game IDs from query parameters
            game_ids = event.get('queryStringParameters', {}).get('ids', '')

            games = []
            if game_ids:
                # Split the game IDs into a list
                game_ids_list = game_ids.split(',')

                # Query the DynamoDB table for each game ID
                for game_id in game_ids_list:
                    response = games_table.get_item(
                        Key={
                            'gameId': game_id
                        }
                    )
                    item = response.get("Item")
                    if item:
                        games.append({
                            'gameId': item['gameId'],
                            'name': item['name'],
                            'genres': list(item.get('genres', [])),
                            'rating': str(item.get('rating', '')),
                            'imageUrl': item.get('imageUrl', ''),
                            'averagePlaytime': item.get('averagePlaytime', ''),
                            'recommendedPlayers': item.get('recommendedPlayers', '')
                        })
            else:
                # No ids provided, scan for up to 30 games
                scan_response = games_table.scan(Limit=30)
                for item in scan_response.get("Items", []):
                    games.append({
                        'gameId': item['gameId'],
                        'name': item['name'],
                        'genres': list(item.get('genres', [])),
                        'rating': str(item.get('rating', '')),
                        'imageUrl': item.get('imageUrl', ''),
                        'averagePlaytime': item.get('averagePlaytime', ''),
                        'recommendedPlayers': item.get('recommendedPlayers', '')
                    })

            body = games

        elif event['routeKey'] == "GET /guilds":
            try:
                # Scan the guild table to get all guilds
                guilds_response = guilds_table.scan()
                guilds = []
                for guild_item in guilds_response.get("Items", []):
                    guild_id = guild_item.get('guildId', '')
                    # Query the guild_member_map table for members of this guild
                    members_response = guild_members_map_table.query(
                        KeyConditionExpression=boto3.dynamodb.conditions.Key('entityId').eq(guild_id)
                    )
                    members = [item['relatedId'] for item in members_response.get('Items', [])]
                    guilds.append({
                        'guildId': guild_id,
                        'name': guild_item.get('name', ''),
                        'imageUrl': guild_item.get('imageUrl', ''),
                        'members': members
                    })
                body = guilds
            except Exception as e:
                print(f"Error during guilds query: {e}")
                statusCode = 500
                body = f"Error: Failed to get guilds. {str(e)}"


        
        # Add a game to a user's personal collection
        elif event['routeKey'] == "POST /users/{userId}/games":
            # Extract userId from path parameters
            user_id = event['pathParameters'].get('userId')
            if not user_id:
                raise KeyError("Missing 'userId' path parameter")

            # Parse the request body
            request_body = json.loads(event.get('body', '{}'))
            game_name = request_body.get('name')
            game_uuid = request_body.get('uuid')

            if not game_name and not game_uuid:
                raise KeyError("Missing 'name' or 'uuid' in request body")

            # Find the game in the games table
            game_item = None
            if game_uuid:
                # Query by UUID
                response = games_table.get_item(
                    Key={
                        'gameId': game_uuid
                    }
                )
                game_item = response.get("Item")
            elif game_name:
                # Query by name (scan since name is not a key)
                response = games_table.scan(
                    FilterExpression=boto3.dynamodb.conditions.Attr('name').eq(game_name)
                )
                items = response.get("Items", [])
                if items:
                    game_item = items[0]  # Assume the first match is the correct one

            if not game_item:
                raise KeyError("Game not found")

            # Perform the two PutItem operations sequentially
            try:
                # Add the game to the user's collection
                user_games_map_table.put_item(
                    Item={
                        'entityId': user_id,
                        'relatedId': game_item['gameId']
                    }
                )

                # Add the user to the game's collection
                user_games_map_table.put_item(
                    Item={
                        'entityId': game_item['gameId'],
                        'relatedId': user_id
                    }
                )

                body = {
                    "message": f"Game '{game_item['name']}' (UUID: {game_item['gameId']}) added to user {user_id}'s collection."
                }

            except Exception as e:
                print(f"Error during PutItem operations: {e}")
                statusCode = 500
                body = f"Error: Failed to add game to user's collection. {str(e)}"
        
        # Delete a game from a user's personal collection
        elif event['routeKey'] == "DELETE /users/{userId}/games/{gameId}":
            # Extract userId and gameId from path parameters
            user_id = event['pathParameters'].get('userId')
            game_id = event['pathParameters'].get('gameId')

            if not user_id or not game_id:
                raise KeyError("Missing 'userId' or 'gameId' path parameter")

            try:
                # Delete the game from the user's collection
                user_games_map_table.delete_item(
                    Key={
                        'entityId': user_id,
                        'relatedId': game_id
                    }
                )

                # Delete the user from the game's collection
                user_games_map_table.delete_item(
                    Key={
                        'entityId': game_id,
                        'relatedId': user_id
                    }
                )

                body = {
                    "message": f"Game (UUID: {game_id}) removed from user {user_id}'s collection."
                }
            except Exception as e:
                print(f"Error during DeleteItem operations: {e}")
                statusCode = 500
                body = f"Error: Failed to delete game from user's collection. {str(e)}"
                
        elif event['routeKey'] == "PUT /users/{userId}":
            user_id = event['pathParameters'].get('userId')
            if not user_id:
                raise KeyError("Missing 'userId' path parameter")

            # Parse the request body
            request_body = json.loads(event.get('body', '{}'))
            update_expression = []
            expression_attribute_values = {}

            # Only update provided fields
            for field in ['name', 'imageUrl', 'description']:
                if field in request_body:
                    update_expression.append(f"{field} = :{field}")
                    expression_attribute_values[f":{field}"] = request_body[field]

            if not update_expression:
                raise KeyError("No updatable fields provided in request body")

            # Update the user in DynamoDB
            users_table.update_item(
                Key={'userId': user_id},
                UpdateExpression="SET " + ", ".join(update_expression),
                ExpressionAttributeValues=expression_attribute_values
            )

            body = {
                "message": f"User {user_id} updated successfully."
            }


        elif event['routeKey'] == "GET /users/{userId}/friends":
            user_id = event['pathParameters'].get('userId')
            if not user_id:
                raise KeyError("Missing 'userId' path parameter")

            try:
                # Query the user_friends_map_table for friends of the user
                friends_response = user_friends_map_table.query(
                    KeyConditionExpression=boto3.dynamodb.conditions.Key('entityId').eq(user_id)
                )
                friend_ids = [item['relatedId'] for item in friends_response.get('Items', [])]

                # Fetch each friend's user data from the users table
                friends = []
                for fid in friend_ids:
                    user_response = users_table.get_item(Key={'userId': fid})
                    user_item = user_response.get("Item")
                    if user_item:
                        friends.append({
                            'userId': user_item.get('userId', ''),
                            'name': user_item.get('name', ''),
                            'imageUrl': user_item.get('imageUrl', ''),
                            # Add any other fields you want to return
                        })
                
                body = friends
                # body = {
                #     "userId": user_id,
                #     "friends": friends  # List of friend user objects
                # }

            except Exception as e:
                print(f"Error during friends query: {e}")
                statusCode = 500
                body = f"Error: Failed to get user's friends. {str(e)}"
            

        elif event['routeKey'] == "PUT /users/{userId}":

            user_id = event['pathParameters'].get('userId')
            if not user_id:
                raise KeyError("Missing 'userId' path parameter")

            # Parse the request body
            request_body = json.loads(event.get('body', '{}'))
            update_expression = []
            expression_attribute_values = {}

            # Only update provided fields
            for field in ['imageUrl', 'description']:
                if field in request_body:
                    update_expression.append(f"{field} = :{field}")
                    expression_attribute_values[f":{field}"] = request_body[field]

            if not update_expression:
                raise KeyError("No updatable fields provided in request body")

            # Update the user in DynamoDB
            users_table.update_item(
                Key={'userId': user_id},
                UpdateExpression="SET " + ", ".join(update_expression),
                ExpressionAttributeValues=expression_attribute_values
            )

            body = {
                "message": f"User {user_id} updated successfully."
            }



    except KeyError as e:
        print(f"KeyError: {e}")
        statusCode = 400
        body = f"Missing key: {str(e)}"
    except Exception as e:
        print(f"Exception: {e}")
        statusCode = 500
        body = f"Error: {str(e)}"

    return {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps(body)
    }

# test comment for github actions