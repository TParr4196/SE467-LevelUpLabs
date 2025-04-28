import json
import boto3
from decimal import Decimal

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")

users_table = dynamodb.Table('users')
user_games_map_table = dynamodb.Table('user_gamesOwned_map')
games_table = dynamodb.Table('games')

def lambda_handler(event, context):
    print(event)
    body = {}
    statusCode = 200

    try:
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
                    })
            body = users
        
        elif event['routeKey'] == "GET /games":
            # Extract game IDs from query parameters
            game_ids = event.get('queryStringParameters', {}).get('ids', '')
            if not game_ids:
                raise KeyError("Missing 'ids' query parameter")

            # Split the game IDs into a list
            game_ids_list = game_ids.split(',')

            # Query the DynamoDB table for each game ID
            games = []
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
                        'genres': list(item.get('genres', [])),  # Default to an empty list if not present
                        'rating': str(item.get('rating', '')),  # Convert rating to string
                        'imageUrl': item.get('imageUrl', ''),
                        'averagePlaytime': item.get('averagePlaytime', ''),
                        'recommendedPlayers': item.get('recommendedPlayers', '')
                    })

            body = games
        # if event['routeKey'] == "GET /test":
        #     body = {
        #         "message": "Hello from github actions! Checking if API autoupdates.",
        #     }
        # if event['routeKey'] == "DELETE /items/{id}":
        #     table.delete_item(
        #         Key={
        #             'id': event['pathParameters']['id'],
        #             'value': 'items'
        #         }
        #     )
        #     body = 'Deleted item ' + event['pathParameters']['id']

        # elif event['routeKey'] == "GET /items/{id}":
        #     response = table.get_item(
        #         Key={
        #             'id': event['pathParameters']['id'],
        #             'value': 'items'
        #         }
        #     )
        #     item = response.get("Item")
        #     if item:
        #         body = {
        #             'price': float(item['price']),
        #             'id': item['id'],
        #             'value': 'items',
        #             'name': item['name']
        #         }
        #     else:
        #         statusCode = 404
        #         body = "Item not found"

        # elif event['routeKey'] == "GET /items":
        #     response = table.scan()
        #     items = response.get("Items", [])
        #     body = []
        #     for item in items:
        #         body.append({
        #             'price': float(item['price']),
        #             'id': item['id'],
        #             'value': 'items',
        #             'name': item['name']
        #         })

        # elif event['routeKey'] == "PUT /items":
        #     requestJSON = json.loads(event['body'])
        #     table.put_item(
        #         Item={
        #             'id': requestJSON['id'],
        #             'value': 'items',
        #             'price': Decimal(str(requestJSON['price'])),
        #             'name': requestJSON['name']
        #         }
        #     )
        #     body = f"Put item {requestJSON['id']} {requestJSON['value']}"

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