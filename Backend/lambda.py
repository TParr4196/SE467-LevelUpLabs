import json
import boto3
from decimal import Decimal

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('turbine_backend')

def lambda_handler(event, context):
    print(event)
    body = {}
    statusCode = 200

    try:
        if event['routeKey'] == "GET /":
            body = {
                "message": "Hello from github actions!",
            }
        if event['routeKey'] == "DELETE /items/{id}":
            table.delete_item(
                Key={
                    'id': event['pathParameters']['id'],
                    'value': 'items'
                }
            )
            body = 'Deleted item ' + event['pathParameters']['id']

        elif event['routeKey'] == "GET /items/{id}":
            response = table.get_item(
                Key={
                    'id': event['pathParameters']['id'],
                    'value': 'items'
                }
            )
            item = response.get("Item")
            if item:
                body = {
                    'price': float(item['price']),
                    'id': item['id'],
                    'value': 'items',
                    'name': item['name']
                }
            else:
                statusCode = 404
                body = "Item not found"

        elif event['routeKey'] == "GET /items":
            response = table.scan()
            items = response.get("Items", [])
            body = []
            for item in items:
                body.append({
                    'price': float(item['price']),
                    'id': item['id'],
                    'value': 'items',
                    'name': item['name']
                })

        elif event['routeKey'] == "PUT /items":
            requestJSON = json.loads(event['body'])
            table.put_item(
                Item={
                    'id': requestJSON['id'],
                    'value': 'items',
                    'price': Decimal(str(requestJSON['price'])),
                    'name': requestJSON['name']
                }
            )
            body = f"Put item {requestJSON['id']} {requestJSON['value']}"

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