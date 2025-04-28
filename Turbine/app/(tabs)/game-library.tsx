// app/(tabs)/game-library.tsx
import { View, FlatList, Dimensions, ActivityIndicator, Text } from 'react-native';
import { Card } from '@/components/GameCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { getGames } from '@/utils/api';

export default function GameLibraryScreen() {
    const screenWidth = Dimensions.get('window').width;
    const numColumns = Math.floor(screenWidth / 180);

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                // Example game IDs to fetch from the backend
                const gameIds = [
                    "85f347d0-6e1e-4c26-a15d-184f44b8c3af",
                    "f0a7e5a1-239f-4a2e-9b68-0c6e5eb63a37"
                ];

                // Fetch game data using the getGames function
                const fetchedGames = await getGames(gameIds);

                // Map backend data to match the frontend's expected format
                const formattedGames = fetchedGames.map((game: any) => ({
                    id: game.gameId,
                    title: game.name,
                    cover: game.imageUrl,
                }));

                setGames(formattedGames);
            } catch (err) {
                setError('Failed to load games. Please try again later.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: 12 }}>
            <FlatList
                data={games}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Card id={item.id} title={item.title} cover={item.cover} />}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ gap: 12 }}
            />
        </SafeAreaView>
    );
}
