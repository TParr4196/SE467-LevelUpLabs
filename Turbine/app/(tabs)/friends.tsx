import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";

import { getGuildDetails, getUsers } from "@/utils/api";
import { useAppData } from "../context/AppDataContext";
import { styles as importedStyles } from "@/app/styles/friendsStyle";

const styles = StyleSheet.create({
  ...importedStyles,
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
    minWidth: 140,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 8,
    width: "100%",
  },
  bottomButtonContainer: {
    marginBottom: 16,
  },
  spacedButton: {
    marginHorizontal: 24, // More spacing between buttons
  },
});

export default function GuildsFriendsScreen() {
  const [isGuildsView, setIsGuildsView] = useState(false);
  const { loading, error, friends, guilds, setError } = useAppData();

  const [invitesVisible, setInvitesVisible] = useState(false);
  const [createGuildVisible, setCreateGuildVisible] = useState(false);

  const [guildName, setGuildName] = useState("");
  const [guildDescription, setGuildDescription] = useState("");
  const [gameTagInput, setGameTagInput] = useState("");
  const [gameTags, setGameTags] = useState<string[]>([]);

  const [guildInvites] = useState([
    { id: 1, name: "Guild Alpha", from: "User123" },
    { id: 2, name: "Guild Beta", from: "User456" },
    { id: 3, name: "Guild Gamma", from: "User789" },
  ]);

  const [addFriendVisible, setAddFriendVisible] = useState(false);
  const [friendUsername, setFriendUsername] = useState("");
  const [friendPhone, setFriendPhone] = useState("");

  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState<any>(null);

  const [selectedGuild, setSelectedGuild] = useState<any>(null);
  const [guildDetailsModalVisible, setGuildDetailsModalVisible] =
    useState(false);

  const [guildMemberDetails, setGuildMemberDetails] = useState<any[]>([]);

  const handleCardPress = (item: any) => {
    console.log("Card pressed:", item);
  };

  const handleGuildCardPress = async (guild: any) => {
    try {
      const details = await getGuildDetails(guild.guildId || guild.id);
      setSelectedGuild(details);

      // Fetch member details if members is an array of IDs
      if (details.members && details.members.length > 0) {
        const users = await getUsers(details.members); // getUsers expects an array of IDs
        setGuildMemberDetails(users);
      } else {
        setGuildMemberDetails([]);
      }

      setGuildDetailsModalVisible(true);
    } catch (err) {
      setError("Failed to load guild details.");
    }
  };

  const renderCard = ({ item }: { item: any }) => {
    if (isGuildsView) {
      return (
        <TouchableOpacity
          onPress={() => handleGuildCardPress(item)}
          style={styles.guildCardContainer}
        >
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.guildProfileImage}
          />
          <Text style={styles.guildName}>{item.name}</Text>
        </TouchableOpacity>
      );
    }
    // Friends view
    return (
      <TouchableOpacity
        onPress={() => handleCardPress(item)}
        style={styles.cardContainer}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.profileImage} />
        <Text style={styles.name}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const handleAddTag = () => {
    if (gameTagInput.trim() && !gameTags.includes(gameTagInput.trim())) {
      setGameTags([...gameTags, gameTagInput.trim()]);
      setGameTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setGameTags(gameTags.filter((t) => t !== tag));
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
        <Text style={{ color: "red" }}>{error}</Text>
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
          <Text style={[styles.toggleText, isGuildsView && styles.activeText]}>
            Guilds
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBox, !isGuildsView && styles.activeBox]}
          onPress={() => setIsGuildsView(false)}
        >
          <Text style={[styles.toggleText, !isGuildsView && styles.activeText]}>
            Friends
          </Text>
        </TouchableOpacity>
      </View>

      {/* List of Guilds or Friends */}
      <FlatList
        data={isGuildsView ? guilds : friends}
        key={isGuildsView ? "guilds" : "friends"}
        keyExtractor={(item) => item.guildId || item.id || item.userId}
        renderItem={renderCard}
        contentContainerStyle={styles.grid}
        numColumns={isGuildsView ? 4 : 3}
      />

      {/* Create Guild Modal */}
      <Modal
        visible={createGuildVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setCreateGuildVisible(false);
          setGuildName("");
          setGuildDescription("");
          setGameTags([]);
          setGameTagInput("");
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
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={handleAddTag}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Add</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.tagsContainer}>
              {gameTags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => {
                  setCreateGuildVisible(false);
                  setGuildName("");
                  setGuildDescription("");
                  setGameTags([]);
                  setGameTagInput("");
                }}
              >
                <Text style={styles.bottomButtonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => {
                  setCreateGuildVisible(false);
                  setGuildName("");
                  setGuildDescription("");
                  setGameTags([]);
                  setGameTagInput("");
                }}
              >
                <Text style={styles.bottomButtonText}>Cancel</Text>
              </TouchableOpacity>
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
          setFriendUsername("");
          setFriendPhone("");
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
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => {
                  setAddFriendVisible(false);
                  setFriendUsername("");
                  setFriendPhone("");
                }}
              >
                <Text style={styles.bottomButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => {
                  setAddFriendVisible(false);
                  setFriendUsername("");
                  setFriendPhone("");
                }}
              >
                <Text style={styles.bottomButtonText}>Cancel</Text>
              </TouchableOpacity>
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
              {isGuildsView ? "Remove a Guild" : "Remove a Friend"}
            </Text>
            <ScrollView style={{ maxHeight: 300, width: "100%" }}>
              {(isGuildsView ? guilds : friends).map((item) => {
                const isSelected =
                  (selectedToRemove?.id && selectedToRemove.id === item.id) ||
                  (selectedToRemove?.userId &&
                    selectedToRemove.userId === item.userId);
                return (
                  <TouchableOpacity
                    key={item.id || item.userId}
                    style={[
                      styles.removeItem,
                      isSelected && styles.selectedRemoveItem,
                    ]}
                    onPress={() => setSelectedToRemove(item)}
                  >
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.profileImage}
                    />
                    <Text style={styles.name}>{item.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.bottomButton,
                  styles.spacedButton,
                  !selectedToRemove && { opacity: 0.5 },
                ]}
                onPress={() => {
                  // Disabled for demo: do nothing
                }}
                disabled={!selectedToRemove}
              >
                <Text style={styles.bottomButtonText}>Confirm </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => {
                  setRemoveModalVisible(false);
                  setSelectedToRemove(null);
                }}
              >
                <Text style={styles.bottomButtonText}>Cancel</Text>
              </TouchableOpacity>
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
            <ScrollView style={{ maxHeight: 300, width: "100%" }}>
              {guildInvites.length === 0 ? (
                <Text>No invites.</Text>
              ) : (
                guildInvites.map((invite) => (
                  <View key={invite.id} style={styles.inviteItem}>
                    <Text style={styles.inviteText}>
                      {invite.name} (from {invite.from})
                    </Text>
                  </View>
                ))
              )}
            </ScrollView>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => setInvitesVisible(false)}
              >
                <Text style={styles.bottomButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Guild Details Modal */}
      <Modal
        visible={guildDetailsModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setGuildDetailsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedGuild && (
              <>
                <Text style={styles.modalTitle}>{selectedGuild.name}</Text>
                <Text style={styles.modalDescription}>
                  {selectedGuild.description}
                </Text>
                {selectedGuild.imageUrl && (
                  <Image
                    source={{ uri: selectedGuild.imageUrl }}
                    style={styles.guildProfileImage}
                  />
                )}
                <Text style={styles.modalLabel}>Members:</Text>
                <FlatList
                  data={guildMemberDetails}
                  keyExtractor={(member) => member.userId}
                  renderItem={({ item }) => (
                    <View style={styles.memberItem}>
                      <Image
                        source={{ uri: item.imageUrl }}
                        style={styles.memberImage}
                      />
                      <Text style={styles.memberName}>{item.name}</Text>
                    </View>
                  )}
                  contentContainerStyle={styles.membersList}
                />
              </>
            )}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => setGuildDetailsModalVisible(false)}
              >
                <Text style={styles.bottomButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomBar}>
        <View style={styles.buttonGroup}>
          {isGuildsView ? (
            <>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => setCreateGuildVisible(true)}
              >
                <Text style={styles.bottomButtonText}>Create Guild</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => setRemoveModalVisible(true)}
              >
                <Text style={styles.bottomButtonText}>Leave Guild</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => setAddFriendVisible(true)}
              >
                <Text style={styles.bottomButtonText}>Add Friend</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bottomButton, styles.spacedButton]}
                onPress={() => setRemoveModalVisible(true)}
              >
                <Text style={styles.bottomButtonText}>Remove Friend</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
        {isGuildsView && (
          <View style={styles.guildInvitesButtonBar}>
            <TouchableOpacity
              style={styles.bottomButton}
              onPress={() => setInvitesVisible(true)}
            >
              <Text style={styles.bottomButtonText}>View Guild Invites</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}