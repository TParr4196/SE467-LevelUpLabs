import { StyleSheet, Text, View, Image, Animated } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { fetchUserGames } from '@/scripts/userScripts';
import { DEFAULT_USER_ID } from '@/utils/constants';
import { getUserFriends, getUsers } from '@/utils/api';

import { useNavigation, NavigationProp } from '@react-navigation/native';
import { TouchableOpacity, FlatList } from 'react-native';
import { Game } from '@/types/game';

// Define the type for your navigation routes
type RootStackParamList = {
  'game-library': undefined;
  'friends': undefined;
  'profile': undefined;
};

export default function HomeScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const [games, setGames] = React.useState<Game[]>([]);
  type Friend = {
    userId: string;
    name: string;
    imageUrl: string;
  };
  
  const [friendsDetails, setFriendsDetails] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Profile state for the right-side profile panel
  const [profile, setProfile] = useState<{ avatarUri: string; description: string }>({
    avatarUri: 'https://www.gravatar.com/avatar/?d=mp',
    description: 'This is your profile description.',
  });

  useEffect(() => {
    const userId = DEFAULT_USER_ID; // Replace with actual user ID if needed
    fetchUserGames(userId).then((fetchedGames) => {
      console.log('Fetched games:', fetchedGames);
      setGames(fetchedGames);
    });

    const fetchFriends = async () => {
      try {
        // Fetch user details for the friend IDs
        const users = await getUserFriends(userId);
        setFriendsDetails(users);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Failed to load friends. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchProfile = async () => {
      try {
        const users = await getUsers([userId]);
        const data = Array.isArray(users) ? users[0] : users;
        setProfile({
          avatarUri: data.imageUrl
            ? `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(data.imageUrl)}&f=1&nofb=1`
            : 'https://www.gravatar.com/avatar/?d=mp',
          description: data.description || 'This is your profile description.',
        });
      } catch (err) {
        // Optionally handle error
      }
    };

    fetchFriends();
    fetchProfile();
  }, []);

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
    <View style={[styles.container, { backgroundColor: 'darkgreen' }]}>
      <View style={styles.contentWrapper}>
      <Banner bounceAnim={bounceAnim} />
      <View style={styles.mainContent}>
        <GameLibrary games={games} />
        <FriendsContainer friends={friendsDetails} />
        <ProfileContainer avatarUri={profile.avatarUri} description={profile.description} />
      </View>
      </View>
    </View>
  );
}

type BannerProps = {
  games: Game[];
  bounceAnim: Animated.Value;
};

function Banner({ bounceAnim }: Omit<BannerProps, 'games'>) {
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  return (
    <Animated.View
      style={{
        transform: [
          {
            translateX: bounceAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-10, 10],
            }),
          },
        ],
      }}
    >
      <Image
        source={require('@/assets/images/logo.png')}
        style={styles.bannerImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

type GameLibraryProps = {
  games: Game[];
};

function GameLibrary({ games }: GameLibraryProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigate = () => {
    navigation.navigate('game-library'); // Ensure 'game-library' matches the route name in your navigation setup
  };

  return (
    <View style={styles.libraryContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Your Current Library</Text>
      </View>
      <TouchableOpacity onPress={handleNavigate} style={styles.scrollableContainer}>
        <View style={styles.gameList}>
          {games.map((game, index) => (
            <View key={index} style={styles.gameItemOneThird}>
              <Image
                source={{ uri: game.imageUrl }}
                style={styles.gameImage}
                resizeMode="contain"
              />
              <Text>{game.name}</Text>
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </View>
  );
}

type FriendsContainerProps = {
  friends: any[];
};

function FriendsContainer({ friends }: FriendsContainerProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigateToFriendDetails = () => {
    navigation.navigate('friends'); // Ensure 'friend-details' matches the route name in your navigation setup
  };

  return (
    <View style={styles.friendsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Your Friends</Text>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={handleNavigateToFriendDetails} style={styles.card}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

type ProfileContainerProps = {
  avatarUri: string;
  description: string;
};

function ProfileContainer({ avatarUri, description }: ProfileContainerProps) {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const handleNavigateToProfile = () => {
    navigation.navigate('profile'); // Ensure 'profile' matches the route name in your navigation setup
  };

  return (
    <View style={styles.profileContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Your Profile</Text>
      </View>
      <TouchableOpacity onPress={handleNavigateToProfile} style={styles.profileContent}>
        <Image
          source={{ uri: avatarUri }}
          style={styles.profileAvatar}
        />
        <Text style={styles.profileDescription}>{description}</Text>
        <Text style={styles.profileText}>View and Edit Your Profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  list: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  gameList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  scrollableContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  gameItemOneThird: {
    width: '30%', // Adjusted for better spacing
    marginBottom: 15,
    alignItems: 'center',
  },
  gameImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentWrapper: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  sectionHeader: {
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  libraryContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  friendsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  profileDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});