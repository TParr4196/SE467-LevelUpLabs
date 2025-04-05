import os
from django.core.wsgi import get_wsgi_application  # Use WSGI application for WSGIMiddleware
from fastapi.middleware.wsgi import WSGIMiddleware
from .fastapi_app import app as fastapi_app  # Import your FastAPI app here

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'turbine.settings')

# Create the Django WSGI application
django_application = get_wsgi_application()

# Mount the Django app as WSGI middleware in the FastAPI app
fastapi_app.mount("/", WSGIMiddleware(django_application))

# Define the ASGI application for Uvicorn
application = fastapi_app