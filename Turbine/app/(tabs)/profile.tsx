import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text, Switch } from 'react-native';
import { Button } from 'react-native-paper';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabThreeScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // State for profile privacy (public/private)
  const [isPrivate, setIsPrivate] = useState(false);

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
  const togglePrivacy = () => setIsPrivate(previousState => !previousState);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
      </ThemedView>

      {/* Profile Privacy Toggle */}
      <View style={styles.privacyContainer}>
        <Text style={styles.privacyText}>
          {isPrivate ? 'Private Profile' : 'Public Profile'}
        </Text>
        <Switch
          value={isPrivate}
          onValueChange={togglePrivacy}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
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
        transparent={true} // Make the background dimmed
        animationType="fade"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Friend:</Text>
            
            {/* Option 1 */}
            <TouchableOpacity onPress={() => handleSelectOption('George')}>
              <Text
                style={[
                  styles.modalOption,
                  selectedOption === 'George' && styles.selectedOption,
                ]}>
                George
              </Text>
            </TouchableOpacity>
            
            {/* Option 2 */}
            <TouchableOpacity onPress={() => handleSelectOption('EpicFakeUsername')}>
              <Text
                style={[
                  styles.modalOption,
                  selectedOption === 'EpicFakeUsername' && styles.selectedOption,
                ]}>
                EpicFakeUsername
              </Text>
            </TouchableOpacity>
            
            {/* Option 3 */}
            <TouchableOpacity onPress={() => handleSelectOption('WalshKev')}>
              <Text
                style={[
                  styles.modalOption,
                  selectedOption === 'WalshKev' && styles.selectedOption,
                ]}>
                WalshKev
              </Text>
            </TouchableOpacity>
            
            {/* Option 4 */}
            <TouchableOpacity onPress={() => handleSelectOption('Help')}>
              <Text
                style={[
                  styles.modalOption,
                  selectedOption === 'Help' && styles.selectedOption,
                ]}>
                Help
              </Text>
            </TouchableOpacity>

            {/* Option 5 */}
            <TouchableOpacity onPress={() => handleSelectOption('Phelp')}>
              <Text
                style={[
                  styles.modalOption,
                  selectedOption === 'Phelp' && styles.selectedOption,
                ]}>
                Phelp
              </Text>
            </TouchableOpacity>

            {/* Send Button */}
            <Button mode="contained" onPress={handleSend} style={styles.sendButton}>
              Send
            </Button>

            {/* Close Button */}
            <Button onPress={closeModal}>Close</Button>
          </View>
        </View>
      </Modal>

      {/* <ThemedText>
        Selected Option: {selectedOption ?? 'None'}
      </ThemedText> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  privacyText: {
    fontSize: 18,
    color: '#333',
  },
  menuContainer: {
    marginVertical: 20,
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 16,
    marginVertical: 10,
    color: '#007BFF',
  },
  selectedOption: {
    color: '#FF6347', // Highlight color when selected
    fontWeight: 'bold',
  },
  sendButton: {
    marginTop: 20,
  },
});
