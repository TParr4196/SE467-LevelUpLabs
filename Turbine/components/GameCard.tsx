// components/GameCard.tsx
import { ImageBackground, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export function Card({ title, cover, id }: { title: string; cover: string; id: string }) {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.push(`/game-library/${id}`)} style={styles.card}>
            <ImageBackground source={{ uri: cover }} style={styles.image} imageStyle={styles.imageBorder}>
                <Text style={styles.title}>{title}</Text>
            </ImageBackground>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minHeight: 180,
        borderRadius: 12,
        overflow: 'hidden',
    },
    image: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 12,
    },
    imageBorder: {
        borderRadius: 12,
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: 'hidden',
    },
});
