import { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { getUsers, getGames } from '@/utils/api';
import React from 'react';

type User = {
    userId: string;
    name: string;
    gamesOwned: string[];
}

type Game = {
    gameId: string;
    name: string;
    genres: string[];
    rating: number;
    imageUrl: string;
    averagePlaytime: number;
    recommendedPlayers: number;
}

export default function UserScreen() {
    const [users, setUsers] = useState([]);
    const [games, setGames] = useState([]);
  
    useEffect(() => {
      getUsers([
        "e6c90de2-983f-4e61-9485-4024fc3d8f87",
        "a07aef8e-8bd5-4b91-bfcd-36570e2b15f9"
      ])
        .then(setUsers)
        .catch(err => console.error(err));
    }, []);

    useEffect(() => {
      getGames([
        "85f347d0-6e1e-4c26-a15d-184f44b8c3af",
        "f0a7e5a1-239f-4a2e-9b68-0c6e5eb63a37"
      ])
        .then(setGames)
        .catch(err => console.error(err));
    }, []);

    if (users.length === 0) return <Text>Loading...</Text>;
    return (
      <View>
        {users.map((user: User) => (
          <View key={user.userId} style={{ marginBottom: 20 }}>
            <Text style={styles.yellowText}>User ID: {user.userId}</Text>
            <Text style={styles.yellowText}>Name: {user.name}</Text>
            <Text style={styles.yellowText}>Games Owned: {user.gamesOwned.join(', ')}</Text>
          </View>
        ))},
        {games.map((game: Game) => (
          <View key={game.gameId} style={{ marginBottom: 20 }}>
            <Text style={styles.yellowText}>Game ID: {game.gameId}</Text>
            <Text style={styles.yellowText}>Name: {game.name}</Text>
            <Text style={styles.yellowText}>Genres: {game.genres.join(', ')}</Text>
            <Text style={styles.yellowText}>Rating: {game.rating}</Text>
            <Text style={styles.yellowText}>Image URL: {game.imageUrl}</Text>
            <Text style={styles.yellowText}>Average Playtime: {game.averagePlaytime}</Text>
            <Text style={styles.yellowText}>Recommended Players: {game.recommendedPlayers}</Text>
          </View>
        ))}
      </View>
    );
  }

const styles = StyleSheet.create({
    yellowText: {
        color: 'yellow', // Set text color to blue
    },
    });