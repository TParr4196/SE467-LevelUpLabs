import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, Image, FlatList, Alert, Button, Platform, TouchableOpacity, Modal } from 'react-native';
import GameLibraryScreen from './game-library'; // Import the GameLibraryScreen
import {DEFAULT_FRIEND_IDS} from '@/utils/constants'; // HARD CODED FRIENDS
import { getUsers } from '@/utils/api';

export default function FriendsScreen() {
  const [friendsDetails, setFriendsDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Fetch user details for the friend IDs
        const users = await getUsers(DEFAULT_FRIEND_IDS);
        console.log('Fetched friends:', users);
        setFriendsDetails(users);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Failed to load friends. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleSendLibrary = (friendName: string) => {
    setSelectedFriend(friendName);
    setModalVisible(true);
  };

  const confirmSendLibrary = () => {
    console.log(`Library sent to ${selectedFriend}`);
    setModalVisible(false);
    // TODO: Implement the logic to send the library to the user
  };

  const cancelSendLibrary = () => {
    console.log(`Library sending canceled for ${selectedFriend}`);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={friendsDetails}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <Button
              title="Send Library"
              onPress={() => handleSendLibrary(item.name)}
            />
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to send your personal collection of games to {selectedFriend}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={confirmSendLibrary}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={cancelSendLibrary}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    gap: 16,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    padding: 12,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});




// export default function TabFourScreen() {
//   // State for profile privacy (public/private)
//   const [isPrivate, setIsPrivate] = useState(false);

//   // Toggle privacy
//   const togglePrivacy = () => setIsPrivate(previousState => !previousState);

//   return (
//     <View style={styles.container}>
//       {/* Profile Privacy Toggle */}
//       <View style={styles.privacyContainer}>
//         <Text style={styles.privacyText}>
//           {isPrivate ? 'Private Profile (switch just for demonstration purposes)' : 'Public Profile (switch just for demonstration purposes)'}
//         </Text>
//         <Switch
//           value={isPrivate}
//           onValueChange={togglePrivacy}
//           trackColor={{ false: '#767577', true: '#81b0ff' }}
//           thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
//         />
//       </View>

//       {/* Conditionally render the GameLibraryScreen or status */}
//       <View style={styles.statusContainer}>
//         {isPrivate ? (
//           <Text style={styles.statusText}>This profile is private</Text>
//         ) : (
//           <GameLibraryScreen /> // Render the GameLibraryScreen when the profile is public
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   privacyContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   privacyText: {
//     fontSize: 18,
//     color: '#333',
//   },
//   statusContainer: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   statusText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
// });
