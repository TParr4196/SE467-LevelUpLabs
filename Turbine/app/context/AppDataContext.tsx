// contexts/AppDataContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchUserGames } from '@/scripts/userScripts';
import { getUserFriends } from '@/utils/api';
import { DEFAULT_USER_ID } from '@/utils/constants';
import { Game } from '@/types/game';
import { Friend } from '@/types/friend';

type AppDataContextType = {
  games: Game[];
  friends: Friend[];
  loading: boolean;
  error: string | null;
};

const AppDataContext = createContext<AppDataContextType>({
  games: [],
  friends: [],
  loading: true,
  error: null,
});

export const AppDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userId = DEFAULT_USER_ID;

    const loadGamesAndFriends = async () => {
      try {
        const [fetchedGames, fetchedFriends] = await Promise.all([
          fetchUserGames(userId),
          getUserFriends(userId),
        ]);

        setGames(fetchedGames);
        setFriends(fetchedFriends);
      } catch (err) {
        console.error('Error loading games or friends:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGamesAndFriends();
  }, []);

  return (
    <AppDataContext.Provider value={{ games, friends, loading, error }}>
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => useContext(AppDataContext);
