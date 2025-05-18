import React, { useEffect, useState } from "react";
import {
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
import { styles } from "@/app/styles/profileStyles";

import { DEFAULT_USER_ID } from "@/utils/constants";
import { updateUserProfile } from "@/utils/api"; // <-- Add updateUserProfile

import { useAppData } from "../context/AppDataContext";
const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp"; // Default avatar URL

export default function TabThreeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { profile, setProfile } = useAppData(); // Use context to get and set profile
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState("This is your profile description.");

  // State for avatar image (basic placeholder)
  function setAvatarUri(avatarUri: string) {
    setProfile((prevProfile) =>
      prevProfile? {
            ...prevProfile,
            avatarUri: avatarUri,
            isPrivate: prevProfile.isPrivate,
            description: prevProfile.description,
          }
        : {
            avatarUri: avatarUri,
            isPrivate: false,
            description: "",
          }
    );
  }

  function setDescription(description: string) {
    setProfile((prevProfile) =>
      prevProfile
        ? {
            ...prevProfile,
            avatarUri: prevProfile.avatarUri,
            isPrivate: prevProfile.isPrivate,
            description: description,
          }
        : {
            avatarUri: "",
            isPrivate: false,
            description: description,
          }
    );
  }

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

  // Toggle privacy
  const togglePrivacy = async () => {
    try {
      // Toggle the privacy value
      const newIsPrivate = !profile?.isPrivate;
      // Update backend
      await updateUserProfile(DEFAULT_USER_ID, { isPrivate: newIsPrivate });
      // Update context state
      setProfile({
        ...profile,
        isPrivate: newIsPrivate,
        avatarUri: profile?.avatarUri ?? "",
        description: profile?.description ?? "",
      });
    } catch (error) {
      console.error("Failed to update privacy:", error);
    }
  };

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
  source={{ uri: profile?.avatarUri || defaultAvatar }}
  style={styles.avatarImage}
  onError={e => {
    console.warn('Failed to load avatar image:', profile?.avatarUri, e.nativeEvent);
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
              <Text style={styles.descriptionText}>{profile?.description}</Text>
              <Button
                onPress={() => {
                  setTempDescription(profile?.description || "");
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
            {profile?.isPrivate ? "Private Profile" : "Public Profile"}
          </Text>
          <Switch
            value={profile?.isPrivate}
            onValueChange={togglePrivacy}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={profile?.isPrivate ? "#f5dd4b" : "#f4f3f4"}
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