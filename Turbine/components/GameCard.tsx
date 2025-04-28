// components/GameCard.tsx
import { Image, Text, StyleSheet, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export function Card({ title, cover, id }: { title: string; cover: string; id: string }) {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.push(`/game-library/${id}`)} style={styles.card}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: cover }} style={styles.image} resizeMode="contain" />
            </View>
            <Text style={styles.title}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 180, // Fixed width
        height: 220, // Slightly taller to accommodate the title
        borderRadius: 12,
        overflow: 'hidden',
        margin: 6, // Add some spacing between cards
        backgroundColor: '#fff', // Add a background color for better contrast
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 180, // Reserve most of the card for the image
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
    },
});
