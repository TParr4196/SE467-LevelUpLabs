import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const { width: screenWidth, height:screenHeight} = Dimensions.get('window');


export const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  list: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  gameList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 10,
  },
  scrollableContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  gameItemOneThird: {
    width: '30%', // Adjusted for better spacing
    marginBottom: 15,
    alignItems: 'center',
  },
  gameImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentWrapper: {
    width: '100%',
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    height: screenHeight / 3, // Each section row is 1/3 of the screen height
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  horizontalScrollContainer: {
    flexDirection: 'row',
  },
  sectionHeader: {
    alignItems: 'flex-start',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  libraryContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginRight: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: screenWidth / 3, // Limit width to 1/3 of the screen
    height: '100%',          // Make the games box shorter vertically (was '30%' or '100%')
},
  friendsContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: screenWidth / 3, // Limit width to 1/3 of the screen
    height: '100%',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginLeft: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: screenWidth / 3, // Limit width to 1/3 of the screen
    height: '100%',
  },
  profileContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#ccc',
  },
  profileDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
    textAlign: 'center',
  },
  profileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  continueButton: {
    marginTop: 10,
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 40,
    paddingHorizontal: 10,
  },
});

export default styles;