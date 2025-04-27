import React, { useState } from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import GameLibraryScreen from './game-library'; // Import the GameLibraryScreen

export default function TabFourScreen() {
  // State for profile privacy (public/private)
  const [isPrivate, setIsPrivate] = useState(false);

  // Toggle privacy
  const togglePrivacy = () => setIsPrivate(previousState => !previousState);

  return (
    <View style={styles.container}>
      {/* Profile Privacy Toggle */}
      <View style={styles.privacyContainer}>
        <Text style={styles.privacyText}>
          {isPrivate ? 'Private Profile (switch just for demonstration purposes)' : 'Public Profile (switch just for demonstration purposes)'}
        </Text>
        <Switch
          value={isPrivate}
          onValueChange={togglePrivacy}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isPrivate ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>

      {/* Conditionally render the GameLibraryScreen or status */}
      <View style={styles.statusContainer}>
        {isPrivate ? (
          <Text style={styles.statusText}>This profile is private</Text>
        ) : (
          <GameLibraryScreen /> // Render the GameLibraryScreen when the profile is public
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  privacyText: {
    fontSize: 18,
    color: '#333',
  },
  statusContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
