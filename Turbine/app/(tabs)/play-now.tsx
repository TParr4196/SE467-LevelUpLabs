import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppData } from '@/app/context/AppDataContext';
import { styles } from '@/app/styles/homeScreenStyles';
import { Friend } from '@/types/friend';
import { friendStyles } from '../styles/playNowStyles';
import { Game } from '@/types/game';
import { Guild } from '@/types/guild';
import { getGames, getUsers, voteForGame, getSessionDetails } from '@/utils/api';
import { User } from '@/types/user';
import { createSession } from '@/utils/api'; // Make sure this import exists
import { DEFAULT_USER_ID } from '@/utils/constants'; // Ensure this constant is defined in your constants file

const { width } = Dimensions.get('window');

export default function ChooseGameScreen() {
  const { params } = useRoute<any>();
  const initialSelectedFriends = params?.selectedFriends || [];
  const initialSelectedGuilds = params?.selectedGuilds || [];
  const { games, friends: allFriends, guilds: allGuilds } = useAppData();
  const [combinedGames, setCombinedGames] = useState<Game[]>([]);

  const [selectedGuilds, setSelectedGuilds] = useState(initialSelectedGuilds);
  const [selectedFriends, setSelectedFriends] = useState(initialSelectedFriends);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [gameId: string]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleGuild, setModalVisibleGuild] = useState(false);
  const [showCreateSession, setShowCreateSession] = useState(true);
  const [creatingSession, setCreatingSession] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [mockVotes, setMockVotes] = useState<{ [gameId: string]: number }>({});
  const [votingComplete, setVotingComplete] = useState(false);
  const [votedGamesModalVisible, setVotedGamesModalVisible] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<any>(null);

  useEffect(() => {
    if (!sessionDetails && combinedGames.length > 0 && Object.keys(mockVotes).length === 0) {
      const randomVotes: { [gameId: string]: number } = {};
      combinedGames.forEach(game => {
        randomVotes[game.gameId] = Math.floor(Math.random() * 4) + 1; // 1 to 4
      });
      setMockVotes(randomVotes);
    }
  }, [combinedGames, sessionDetails, mockVotes]);


  function getCombinedGames() {
    const userIds = selectedFriends.map((friend: Friend) => friend.userId);

    // Flatten guild members and get unique ones not already in userIds
    const guildMemberIds: string[] = (selectedGuilds as Guild[])
      .flatMap((guild: Guild) => guild.members)
      .map((member: string) => member) // assuming members are User objects
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index) // remove duplicates within guilds
      .filter((id: string) => !userIds.includes(id)); // exclude ones already in userIds

    userIds.push(...guildMemberIds);

    if (userIds.length > 0) {
      setGameData(userIds)
    } else {
      setCombinedGames(games)
    }
  }

  useEffect(() => {
    getCombinedGames();
  }, [])

  useEffect(() => {
    getCombinedGames()
  }, [selectedFriends, selectedGuilds])

  async function setGameData(userIds: string[]) {
    if (userIds.length === 0) return;
    try {
      // Fetch user data
      const users = await getUsers(userIds);

      // Collect unique game IDs owned by these users

      const combinedGameIds: string[] = (users as User[])
        .map((user: User) => user.gamesOwned)
        .reduce((sharedGames: string[], userGames: string[]) =>
          sharedGames.filter((id: string) => userGames.includes(id))
        );


      // Fetch full game data for these IDs
      const allGames = await getGames(combinedGameIds);

      // Map to the expected Game shape (may be unnecessary if getGames already returns full Game objects)
      const allGameObjects: Game[] = allGames.map((game: Game) => ({
        gameId: game.gameId,
        name: game.name,
        imageUrl: game.imageUrl,
        rating: game.rating,
        recommendedPlayers: game.recommendedPlayers,
        averagePlaytime: game.averagePlaytime,
        genres: game.genres,
      }));

      // Update state
      setCombinedGames(allGameObjects);
    } catch (error) {
      console.error('Error fetching game data:', error);
    }
  }


  // Animated value for horizontal slide
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentGame = combinedGames[currentGameIndex];

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev: Friend[]) => {
      if (prev.find((f) => f.userId === friendId)) {
        return prev.filter((f) => f.userId !== friendId);
      } else {
        const friendToAdd = allFriends.find((f) => f.userId === friendId);
        return friendToAdd ? [...prev, friendToAdd] : prev;
      }
    });
  };

  const toggleGuild = (guildId: string) => {
    setSelectedGuilds((prev: Guild[]) => {
      if (prev.find((g) => g.guildId === guildId)) {
        return prev.filter((g) => g.guildId !== guildId);
      } else {
        const guildToAdd = allGuilds.find((g) => g.guildId === guildId);
        return guildToAdd ? [...prev, guildToAdd] : prev;
      }
    });
  };


  const handleAnswer = (answer: boolean) => {
    if (!currentGame) return;

    // Animate slide left for No, right for Yes
    Animated.timing(slideAnim, {
      toValue: answer ? width : -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Save answer
      setAnswers((prev) => ({
        ...prev,
        [currentGame.gameId]: answer,
      }));

      // Reset animation position
      slideAnim.setValue(0);

      // Move to next game or finish
      if (currentGameIndex < combinedGames.length - 1) {
        setCurrentGameIndex(currentGameIndex + 1);
      } else {
        setVotingComplete(true); // <-- Mark voting as complete
      }
    });
  };

  const handleCreateSession = async (gameIdsOverride?: string[]) => {
    const gameIds = gameIdsOverride || combinedGames.map(g => g.gameId);
    const userIds = [
      DEFAULT_USER_ID,
      ...selectedFriends
        .map((f: Friend) => f.userId)
        .filter((id: string) => id !== DEFAULT_USER_ID)
    ];

    if (!gameIds.length || !userIds.length) {
      alert('Please select at least one game before creating a session.');
      setCreatingSession(false);
      return;
    }

    setCreatingSession(true);
    try {
      const result = await createSession({ gameIds, userIds });
      const sessionId = result.sessionId || (result.session && result.session.sessionId);
      if (!sessionId) {
        alert('Session creation failed: No sessionId returned.');
        setCreatingSession(false);
        return;
      }
      setSessionId(sessionId);

      // Vote for each game that received a "Yes"
      for (const gameId of gameIds) {
        try {
          await voteForGame(sessionId, gameId);
        } catch (error: any) {
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Message:', error.response.data);
          } else {
            console.error('Vote failed:', error.message);
          }
        }
      }

      // Fetch session details AFTER voting
      try {
        const details = await getSessionDetails(sessionId);
        setSessionDetails(details);
        console.log('Session details:', details);
      } catch (err) {
        console.error('Failed to fetch session details:', err);
      }

      setShowCreateSession(false);
    } catch (e) {
      if (e.response) {
        alert(`Failed to create session: ${e.response.data}`);
      } else {
        alert(`Failed to create session: ${e.message}`);
      }
    } finally {
      setCreatingSession(false);
    }
  };

  const renderFriendItem = ({ item }: { item: any }) => {
    const isSelected = selectedFriends.some((f: Friend) => f.userId === item.userId);
    return (
      <TouchableOpacity
        onPress={() => toggleFriend(item.userId)}
        style={[
          friendStyles.friendItem,
          { backgroundColor: isSelected ? '#2ecc71' : '#333' },
        ]}
      >
        <Text style={{ color: isSelected ? 'white' : 'lightgray' }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };
  const renderGuildItem = ({ item }: { item: Guild }) => {
    const isSelected = selectedGuilds.some((g: Guild) => g.guildId === item.guildId);
    return (
      <TouchableOpacity
        onPress={() => toggleGuild(item.guildId)}
        style={[
          friendStyles.friendItem,
          { backgroundColor: isSelected ? '#3498db' : '#333' },
        ]}
      >
        <Text style={{ color: isSelected ? 'white' : 'lightgray' }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };


  const votedGames = combinedGames
    .map(g => {
      const sessionVotes = sessionDetails?.gameIds?.[g.gameId]?.votes ?? 0;
      const mockVoteCount = mockVotes?.[g.gameId] ?? 0;
      return {
        ...g,
        votes: sessionVotes + mockVoteCount
      };
    })
    .sort((a, b) => b.votes - a.votes);



  const longestNameLength = votedGames.reduce(
    (max, g) => Math.max(max, g.name.length),
    0
  );

  // You can tweak this multiplier for padding/spacing
  const nameColumnWidth = Math.max(120, longestNameLength * 10);


  return (
    <View style={[styles.container, { backgroundColor: '#111', padding: 20, flex: 1 }]}>
      {/* Voting Complete Modal */}
      {votingComplete && (
        <Modal visible={votingComplete} transparent animationType="fade">
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <View style={{
              backgroundColor: '#222',
              padding: 30,
              borderRadius: 16,
              alignItems: 'center'
            }}>
              <Text style={{ color: 'white', fontSize: 22, marginBottom: 20 }}>Ready to Create Session?</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#2ecc71',
                  paddingVertical: 12,
                  paddingHorizontal: 30,
                  borderRadius: 8,
                  marginBottom: 10,
                  opacity: creatingSession ? 0.5 : 1
                }}
                onPress={async () => {
                  // Only include games with a "Yes" vote
                  const yesGameIds = Object.entries(answers)
                    .filter(([_, v]) => v)
                    .map(([id]) => id);
                  await handleCreateSession(yesGameIds);
                  setVotingComplete(false);
                }}
                disabled={creatingSession}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>
                  {creatingSession ? 'Creating...' : 'Create Session'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Always show the main UI */}
      <>
        {/* Top: Select Friends */}
        <TouchableOpacity onPress={() => setModalVisible(true)} style={[friendStyles.selectFriendsButton, { marginBottom: 10 }]}>
          <Text style={{ color: 'white', fontSize: 16 }}>
            Select Friends ({selectedFriends.length})
          </Text>
        </TouchableOpacity>

        {/* Middle: Animated Game View */}
        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            transform: [{ translateX: slideAnim }],
          }}
        >
          <Image
            source={{ uri: currentGame?.imageUrl }}
            style={{ width: 300, height: 300, marginBottom: 20 }}
            resizeMode="contain"
          />
          <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>
            {currentGame?.name}
          </Text>
          <Text style={{ color: 'gray', marginVertical: 10, textAlign: 'center' }}>
            Playing with:{' '}
            {[
              ...selectedFriends
                .filter((f: Friend) => f.name && f.name.trim() !== '')
                .map((f: Friend) => f.name),
              ...selectedGuilds
                .filter((g: Guild) => g.name && g.name.trim() !== '')
                .map((g: Guild) => g.name)
            ].join(', ') || 'No players selected'}
          </Text>


          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <TouchableOpacity
              onPress={() => handleAnswer(false)}
              style={[friendStyles.answerButton, { backgroundColor: 'crimson' }]}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>No</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleAnswer(true)}
              style={[friendStyles.answerButton, { backgroundColor: 'limegreen' }]}
            >
              <Text style={{ color: 'white', fontSize: 20 }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Bottom: Select Guilds */}
        {/* View Voted Games Button */}
        <TouchableOpacity
          onPress={() => setVotedGamesModalVisible(true)}
          style={[friendStyles.selectFriendsButton, { marginTop: 10, marginBottom: 0 }]}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>
            View Voted Games
          </Text>
        </TouchableOpacity>

        {/* Select Guilds Button */}
        <TouchableOpacity onPress={() => setModalVisibleGuild(true)} style={[friendStyles.selectFriendsButton, { marginTop: 10 }]}>
          <Text style={{ color: 'white', fontSize: 16 }}>
            Select Guilds ({selectedGuilds.length})
          </Text>
        </TouchableOpacity>

        {/* Voted Games Modal */}
        <Modal
          visible={votedGamesModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setVotedGamesModalVisible(false)}
        >
          <View style={friendStyles.modalOverlay}>
            <View style={friendStyles.modalContent}>
              <Text style={[styles.title, { marginBottom: 10, color: 'white' }]}>Voted Games</Text>
              {/* Table Header */}
              <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingTop: 10, paddingBottom: 4 }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                    fontFamily: 'monospace',
                    width: nameColumnWidth,
                  }}
                >
                  Game
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                    fontFamily: 'monospace',
                    marginLeft: 8,
                    minWidth: 32,
                    textAlign: 'left',
                  }}
                >
                  Votes
                </Text>
              </View>
              <FlatList
                data={votedGames}
                keyExtractor={(item) => item.gameId}
                renderItem={({ item }) => (
                  <View style={{ paddingVertical: 8, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 16,
                        fontFamily: 'monospace',
                        width: nameColumnWidth,
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        color: 'limegreen',
                        fontSize: 16,
                        fontFamily: 'monospace',
                        marginLeft: 8,
                        minWidth: 32,
                        textAlign: 'left',
                      }}
                    >
                      {item.votes}
                    </Text>
                  </View>
                )}
                ListEmptyComponent={
                  <Text style={{ color: 'gray', textAlign: 'center' }}>No games have received a "Yes" vote yet.</Text>
                }
              />
              <TouchableOpacity onPress={() => setVotedGamesModalVisible(false)} style={friendStyles.closeModalButton}>
                <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Friend Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={friendStyles.modalOverlay}>
            <View style={friendStyles.modalContent}>
              <Text style={[styles.title, { marginBottom: 10, color: 'white' }]}>Select Friends</Text>
              <FlatList
                data={allFriends}
                keyExtractor={(item) => item.userId}
                renderItem={renderFriendItem}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
              <TouchableOpacity onPress={() => setModalVisible(false)} style={friendStyles.closeModalButton}>
                <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Guild Modal */}
        <Modal visible={modalVisibleGuild} animationType="slide" transparent={true}>
          <View style={friendStyles.modalOverlay}>
            <View style={friendStyles.modalContent}>
              <Text style={[styles.title, { marginBottom: 10, color: 'white' }]}>Select Guilds</Text>
              <FlatList
                data={allGuilds}
                keyExtractor={(item) => item.guildId}
                renderItem={renderGuildItem}
                contentContainerStyle={{ paddingBottom: 20 }}
              />
              <TouchableOpacity onPress={() => setModalVisibleGuild(false)} style={friendStyles.closeModalButton}>
                <Text style={{ color: 'white', fontSize: 18 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </>
    </View>
  );
}
