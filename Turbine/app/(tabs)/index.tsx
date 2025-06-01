import { Text, View, Image, Animated, ScrollView, Dimensions } from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import { DEFAULT_USER_ID } from '@/utils/constants';
import { getUsers } from '@/utils/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { TouchableOpacity, FlatList } from 'react-native';
import { Game } from '@/types/game';
import { styles } from '@/app/styles/homeScreenStyles';
const { height: screenHeight } = Dimensions.get('window');

// Define the type for your navigation routes
type RootStackParamList = {
  'game-library': undefined;
  'friends': undefined;
  'profile': undefined;
  'play-now': { selectedFriends: any[] };
};
import { useAppData } from '@/app/context/AppDataContext'; // new import

export default function HomeScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const { games, friends, loading, error, profile, setProfile } = useAppData(); // use context

  useEffect(() => {
    const userId = DEFAULT_USER_ID;

    const fetchProfile = async () => {
      try {
        const users = await getUsers([userId]);
        const data = Array.isArray(users) ? users[0] : users;
        setProfile({
          avatarUri: data.imageUrl
            ? `https://external-content.duckduckgo.com/iu/?u=${encodeURIComponent(data.imageUrl)}&f=1&nofb=1`
            : 'https://www.gravatar.com/avatar/?d=mp',
          description: data.description || 'This is your profile description.',
          isPrivate: typeof data.isPrivate === 'boolean' ? data.isPrivate : false,
        });
      } catch (err) {
        // Handle profile error if needed
      }
    };

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
          {/* Left: Game Library - make this half as tall as the others */}
          <View style={{ height: screenHeight * 0.325 }}>
            <ScrollView>
              <GameLibrary games={games} />
            </ScrollView>
          </View>

          {/* Middle: Friends */}
          <View style={{ height: screenHeight * 0.65 }}>
            <ScrollView>
              <FriendsContainer friends={friends} />
            </ScrollView>
          </View>

          {/* Right: Profile */}
          <View style={{ height: screenHeight * 0.65 }}>
            <ScrollView>
              <ProfileContainer
                avatarUri={profile?.avatarUri || 'https://www.gravatar.com/avatar/?d=mp'}
                description={profile?.description || ''}
              />
            </ScrollView>
          </View>
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
  const [selectedFriends, setSelectedFriends] = useState<any[]>([]);

  const handleToggleFriend = (friend: any) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.userId === friend.userId)
        ? prev.filter((f) => f.userId !== friend.userId)
        : [...prev, friend]
    );
  };

  const handleContinue = () => {
    if (selectedFriends.length > 0) {
      navigation.navigate('play-now', { selectedFriends });
    }
  };

  return (
    <View style={styles.friendsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Select Friends to Play With</Text>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => {
          const isSelected = selectedFriends.some((f) => f.userId === item.userId);
          return (
            <TouchableOpacity
              onPress={() => handleToggleFriend(item)}
              style={[styles.card, isSelected && { borderColor: 'green', borderWidth: 2 }]}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={styles.list}
      />
      {selectedFriends.length > 0 && (
        <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
          <Text style={styles.continueButtonText}>Continue to Games</Text>
        </TouchableOpacity>
      )}
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