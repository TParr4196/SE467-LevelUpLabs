// components/GameCard.tsx
import { ImageBackground, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export function Card({ title, cover, id }: { title: string; cover: string; id: string }) {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.push(`/game-library/${id}`)} style={styles.card}>
            <ImageBackground
                source={{ uri: cover }}
                style={styles.imageBackground}
                imageStyle={styles.imageBorder}
                resizeMode="cover" // Ensures the image covers the entire card
            >
                <Text style={styles.title}>{title}</Text>
            </ImageBackground>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 180, // Fixed width
        height: 270, // Adjusted height to match the 600x900 aspect ratio
        borderRadius: 12,
        overflow: 'hidden',
        margin: 6, // Add some spacing between cards
    },
    imageBackground: {
        flex: 1,
        justifyContent: 'flex-end', // Position the title at the bottom
        padding: 12,
    },
    imageBorder: {
        borderRadius: 12, // Ensure the image respects the card's rounded corners
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'rgba(0,0,0,0.5)', // Add a semi-transparent background for better readability
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        overflow: 'hidden',
        textAlign: 'center',
    },
});
