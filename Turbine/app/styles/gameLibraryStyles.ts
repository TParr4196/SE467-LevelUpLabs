import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
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
        backgroundColor: '#0a7e3a', // changed to green
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    buttonGroup: {
        flexDirection: 'row',
        gap: 20, // Space between the buttons
    },
    // Add a style for the buttons if not already present
    bottomButton: {
        backgroundColor: '#181818', // green
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    bottomButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center',
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
    scrollableModalContent: {
        width: '90%',
        maxHeight: 500,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'flex-start',
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

export default styles;