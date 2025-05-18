import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  Switch,
  TextInput,
  Image,
} from "react-native";
import { Button } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";


import { DEFAULT_USER_ID } from "@/utils/constants"; // HARD CODED FRIENDS
import { getUserProfile, getUsers, updateUserProfile } from "@/utils/api"; // <-- Add updateUserProfile

const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp"; // Default avatar URL
const defaultDescription = "This is your profile description."; // Default description

export default function TabThreeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State for profile privacy (public/private)
  const [isPrivate, setIsPrivate] = useState(false);

  // State for profile description
  const [description, setDescription] = useState(
    "This is your profile description."
  );
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(description);

  // State for avatar image (basic placeholder)
  const [avatarUri, setAvatarUri] = useState(
    "https://www.gravatar.com/avatar/?d=mp"
  );

  // Open and close modal
  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  // Handle option selection
  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  // Handle Send Button (close the modal)
  const handleSend = () => {
    closeModal();
  };

  React.useEffect(() => {
    fetchUserInfo(DEFAULT_USER_ID);
  }, []);

  async function fetchUserInfo(userId: string) {
    try {
      const response = await getUsers([userId]);
      // The backend returns an array of users
      const data = Array.isArray(response) ? response[0] : response;

      console.log("User Info:", data);

      setAvatarUri(data.imageUrl );
      setDescription(data.description || defaultDescription);
      setIsPrivate(data.isPrivate || false);
      // Log the value directly from data to verify what is being set
      
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  // Toggle privacy
  const togglePrivacy = () => setIsPrivate((previousState) => !previousState);

  // Save description and update backend


  // this section is broken it is not setting the description in the database properly
  // it is setting the description in the state but not in the database
  const handleSaveDescription = async () => {
    setDescription(tempDescription);
    setIsEditingDescription(false);
    try {
      const result = await updateUserProfile(DEFAULT_USER_ID, {
        description: tempDescription,
      });
      console.log("Update result:", result);
      // Optionally, alert or display result to user
      // Optionally, refetch user info here if you want to refresh the UI
      // await fetchUserInfo(DEFAULT_USER_ID);
    } catch (error) {
      console.error("Failed to update description:", error);
      // Optionally, show an error message to the user
    }
  };

  // Handle Edit Avatar
  const handleEditAvatar = async () => {
    // Ask for permission
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    // Pick image
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      setAvatarUri(pickerResult.assets[0].uri);
    }
  };

  return (
    <>
      <View style={{ alignItems: "center", marginTop: 16 }}>
        <Button
          mode="contained"
          onPress={() => fetchUserInfo(DEFAULT_USER_ID)}
          style={{ marginBottom: 12 }}
        >
          Fetch User Info
        </Button>
      </View>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
        headerImage={
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Profile</ThemedText>
        </ThemedView>

        {/* Avatar Image Section */}
        <View style={styles.avatarContainer}>
         <Image
  source={{ uri: avatarUri || "loading..." }}
  style={styles.avatarImage}
  onError={e => {
    console.warn('Failed to load avatar image:', avatarUri, e.nativeEvent);
    setAvatarUri(defaultAvatar);
  }}
/>
          <Text style={styles.avatarLabel}>Avatar Image</Text>
          <Button
            mode="outlined"
            style={styles.editAvatarButton}
            onPress={handleEditAvatar}
          >
            Edit Avatar
          </Button>
        </View>

        {/* Profile Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Description</Text>
          {isEditingDescription ? (
            <>
              <TextInput
                style={styles.descriptionInput}
                value={tempDescription}
                onChangeText={setTempDescription}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
              <Button
                mode="contained"
                onPress={handleSaveDescription}
                style={styles.saveButton}
              >
                Save
              </Button>
              <Button onPress={() => setIsEditingDescription(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.descriptionText}>{description}</Text>
              <Button
                onPress={() => {
                  setTempDescription(description);
                  setIsEditingDescription(true);
                }}
              >
                Edit
              </Button>
            </>
          )}
        </View>

        {/* Profile Privacy Toggle */}
        <View style={styles.privacyContainer}>
          <Text style={styles.privacyText}>
            {isPrivate ? "Private Profile" : "Public Profile"}
          </Text>
          <Switch
            value={isPrivate}
            onValueChange={togglePrivacy}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isPrivate ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>

        {/* Modal Trigger Button */}
        <View style={styles.menuContainer}>
          <Button mode="contained" onPress={openModal}>
            Share your game library with a friend
          </Button>
        </View>

        {/* Modal */}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select a Friend:</Text>

              {/* Option 1 */}
              <TouchableOpacity onPress={() => handleSelectOption("George")}>
                <Text
                  style={[
                    styles.modalOption,
                    selectedOption === "George" && styles.selectedOption,
                  ]}
                >
                  George
                </Text>
              </TouchableOpacity>

              {/* Option 2 */}
              <TouchableOpacity
                onPress={() => handleSelectOption("EpicFakeUsername")}
              >
                <Text
                  style={[
                    styles.modalOption,
                    selectedOption === "EpicFakeUsername" &&
                      styles.selectedOption,
                  ]}
                >
                  EpicFakeUsername
                </Text>
              </TouchableOpacity>

              {/* Option 3 */}
              <TouchableOpacity onPress={() => handleSelectOption("WalshKev")}>
                <Text
                  style={[
                    styles.modalOption,
                    selectedOption === "WalshKev" && styles.selectedOption,
                  ]}
                >
                  WalshKev
                </Text>
              </TouchableOpacity>

              {/* Option 4 */}
              <TouchableOpacity onPress={() => handleSelectOption("Help")}>
                <Text
                  style={[
                    styles.modalOption,
                    selectedOption === "Help" && styles.selectedOption,
                  ]}
                >
                  Help
                </Text>
              </TouchableOpacity>

              {/* Option 5 */}
              <TouchableOpacity onPress={() => handleSelectOption("Phelp")}>
                <Text
                  style={[
                    styles.modalOption,
                    selectedOption === "Phelp" && styles.selectedOption,
                  ]}
                >
                  Phelp
                </Text>
              </TouchableOpacity>

              {/* Send Button */}
              <Button
                mode="contained"
                onPress={handleSend}
                style={styles.sendButton}
              >
                Send
              </Button>

              {/* Close Button */}
              <Button onPress={closeModal}>Close</Button>
            </View>
          </View>
        </Modal>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  logoImage: {
    width: "100%",
    height: 220,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    backgroundColor: "#eee",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  avatarLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  editAvatarButton: {
    marginTop: 4,
    marginBottom: 8,
    alignSelf: "center",
  },
  descriptionContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
  },
  descriptionInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 8,
    minHeight: 60,
    textAlignVertical: "top",
  },
  saveButton: {
    marginBottom: 8,
  },
  privacyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  privacyText: {
    fontSize: 18,
    color: "#333",
  },
  menuContainer: {
    marginVertical: 20,
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 16,
    marginVertical: 10,
    color: "#007BFF",
  },
  selectedOption: {
    color: "#FF6347", // Highlight color when selected
    fontWeight: "bold",
  },
  sendButton: {
    marginTop: 20,
  },
});
