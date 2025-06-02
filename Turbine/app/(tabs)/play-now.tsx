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
import { getGames, getUsers } from '@/utils/api';
import { User } from '@/types/user';

const { width } = Dimensions.get('window');

export default function ChooseGameScreen() {
  const { params } = useRoute<any>();
  const initialSelectedFriends = params?.selectedFriends || [];
  const initialSelectedGuilds = params?.selectedGuilds || [];
  const { games, friends: allFriends, guilds: allGuilds } = useAppData();
  const [ combinedGames, setCombinedGames] = useState<Game[]>([]);

  const [selectedGuilds, setSelectedGuilds] = useState(initialSelectedGuilds);
  const [selectedFriends, setSelectedFriends] = useState(initialSelectedFriends);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [gameId: string]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleGuild, setModalVisibleGuild] = useState(false);


  function getCombinedGames(){
    const userIds = selectedFriends.map((friend: Friend) => friend.userId);

    // Flatten guild members and get unique ones not already in userIds
    const guildMemberIds: string[] = (selectedGuilds as Guild[])
      .flatMap((guild: Guild) => guild.members)
      .map((member: string) => member) // assuming members are User objects
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index) // remove duplicates within guilds
      .filter((id: string) => !userIds.includes(id)); // exclude ones already in userIds

    userIds.push(...guildMemberIds);

    if(userIds.length > 0){
      setGameData(userIds)
    } else {
      setCombinedGames(games)
    }
  }

  useEffect(()=>{
    getCombinedGames();
  },[])

  useEffect(()=>{
    getCombinedGames()
  },[selectedFriends, selectedGuilds])

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
        alert('All games answered!');
      }
    });
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


  return (
    <View style={[styles.container, { backgroundColor: '#111', padding: 20, flex: 1 }]}>
      <Text style={[styles.title, { color: 'white', marginBottom: 10 }]}>Choose Friends and Game</Text>

      {/* Button to open friend selection modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={friendStyles.selectFriendsButton}>
        <Text style={{ color: 'white', fontSize: 16 }}>
          Select Friends ({selectedFriends.length})
        </Text>
      </TouchableOpacity>

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
          {selectedFriends && selectedFriends.length > 0
            ? selectedFriends
                .filter((f: Friend) => f.name && f.name.trim() !== '')
                .map((f: Friend) => f.name)
                .join(', ')
            : 'No friends selected'}
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


      {/* Modal for friend selection */}
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
      <TouchableOpacity onPress={() => setModalVisibleGuild(true)} style={friendStyles.selectFriendsButton}>
        <Text style={{ color: 'white', fontSize: 16 }}>
          Select Guilds ({selectedGuilds.length})
        </Text>
      </TouchableOpacity>
    </View>
  );
}
