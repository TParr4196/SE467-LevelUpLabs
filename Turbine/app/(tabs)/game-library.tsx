import { View, FlatList, Dimensions, ActivityIndicator, Text, Button, StyleSheet, Modal, TextInput, TouchableOpacity } from 'react-native';
import { Card } from '@/components/GameCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { deleteFromCollection, getGames, getUsers, postToCollection } from '@/utils/api'; // Add your POST API function here
import { DEFAULT_USER_ID } from '@/utils/constants';
import { Game } from '@/types/game';
import { useAppData } from '@/app/context/AppDataContext'; // Import the context
import { styles } from '@/app/styles/gameLibraryStyles';

export default function GameLibraryScreen() {
    const screenWidth = Dimensions.get('window').width;
    const numColumns = Math.floor(screenWidth / 180);

    // Properly type the state variables
    const { games, setGames, error, loading } = useAppData(); // Use context to get and set games
    const [allFilteredGames, setAllFilteredGames] = useState<Game[]>([]); // Source of truth for filtered games
    
    const [addModalVisible, setAddModalVisible] = useState(false);
    const [selectedGameToAdd, setSelectedGameToAdd] = useState<Game | null>(null);
    
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [selectedGameToRemove, setSelectedGameToRemove] = useState<Game | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Game[]>([]);

    const getAllDefaultGames = async () => {
        try {
            const allGames = await getGames();
            console.log('all games from Search', allGames)
            // Map the fetched games to the Game type
            const allGameObjects: Game[] = allGames.map((game: Game) => ({
                gameId: game.gameId,
                imageUrl: game.imageUrl,
                name: game.name,
                rating: game.rating,
                recommendedPlayers: game.recommendedPlayers,
                averagePlaytime: game.averagePlaytime,
                genres: game.genres,
            }));

            console.log('Games in library:', games);
            console.log('All default games:', allGameObjects);
            
            // Filter out games that are already in the user's library
            const filteredGames = allGameObjects.filter(
                (game) => !games.some((g) => g.gameId === game.gameId)
            );

            setAllFilteredGames(filteredGames); // Save the full filtered list
            setSearchResults(filteredGames); // Update the search results with the filtered list
        } catch (err) {
            console.error('Error fetching default games:', err);
        }
    }

    const handleAddGame = () => {
        setSearchQuery('');
        setSelectedGameToAdd(null);
        getAllDefaultGames(); // Fetch and filter the default games
        setAddModalVisible(true);
        
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    
        // Dynamically filter the searchResults based on the query
        const filteredResults = allFilteredGames.filter((game) =>
            game.name.toLowerCase().includes(query.toLowerCase())
        );
    
        setSearchResults(filteredResults);
    };

    const handleSelectGame = (game: Game) => {
        setSelectedGameToAdd(game);
    };

    const handleConfirmAddGame = async () => {
        if (!selectedGameToAdd) return;

        try {
            // Send POST request to add the game to the backend
            await postToCollection(DEFAULT_USER_ID, { uuid: selectedGameToAdd.gameId });
            console.log(`Game added: ${selectedGameToAdd.name}`);

            // Update the local library
            setGames((prevGames) => [...prevGames, selectedGameToAdd]);

            setAddModalVisible(false);
            setSelectedGameToAdd(null);
        } catch (err) {
            console.error('Error adding game to library:', err);
        }
    };

    const handleOpenRemoveModal = () => {
        setSelectedGameToRemove(null);
        setRemoveModalVisible(true);
    };

    const handleRemoveGame = async () => {
        if (!selectedGameToRemove) return;

        try {
            const response = await deleteFromCollection(DEFAULT_USER_ID, selectedGameToRemove.gameId);

            setGames((prevGames) => prevGames.filter((game) => game.gameId !== selectedGameToRemove.gameId));
            setRemoveModalVisible(false);
            setSelectedGameToRemove(null);

        } catch (err) {
            console.error('Error removing game from library:', err);
            alert('An error occurred while removing the game. Please try again.');
        }
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
                keyExtractor={(item) => item.gameId}
                renderItem={({ item }) => <Card id={item.gameId} title={item.name} cover={item.imageUrl} />}
                columnWrapperStyle={{ gap: 12 }}
                contentContainerStyle={{ gap: 12, paddingBottom: 100 }} // Add padding to avoid overlapping with buttons
            />
            <View style={styles.bottomBar}>
                <View style={styles.buttonGroup}>
                    <Button title="Add Game" onPress={handleAddGame} />
                    <Button title="Remove Game" onPress={handleOpenRemoveModal} />
                </View>
            </View>

            {/* Modal for Adding a Game */}
            <Modal
                visible={addModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setAddModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add a Game</Text>
                        <TextInput
                            style={styles.searchBox}
                            placeholder="Search for a game..."
                            value={searchQuery}
                            onChangeText={handleSearch} // Dynamically filter searchResults as the user types
                        />
                        <FlatList
                            data={searchResults} // Display dynamically filtered results
                            keyExtractor={(item) => item.gameId}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.searchResult,
                                        selectedGameToAdd?.gameId === item.gameId && styles.selectedGame,
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
                            disabled={!selectedGameToAdd} // Disable button if no game is selected
                        />
                        <Button title="Close" onPress={() => setAddModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            
            {/* --- Remove Game Modal --- */}
            <Modal
                visible={removeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setRemoveModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Remove a Game</Text>
                        <FlatList
                            data={games}
                            keyExtractor={(item) => item.gameId}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.searchResult,
                                        selectedGameToRemove?.gameId === item.gameId && styles.selectedGame,
                                    ]}
                                    onPress={() => setSelectedGameToRemove(item)}
                                >
                                    <Text style={styles.searchResultText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <Button
                            title="Delete Selected Game"
                            onPress={handleRemoveGame}
                            disabled={!selectedGameToRemove}
                        />
                        <Button title="Close" onPress={() => setRemoveModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}