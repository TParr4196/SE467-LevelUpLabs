# fastapi_app.py
from fastapi import FastAPI
from .firebase_config import db  # Import Firestore DB from firebase_config

app = FastAPI()

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