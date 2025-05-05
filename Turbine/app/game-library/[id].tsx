// app/(tabs)/game-library/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getGames } from '@/utils/api';

export default function GameDetailScreen() {
    const { id } = useLocalSearchParams(); // Get the game ID from the route
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameDetails = async () => {
            try {
                // Fetch game details using the getGames function
                const gameDetails = await getGames([id as string]);
                setGame(gameDetails[0]); // Assuming the API returns an array
            } catch (err) {
                setError('Failed to load game details. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
            </View>
        );
    }

    if (!game) {
        return (
            <View style={styles.container}>
                <Text style={{ fontSize: 16 }}>Game not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image source={{ uri: game.imageUrl }} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{game.name}</Text>
            <Text style={styles.subtitle}>Rating: {game.rating}</Text>
            <Text style={styles.subtitle}>Genres: {game.genres.join(', ')}</Text>
            <Text style={styles.subtitle}>Average Playtime: {game.averagePlaytime} hours</Text>
            <Text style={styles.subtitle}>Recommended Players: {game.recommendedPlayers}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    image: { width: '90%', height: 300, marginBottom: 16 }, // Adjusted to fit the screen
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    subtitle: { fontSize: 18, marginBottom: 8 },
});
