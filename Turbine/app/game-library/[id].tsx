// app/(tabs)/game-library/[id].tsx
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GameDetailScreen() {
    const { id } = useLocalSearchParams();

    // For now, just show the ID. Later we can fetch full game data.
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Game Details</Text>
            <Text style={styles.subtitle}>Game ID: {id}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: 'bold' },
    subtitle: { fontSize: 18, marginTop: 8 },
});
