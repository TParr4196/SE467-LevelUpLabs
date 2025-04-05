# from chat gpt
import firebase_admin
from firebase_admin import credentials, firestore

# Path to the Firebase credentials JSON file
cred = credentials.Certificate("turbine/firebase_credentials.json")

# Initialize Firebase
firebase_admin.initialize_app(cred)

# Initialize Firestore DB
db = firestore.client()
