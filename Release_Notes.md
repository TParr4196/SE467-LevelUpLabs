# Release Notes

> Documenting updates, features, bug fixes, and known issues for this repository.

---

## Version: v1.0.0  
**Release Date:** May-4-2025

---

### 🚀 Overview
Brief description of the goals or focus of this release.
With this first release, our goal was to bring to life one of our most lovable features, being able to keep track of a users game collection.

---

### ✅ New Features
- Feature 1: User's game collection tab.
- Feature 2: User can add a game to their owned games library.
- Feature 3: User can remove a game from their own games library.
- Feature 4: A friends tab has been added, that tracks the user's friends.
- Feature 5: A user can send they game collection to a friend of the user.
- Feature 6: A user can set their profile to private. 

---

### ⚠️ Known Issues
- Issue 1: The user's id, and friends id, as well as available games by their ids are hard coded. In the furture, the user's id will be based on the logged in user. Their friends list will need to be tracked on the backened where its dynamically populated. The games allowed to select will show all games in the backened dynamically, which will require a new API endpoint to get all gamesId/gameNames. 
- Issue 2: Currently sending a collection to another user doesn't do anything, as the system does not currently have connections between users. The system will need to send messages back and forth to one another.
- Issue 3: When toggling the slider for setting the application to private or not, it doesn't really do anything currently. Functionality of setting the profile to private needs to be added.

---

### 📦 Installation / Upgrade Instructions
1. Clone or download the repository:
   ```bash
   git clone https://github.com/TParr4196/SE467-LevelUpLabs.git