// app/(tabs)/game-library.tsx
import { View, FlatList, Dimensions } from 'react-native';
import { Card } from '@/components/GameCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

const games = [
    {
        id: '1',
        title: 'The Witcher 3',
        cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8y.png',
    },
    {
        id: '2',
        title: 'Cyberpunk 2077',
        cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r8w.png',
    },
    {
        id: '3',
        title: 'God of War',
        cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1tmu.png',
    },
    // Add more...
];

export default function GameLibraryScreen() {
    const screenWidth = Dimensions.get('window').width;
    const numColumns = Math.floor(screenWidth / 180);

    return (
        <SafeAreaView style={{ flex: 1, padding: 12 }}>
            <FlatList
                data={games}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Card {...item} />}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ gap: 12 }}
            />
        </SafeAreaView>
    );
}
