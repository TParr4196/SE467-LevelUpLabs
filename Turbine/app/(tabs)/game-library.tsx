import { View, FlatList, Dimensions, ActivityIndicator, Text, Button, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Card } from '@/components/GameCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { getGames, getUsers, addGameToLibrary } from '@/utils/api'; // Add your POST API function here
import { DEFAULT_USER_ID, DEFAULT_GAME_NAMES } from '@/utils/constants';

export default function GameLibraryScreen() {
    const screenWidth = Dimensions.get('window').width;
    const numColumns = Math.floor(screenWidth / 180);

    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedGame, setSelectedGame] = useState<any | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const userDetails = await getUsers([DEFAULT_USER_ID]);
                const gameIds = userDetails[0].gamesOwned;

                const fetchedGames = await getGames(gameIds);

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

    const handleAddGame = () => {
        setSearchQuery('');
        setSearchResults([]);
        setModalVisible(true);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        // Filter games from DEFAULT_GAME_NAMES that match the query and are not already in the library
        const filteredGames = DEFAULT_GAME_NAMES.filter(
            (game: any) =>
                game.name.toLowerCase().includes(query.toLowerCase()) &&
                !games.some((g) => g.title === game.name)
        );

        setSearchResults(filteredGames);
    };

    const handleSelectGame = (game: any) => {
        setSelectedGame(game);
    };

    const handleConfirmAddGame = async () => {
        if (!selectedGame) return;

        try {
            // Send POST request to add the game to the backend
            await addGameToLibrary(DEFAULT_USER_ID, selectedGame.id);
            console.log(`Game added: ${selectedGame.name}`);

            // Update the local library
            setGames((prevGames) => [
                ...prevGames,
                { id: selectedGame.id, title: selectedGame.name, cover: selectedGame.imageUrl },
            ]);

            setModalVisible(false);
            setSelectedGame(null);
        } catch (err) {
            console.error('Error adding game to library:', err);
        }
    };

    const handleRemoveGame = () => {
        console.log('Remove Game button pressed');
        // TODO: Implement functionality to remove a game from the library
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red', fontSize: 16 }}>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <FlatList
                data={games}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Card id={item.id} title={item.title} cover={item.cover} />}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ gap: 12, paddingBottom: 100 }} // Add padding to avoid overlapping with buttons
            />
            <View style={styles.bottomBar}>
                <View style={styles.buttonGroup}>
                    <Button title="Add Game" onPress={handleAddGame} />
                    <Button title="Remove Game" onPress={handleRemoveGame} />
                </View>
            </View>

            {/* Modal for Adding a Game */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add a Game</Text>
                        <TextInput
                            style={styles.searchBox}
                            placeholder="Search for a game..."
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.searchResult,
                                        selectedGame?.id === item.id && styles.selectedGame,
                                    ]}
                                    onPress={() => handleSelectGame(item)}
                                >
                                    <Text style={styles.searchResultText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button
                            title="Add Selected Game"
                            onPress={handleConfirmAddGame}
                            disabled={!selectedGame} // Disable button if no game is selected
                        />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 60,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 20, // Space between the buttons
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    searchBox: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 16,
    },
    searchResult: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    selectedGame: {
        backgroundColor: '#e0e0e0',
    },
    searchResultText: {
        fontSize: 16,
    },
});