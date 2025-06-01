import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Text,
  Switch,
  TextInput,
  Image,
  ScrollView, // <-- Add this import
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import { styles } from "@/app/styles/profileStyles";
import { DEFAULT_USER_ID } from "@/utils/constants";
import { updateUserProfile, getUserProfile } from "@/utils/api";
import { useAppData } from "../context/AppDataContext";
const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp";

export default function TabThreeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const { profile, setProfile } = useAppData();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(
    "This is your profile description."
  );

  // Fetch profile on mount and when editing is closed
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await getUserProfile(DEFAULT_USER_ID);
        setProfile({
          avatarUri: user.avatarUrl ?? "",
          isPrivate: user.isPrivate ?? false,
          description: user.description ?? "",
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [isEditingDescription, setProfile]);

  function setAvatarUri(avatarUri: string) {
    setProfile((prevProfile) =>
      prevProfile
        ? {
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

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const handleSelectOption = (option: string) => {
    setSelectedOption(option);
  };

  const handleSend = () => {
    closeModal();
  };

  const togglePrivacy = async () => {
    try {
      const newIsPrivate = !profile?.isPrivate;
      await updateUserProfile(DEFAULT_USER_ID, { isPrivate: newIsPrivate });
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

  const handleSaveDescription = async () => {
    setDescription(tempDescription);
    setIsEditingDescription(false);
    try {
      await updateUserProfile(DEFAULT_USER_ID, {
        description: tempDescription,
      });
      // The useEffect will fetch the updated profile after editing closes
    } catch (error) {
      console.error("Failed to update description:", error);
    }
  };

  const handleEditAvatar = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
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
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Avatar Image Section */}
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: profile?.avatarUri || defaultAvatar }}
          style={styles.avatarImage}
          onError={(e) => {
            console.warn(
              "Failed to load avatar image:",
              profile?.avatarUri,
              e.nativeEvent
            );
            setAvatarUri(defaultAvatar);
          }}
        />
        <Text style={styles.avatarLabel}>Avatar Image</Text>
        <TouchableOpacity
          style={styles.editAvatarButton}
          onPress={handleEditAvatar}
        >
          <Text style={styles.editAvatarButtonText}>Edit Avatar</Text>
        </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveDescription}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsEditingDescription(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.descriptionText}>{profile?.description}</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setTempDescription(profile?.description || "");
                setIsEditingDescription(true);
              }}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
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
          trackColor={{ false: "#b6e5c6", true: "#0a7e3a" }} // green for true, light green for false
          thumbColor={profile?.isPrivate ? "#0a7e3a" : "#ffffff"} // green for true, white for false
        />
      </View>

      {/* Modal Trigger Button */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.button} onPress={openModal}>
          <Text style={styles.buttonText}>
            Share your game library with a friend
          </Text>
        </TouchableOpacity>
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
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>

            {/* Close Button */}
            <TouchableOpacity style={styles.button} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}