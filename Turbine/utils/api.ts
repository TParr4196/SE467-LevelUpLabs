import axios from 'axios';

const API_BASE_URL = 'https://xyxhy4n2o4.execute-api.us-east-2.amazonaws.com'; // Replace with your AWS API endpoint


// GET: [userid, userid...] -> {id:{name:<>, img:<>}, id: ...}
// export const getUsersDetails = async (userIds: number[]) => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/users`, { params: { userIds } });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching user details:', error);
//     throw error;
//   }
// };

// GET: /users/userId/games -> {userId:<>, FW(from where):<>} -> {gameId:{gameName:<>, img:<>}, gameId: ...}
export const getUserGames = async (userId: number, fromWhere: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/${userId}/games`, { params: { FW: fromWhere } });
    return response.data;
  } catch (error) {
    console.error('Error fetching user games:', error);
    throw error;
  }
};

// GET: /games/gameId -> {gameId: {gameName:<>, rating:<>, tags:<>, playerCount:<>, playTime:<>, img:<>}}
export const getGameDetails = async (gameId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/games/${gameId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
};

// GET: /guilds/guildId -> {guildId:<>, guildName:<>, img:<>, members:[userId, userId, ...], log:<>}
export const getGuildDetails = async (guildId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/guilds/${guildId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching guild details:', error);
    throw error;
  }
};

// PUT: /guilds/guildId -> {guildName:, img:}
export const updateGuildDetails = async (guildId: number, guildDetails: { guildName: string; img: string }) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/guilds/${guildId}`, guildDetails);
    return response.data;
  } catch (error) {
    console.error('Error updating guild details:', error);
    throw error;
  }
};

// POST: /guilds/guildId/members -> {userId:<>, role:<>} -> 200
export const addGuildMember = async (guildId: number, memberDetails: { userId: number; role: string }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/guilds/${guildId}/members`, memberDetails);
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error adding guild member:', error);
    throw error;
  }
};

// POST: /session -> {gameIds: [gameId, gameId, ...], userIds: [userId, userId, ...]} -> 200
export const createSession = async (sessionDetails: { gameIds: number[]; userIds: number[] }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/session`, sessionDetails);
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

// GET: /sessions/sessionId -> {sessionId: <>} -> {gameIds: [gameId, gameId, ...], userIds: [userId, userId, ...]}
export const getSessionDetails = async (sessionId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session details:', error);
    throw error;
  }
};

// DELETE: /sessions/sessionId -> {sessionId: <>} -> 200
export const deleteSession = async (sessionId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/sessions/${sessionId}`);
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error deleting session:', error);
    throw error;
  }
};

// GET: /sessions/sessionId/votes -> {gameId: <>} -> 200
export const voteForGame = async (sessionId: number, gameId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}/votes`, { params: { gameId } });
    return response.status; // Should return 200 if successful
  } catch (error) {
    console.error('Error voting for game:', error);
    throw error;
  }
};



export const getUser = async (userIds: string[]) => {
    console.log(`userIds: ${userIds}`); // For debugging purposes, you can remove this later
    try {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        params: { ids: userIds.join(',') }, // Join userIds into a comma-separated string
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  };