import axios from 'axios';

const API_BASE_URL = 'https://xyxhy4n2o4.execute-api.us-east-2.amazonaws.com'; // Replace with your AWS API endpoint

// GET: /users/userId/games -> {userId:<>, FW(from where):<>} -> {gameId:{gameName:<>, img:<>}, gameId: ...}
// ***** I feel like this one is not necessary. We can get the user's games list, then request those specific games from the /games/gameId endpoint ******
// export const getUserGames = async (userId: number, fromWhere: string) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users/${userId}/games`, { params: { FW: fromWhere } });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user games:', error);
//     throw error;
//   }
// };



// GET: /users [userid, userid...] -> [{userId: <>, name:<>, gamesOwned:<>}, {userId: <>, ...}]
export const getUsers = async (userIds: string[]) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`, {
      params: { ids: userIds.join(',') }, 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// GET: /users/{userId}/friends -> [{userId, name, imageUrl}, {userId, name, imageUrl}, ...]
export const getUserFriends = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/friends`);
    console.log(`${API_BASE_URL}/users/${userId}/friends`)
    console.log('User friends:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching user friends:', error);
    throw error;
  }
};

// GET: /games [gameId, gameId, ...] -> [{gameId:<>, name:<>, genres:[<>], rating:<>, imageUrl:<>, averagePlaytime:<>, recommendedPlayers:<>}, {gameId:<>, ...}]
export const getGames = async (gameIds: string[] | null = null) => {
  try {
    // const response = await axios.get(`${API_BASE_URL}/games`);
    const response = await axios.get(`${API_BASE_URL}/games`,
      gameIds && gameIds.length > 0
        ? { params: { ids: gameIds.join(',') } }
        : { params: { ids: [] } }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

// GET: /guilds -> [{guildId, name, imageUrl, members: [userId, ...]}, ...]
export const getAllGuilds = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/guilds`);
    return response.data; // Array of guild objects
  } catch (error) {
    console.error('Error fetching guilds:', error);
    throw error;
  }
};

// POST: /users/{userId}/games -> {name: <>, uuid: <>} -> {message: <>}
export const postToCollection = async (userId: string, gameDetails: { name?: string; uuid?: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/${userId}/games`, gameDetails);
    return response.data; // Return the response message
  } catch (error) {
    console.error('Error adding game to collection:', error);
    throw error;
  }
};

// DELETE: /users/{userId}/games/{gameId} -> {message: <>}
export const deleteFromCollection = async (userId: string, gameId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/${userId}/games/${gameId}`);
    return response.data; // Return the response message
  } catch (error) {
    console.error('Error deleting game from collection:', error);
    throw error;
  }
};


// GET: /guilds/guildId -> {guildId:<>, guildName:<>, img:<>, members:[userId, userId, ...], log:<>}
export const getGuildDetails = async (guildId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/guilds/${guildId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching guild details:', error);
    throw error;
  }
};

// PUT: /guilds/guildId -> {guildName:, img:}
export const updateGuildDetails = async (guildId: string, guildDetails: { guildName: string; img: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/guilds/${guildId}`, guildDetails);
    return response.data;
  } catch (error) {
    console.error('Error updating guild details:', error);
    throw error;
  }
};

// POST: /guilds/guildId/members -> {userId:<>, role:<>} -> 200
export const addGuildMember = async (guildId: string, memberDetails: { userId: string; role: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/guilds/${guildId}/members`, memberDetails);
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error adding guild member:', error);
    throw error;
  }
};

// DELETE: /guilds/guildId/members -> {userId: <>} in body -> 200
export const removeGuildMember = async (guildId: string, userId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/guilds/${guildId}/members`, {
      data: { userId }
    });
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error removing guild member:', error);
    throw error;
  }
};

// POST: /session -> {gameIds: [gameId, gameId, ...], userIds: [userId, userId, ...]} -> 200
export const createSession = async (sessionDetails: { gameIds: string[]; userIds: string[] }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/sessions`, sessionDetails);
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// GET: /sessions/sessionId -> {sessionId: <>} -> {gameIds: [gameId, gameId, ...], userIds: [userId, userId, ...]}
export const getSessionDetails = async (sessionId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session details:', error);
    throw error;
  }
};

// DELETE: /sessions/sessionId -> {sessionId: <>} -> 200
export const deleteSession = async (sessionId: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/sessions/${sessionId}`);
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

// GET: /sessions/sessionId/votes -> {gameId: <>} -> 200
export const voteForGame = async (sessionId: string, gameId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}/votes`, { params: { gameId } });
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error voting for game:', error);
    throw error;
  }
};

// POST: /sessions/{sessionId}/members -> {userIds: [<>, <>]} -> 200
export const addSessionMembers = async (sessionId: string, userIds: string[]) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/sessions/${sessionId}/members`,
      { userIds }
    );
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error adding session members:', error);
    throw error;
  }
};



// GET: /users/{userId}/profile -> {userId, username, avatarUrl, description, isPrivate, ...}
export const getUserProfile = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/profile`);
    const data = response.data;

    // Map backend fields to frontend fields if needed
    return {
      userId: data.userId,
      // Use 'name' from backend as 'username' if your frontend expects 'username'
      username: data.username || data.name || '',
      avatarUrl: data.avatarUrl || data.imageUrl || '',
      description: data.description || '',
      isPrivate: data.isPrivate ?? false,
      // Add any other fields you expect here
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// PUT: /users/{userId}/profile -> {description, isPrivate} -> updated profile
export const updateUserProfile = async (
  userId: string,
  profile: { description?: string; isPrivate?: boolean }
) => {
  try {
    console.log('Updating user ID:', userId);
    console.log('Updating user profile:', profile);

    // The backend expects PUT /{userId}`
      console.log('Updated profile:', `${API_BASE_URL}/users/${userId}`);
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, profile);
  
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// POST: /users/{userId}/avatar -> multipart/form-data {avatar: file} -> {avatarUrl}
export const uploadUserAvatar = async (userId: string, imageUri: string) => {
  try {
    const formData = new FormData();
    formData.append('avatar', {
      uri: imageUri,
      name: 'avatar.png',
      type: 'image/png',
    } as any);

    const response = await axios.post(
      `${API_BASE_URL}/users/${userId}/avatar`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading user avatar:', error);
    throw error;
  }
};
