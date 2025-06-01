// contexts/AppDataContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserGames } from '@/scripts/userScripts';
import { getUserFriends } from '@/utils/api';
import { DEFAULT_USER_ID } from '@/utils/constants';
import { Game } from '@/types/game';
import { Friend } from '@/types/friend';
import { Profile } from '@/types/profile';
import { getUsers } from '@/utils/api';
import { getAllGuilds } from '@/utils/api'; // Adjust import based on your project structure
const defaultAvatar = "https://www.gravatar.com/avatar/?d=mp"; // Default avatar URL

type AppDataContextType = {
  games: Game[];
  friends: Friend[];
  guilds: any[];
  loading: boolean;
  error: string | null;
  profile: Profile | null;
  setGames: React.Dispatch<React.SetStateAction<Game[]>>;
  setGuilds: React.Dispatch<React.SetStateAction<any[]>>;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
};

const AppDataContext = createContext<AppDataContextType>({
  games: [],
  friends: [],
  guilds: [],
  loading: true,
  error: null,
  profile: null,
  setProfile: () => { },
  setGames: () => { },
  setGuilds: () => { },
  setLoading: () => { },
  setError: () => { },
});

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [guilds, setGuilds] = useState<any[]>([]); // Adjust type as needed
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const userId = DEFAULT_USER_ID;

    const loadAllData = async () => {
      try {
        const [fetchedGames, fetchedFriends, fetchedGuilds] = await Promise.all([
          fetchUserGames(userId),
          getUserFriends(userId),
          getAllGuilds(),
        ]);

        setGames(fetchedGames);
        setFriends(fetchedFriends);
        setGuilds(fetchedGuilds);
      } catch (err) {
        console.error('Error loading games or friends:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    async function fetchUserInfo(userId: string) {
      try {
        const response = await getUsers([userId]);
        // The backend returns an array of users
        const data = Array.isArray(response) ? response[0] : response;

        const newProfile: Profile = {
          // Assuming the backend returns a profile object
          avatarUri: data.imageUrl || defaultAvatar,
          description: data.derscription || '',
          isPrivate: data.isPrivate || false,
        }
        setProfile(newProfile);
        // Log the value directly from data to verify what is being set

      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }
    loadAllData();
    fetchUserInfo(DEFAULT_USER_ID)
  }, []);

  return (
    <AppDataContext.Provider value={{ games, friends, guilds, loading, error, profile, setProfile, setGames, setGuilds, setError, setLoading }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
