import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Modal, ScrollView, TextInput } from 'react-native';
import { getUsers } from '@/utils/api';
import { DEFAULT_FRIEND_IDS } from '@/utils/constants';
import { getGuildDetails } from '@/utils/api';
import { StyleSheet, View, Text, Switch, Image, FlatList, Alert, Button, Platform, TouchableOpacity, Modal } from 'react-native';
import GameLibraryScreen from './game-library'; // Import the GameLibraryScreen
import {DEFAULT_USER_ID} from '@/utils/constants'; // HARD CODED FRIENDS
import { getUserFriends, getUsers } from '@/utils/api';

export default function GuildsFriendsScreen() {
  const [isGuildsView, setIsGuildsView] = useState(false);
  const [guildsDetails, setGuildsDetails] = useState<any[]>([]);
  const [friendsDetails, setFriendsDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guild invites modal state
  const [invitesVisible, setInvitesVisible] = useState(false);
  const [createGuildVisible, setCreateGuildVisible] = useState(false);

  // Create Guild form state
  const [guildName, setGuildName] = useState('');
  const [guildDescription, setGuildDescription] = useState('');
  const [gameTagInput, setGameTagInput] = useState('');
  const [gameTags, setGameTags] = useState<string[]>([]);

  const [guildInvites] = useState([
    { id: 1, name: 'Guild Alpha', from: 'User123' },
    { id: 2, name: 'Guild Beta', from: 'User456' },
    { id: 3, name: 'Guild Gamma', from: 'User789' },
  ]);

  // Add Friend modal state
  const [addFriendVisible, setAddFriendVisible] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [friendPhone, setFriendPhone] = useState('');

  // Remove modal state
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isGuildsView) {
          const guilds = await getGuildDetails();
          setGuildsDetails(guilds);
        } else {
          const friends = await getUsers(DEFAULT_FRIEND_IDS);
          setFriendsDetails(friends);
        }
        // Fetch user details for the friend IDs
        const users = await getUserFriends(DEFAULT_USER_ID);
        setFriendsDetails(users);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isGuildsView]);

  const handleCardPress = (item: any) => {
    console.log('Card pressed:', item);
    // Navigate to another page or handle selection logic here
  };

  const renderCard = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.cardContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Tag add/remove handlers
  const handleAddTag = () => {
    if (gameTagInput.trim() && !gameTags.includes(gameTagInput.trim())) {
      setGameTags([...gameTags, gameTagInput.trim()]);
      setGameTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setGameTags(gameTags.filter(t => t !== tag));
  };

  // Remove handler (for both friends and guilds)
  const handleRemoveConfirm = () => {
    if (isGuildsView) {
      // TODO: Implement remove guild logic
      setGuildsDetails(guildsDetails.filter(g => g.id !== selectedToRemove?.id));
    } else {
      // TODO: Implement remove friend logic
      setFriendsDetails(friendsDetails.filter(f => f.id !== selectedToRemove?.id && f.userId !== selectedToRemove?.userId));
    }
    setRemoveModalVisible(false);
    setSelectedToRemove(null);
  };

  // Custom large button
  const LargeButton = ({ title, onPress, style, disabled }: { title: string; onPress: () => void; style?: any; disabled?: boolean }) => (
    <TouchableOpacity style={[styles.largeButton, style]} onPress={onPress} disabled={disabled}>
      <Text style={styles.largeButtonText}>{title}</Text>
    </TouchableOpacity>
  );

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
      {/* Enhanced Toggle */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[styles.toggleBox, isGuildsView && styles.activeBox]}
          onPress={() => setIsGuildsView(true)}
        >
          <Text style={[styles.toggleText, isGuildsView && styles.activeText]}>Guilds</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBox, !isGuildsView && styles.activeBox]}
          onPress={() => setIsGuildsView(false)}
        >
          <Text style={[styles.toggleText, !isGuildsView && styles.activeText]}>Friends</Text>
        </TouchableOpacity>
      </View>

      {/* List of Guilds or Friends */}
      <FlatList
        data={isGuildsView ? guildsDetails : friendsDetails}
        keyExtractor={(item) => item.id || item.userId}
        renderItem={renderCard}
        contentContainerStyle={styles.grid}
        numColumns={3}
      />

      {/* Buttons Above Navbar */}
      <View style={styles.bottomButtonContainer}>
        {isGuildsView ? (
          <>
            <LargeButton title="Create Guild" onPress={() => setCreateGuildVisible(true)} />
            <LargeButton title="Leave Guild" onPress={() => setRemoveModalVisible(true)} />
          </>
        ) : (
          <>
            <LargeButton title="Add Friend" onPress={() => setAddFriendVisible(true)} />
            <LargeButton title="Remove Friend" onPress={() => setRemoveModalVisible(true)} />
          </>
        )}
      </View>

      {/* Bottom-Right Button for Guild Invites */}
      {isGuildsView && (
        <>
          <TouchableOpacity
            style={styles.guildInvitesButton}
            onPress={() => setInvitesVisible(true)}
          >
            <Text style={styles.guildInvitesText}>View Guild Invites</Text>
          </TouchableOpacity>
          <Modal
            visible={invitesVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setInvitesVisible(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Guild Invites</Text>
                <ScrollView style={{ maxHeight: 300, width: '100%' }}>
                  {guildInvites.length === 0 ? (
                    <Text>No invites.</Text>
                  ) : (
                    guildInvites.map(invite => (
                      <View key={invite.id} style={styles.inviteItem}>
                        <Text style={styles.inviteText}>
                          {invite.name} (from {invite.from})
                        </Text>
                      </View>
                    ))
                  )}
                </ScrollView>
                <LargeButton title="Close" onPress={() => setInvitesVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* Create Guild Modal */}
      <Modal
        visible={createGuildVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setCreateGuildVisible(false);
          setGuildName('');
          setGuildDescription('');
          setGameTags([]); // Reset tags on cancel
          setGameTagInput('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create Guild</Text>
            <TextInput
              style={styles.input}
              placeholder="Guild Name"
              value={guildName}
              onChangeText={setGuildName}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Description"
              value={guildDescription}
              onChangeText={setGuildDescription}
              multiline
            />
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add game played"
                value={gameTagInput}
                onChangeText={setGameTagInput}
                onSubmitEditing={handleAddTag}
                blurOnSubmit={false}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {gameTags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <LargeButton title="Create" onPress={() => {
              // TODO: Implement create logic
              setCreateGuildVisible(false);
              setGuildName('');
              setGuildDescription('');
              setGameTags([]); // Reset tags on create
              setGameTagInput('');
            }} />
            <LargeButton title="Cancel" onPress={() => {
              setCreateGuildVisible(false);
              setGuildName('');
              setGuildDescription('');
              setGameTags([]); // Reset tags on cancel
              setGameTagInput('');
            }} />
          </View>
        </View>
      </Modal>

      {/* Add Friend Modal */}
      <Modal
        visible={addFriendVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setAddFriendVisible(false);
          setFriendUsername('');
          setFriendPhone('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Friend</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={friendUsername}
              onChangeText={setFriendUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={friendPhone}
              onChangeText={setFriendPhone}
              keyboardType="phone-pad"
            />
            <LargeButton
              title="Confirm"
              onPress={() => {
                // TODO: Implement add friend logic
                setAddFriendVisible(false);
                setFriendUsername('');
                setFriendPhone('');
              }}
            />
            <LargeButton
              title="Cancel"
              onPress={() => {
                setAddFriendVisible(false);
                setFriendUsername('');
                setFriendPhone('');
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Remove Friend/Guild Modal */}
      <Modal
        visible={removeModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setRemoveModalVisible(false);
          setSelectedToRemove(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isGuildsView ? 'Remove a Guild' : 'Remove a Friend'}
            </Text>
            <ScrollView style={{ maxHeight: 300, width: '100%' }}>
              {(isGuildsView ? guildsDetails : friendsDetails).map(item => {
                const isSelected =
                  (selectedToRemove?.id && selectedToRemove.id === item.id) ||
                  (selectedToRemove?.userId && selectedToRemove.userId === item.userId);
                return (
                  <TouchableOpacity
                    key={item.id || item.userId}
                    style={[
                      styles.removeItem,
                      isSelected && styles.selectedRemoveItem,
                    ]}
                    onPress={() => setSelectedToRemove(item)}
                  >
                    <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
                    <Text style={styles.name}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <LargeButton
              title="Confirm Remove"
              onPress={() => {
                // Disabled for demo: do nothing
                // handleRemoveConfirm();
              }}
              style={{ opacity: selectedToRemove ? 1 : 0.5 }}
              disabled={!selectedToRemove}
            />
            <LargeButton
              title="Cancel"
              onPress={() => {
                setRemoveModalVisible(false);
                setSelectedToRemove(null);
              }}
            />
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 60,
  },
  toggleBox: {
    flex: 1,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBox: {
    backgroundColor: '#81b0ff',
    borderColor: '#81b0ff',
  },
  toggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  activeText: {
    color: '#fff',
  },
  grid: {
    gap: 16,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  largeButton: {
    backgroundColor: '#81b0ff',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginHorizontal: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  largeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  guildInvitesButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#81b0ff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guildInvitesText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inviteItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  inviteText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  addTagButton: {
    marginLeft: 8,
    backgroundColor: '#81b0ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    width: '100%',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
    marginRight: 6,
  },
  removeTag: {
    color: '#ff3333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  selectedRemoveItem: {
    backgroundColor: '#ffcccc',
  },
});
