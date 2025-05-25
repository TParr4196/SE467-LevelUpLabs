import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StyleSheet,
  Animated,
  Modal,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useAppData } from '@/app/context/AppDataContext';
import { styles } from '@/app/styles/homeScreenStyles';
import { Friend } from '@/types/friend';
import { friendStyles } from '../styles/playNowStyles';

const { width } = Dimensions.get('window');

export default function ChooseGameScreen() {
  const { params } = useRoute<any>();
  const initialSelectedFriends = params.selectedFriends || [];
  const { games, friends: allFriends } = useAppData();

  const [selectedFriends, setSelectedFriends] = useState(initialSelectedFriends);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [gameId: string]: boolean }>({});
  const [modalVisible, setModalVisible] = useState(false);

  // Animated value for horizontal slide
  const slideAnim = useRef(new Animated.Value(0)).current;

  const currentGame = games[currentGameIndex];

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
      if (currentGameIndex < games.length - 1) {
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

  if (!currentGame) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: '#111', justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: 'white', fontSize: 20 }}>No games available</Text>
      </View>
    );
  }

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
          source={{ uri: currentGame.imageUrl }}
          style={{ width: 300, height: 300, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={{ color: 'white', fontSize: 28, fontWeight: 'bold', textAlign: 'center' }}>
          {currentGame.name}
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
    </View>
  );
}
