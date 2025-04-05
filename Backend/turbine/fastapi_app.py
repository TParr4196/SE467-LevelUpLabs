# fastapi_app.py
from fastapi import FastAPI
from .firebase_config import db  # Import Firestore DB from firebase_config
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

#adapted from chatgpt:
def get_data():
    # Reference to the Firestore collection
    guilds_ref = db.collection('Guilds')

    # Get all documents in the collection
    guilds = guilds_ref.stream()

    # Prepare the data to return
    guild_list = []
    for guild in guilds:
        guild_list.append(guild.to_dict())
    return guild_list

@app.get("/fastapi")
def read_root():
    return {"test":get_data()}