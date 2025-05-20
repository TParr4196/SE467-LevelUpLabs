import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Modal, ScrollView, TextInput, Button } from 'react-native';

import { getGuildDetails } from '@/utils/api';
import GameLibraryScreen from './game-library';
import { DEFAULT_USER_ID, DEFAULT_FRIEND_IDS } from '@/utils/constants';
import { getUserFriends, getUsers } from '@/utils/api';
import { useAppData } from '../context/AppDataContext';
import { styles as importedStyles } from '@/app/styles/friendsStyle';

const styles = StyleSheet.create({
  ...importedStyles,
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
    minWidth: 140,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
  },
});

function getFakeGuilds() {
  return [
    {
      id: 1,
      name: 'Guild Alpha',
      imageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      name: 'Guild Beta',
      imageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
    {
      id: 3,
      name: 'Guild Gamma',
      imageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
    },
    {
      id: 4,
      name: 'Guild Delta',
      imageUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
    },
    {
      id: 5,
      name: 'Guild Epsilon',
      imageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
    },
    {
      id: 6,
      name: 'Guild Zeta',
      imageUrl: 'https://randomuser.me/api/portraits/women/6.jpg',
    },
    {
      id: 7,
      name: 'Guild Theta',
      imageUrl: 'https://randomuser.me/api/portraits/men/7.jpg',
    },
    {
      id: 8,
      name: 'Guild Lambda',
      imageUrl: 'https://randomuser.me/api/portraits/women/8.jpg',
    },
  ];
}

export default function GuildsFriendsScreen() {
  const [isGuildsView, setIsGuildsView] = useState(false);
  const [guildsDetails, setGuildsDetails] = useState<any[]>([]);
  const [friendsDetails, setFriendsDetails] = useState<any[]>([]);
  const { loading, error, setLoading, setError } = useAppData();

  const [invitesVisible, setInvitesVisible] = useState(false);
  const [createGuildVisible, setCreateGuildVisible] = useState(false);

  const [guildName, setGuildName] = useState('');
  const [guildDescription, setGuildDescription] = useState('');
  const [gameTagInput, setGameTagInput] = useState('');
  const [gameTags, setGameTags] = useState<string[]>([]);

  const [guildInvites] = useState([
    { id: 1, name: 'Guild Alpha', from: 'User123' },
    { id: 2, name: 'Guild Beta', from: 'User456' },
    { id: 3, name: 'Guild Gamma', from: 'User789' },
  ]);

  const [addFriendVisible, setAddFriendVisible] = useState(false);
  const [friendUsername, setFriendUsername] = useState('');
  const [friendPhone, setFriendPhone] = useState('');

  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (isGuildsView) {
          // const guilds = await getGuildDetails();
          // setGuildsDetails(guilds);
          const guilds = getFakeGuilds();
          setGuildsDetails(guilds);
        } else {
          const friends = await getUsers(DEFAULT_FRIEND_IDS);
          setFriendsDetails(friends);
        }
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
  };

  const renderCard = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleCardPress(item)} style={styles.cardContainer}>
      <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleAddTag = () => {
    if (gameTagInput.trim() && !gameTags.includes(gameTagInput.trim())) {
      setGameTags([...gameTags, gameTagInput.trim()]);
      setGameTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setGameTags(gameTags.filter(t => t !== tag));
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
      <View style={[styles.buttonRow, styles.bottomButtonContainer]}>
        {isGuildsView ? (
          <>
            <View style={styles.buttonWrapper}>
              <Button title="Create Guild" onPress={() => setCreateGuildVisible(true)} color="#0a7ea4" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Leave Guild" onPress={() => setRemoveModalVisible(true)} color="#0a7ea4" />
            </View>
          </>
        ) : (
          <>
            <View style={styles.buttonWrapper}>
              <Button title="Add Friend" onPress={() => setAddFriendVisible(true)} color="#0a7ea4" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Remove Friend" onPress={() => setRemoveModalVisible(true)} color="#0a7ea4" />
            </View>
          </>
        )}
      </View>

      {/* Create Guild Modal */}
      <Modal
        visible={createGuildVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setCreateGuildVisible(false);
          setGuildName('');
          setGuildDescription('');
          setGameTags([]);
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
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button title="Create" onPress={() => {
                  setCreateGuildVisible(false);
                  setGuildName('');
                  setGuildDescription('');
                  setGameTags([]);
                  setGameTagInput('');
                }} color="#0a7ea4" />
              </View>
              <View style={styles.buttonWrapper}>
                <Button title="Cancel" onPress={() => {
                  setCreateGuildVisible(false);
                  setGuildName('');
                  setGuildDescription('');
                  setGameTags([]);
                  setGameTagInput('');
                }} color="#0a7ea4" />
              </View>
            </View>
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
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Confirm"
                  onPress={() => {
                    setAddFriendVisible(false);
                    setFriendUsername('');
                    setFriendPhone('');
                  }}
                  color="#0a7ea4"
                />
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setAddFriendVisible(false);
                    setFriendUsername('');
                    setFriendPhone('');
                  }}
                  color="#0a7ea4"
                />
              </View>
            </View>
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
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Confirm Remove"
                  onPress={() => {
                    // Disabled for demo: do nothing
                  }}
                  color="#0a7ea4"
                  disabled={!selectedToRemove}
                />
              </View>
              <View style={styles.buttonWrapper}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setRemoveModalVisible(false);
                    setSelectedToRemove(null);
                  }}
                  color="#0a7ea4"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Guild Invites Modal */}
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
            <View style={styles.buttonRow}>
              <View style={styles.buttonWrapper}>
                <Button title="Close" onPress={() => setInvitesVisible(false)} color="#0a7ea4" />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomBar}>
        <View style={styles.buttonGroup}>
          {isGuildsView ? (
            <>
              <Button title="Create Guild" onPress={() => setCreateGuildVisible(true)} color="#0a7ea4" />
              <Button title="Leave Guild" onPress={() => setRemoveModalVisible(true)} color="#0a7ea4" />
            </>
          ) : (
            <>
              <Button title="Add Friend" onPress={() => setAddFriendVisible(true)} color="#0a7ea4" />
              <Button title="Remove Friend" onPress={() => setRemoveModalVisible(true)} color="#0a7ea4" />
            </>
          )}
        </View>
        {isGuildsView && (
          <View style={styles.guildInvitesButtonBar}>
            <Button
              title="View Guild Invites"
              onPress={() => setInvitesVisible(true)}
              color="#0a7ea4"
            />
          </View>
        )}
      </View>
    </View>
  );
}

