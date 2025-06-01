import { StyleSheet } from 'react-native';

// Consistent with friendsStyle and other pages
const themeGreen = '#0a7e3a';
const themeLightGreen = '#e6f9ed';
const themeButton = '#0a7e3a'; // black
const themeBackground = '#ffffff';

export const styles = StyleSheet.create({
  logoImage: {
    width: "100%",
    height: 220,
    alignSelf: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  avatarImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    backgroundColor: themeLightGreen,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: themeGreen,
  },
  avatarLabel: {
    fontSize: 16,
    color: themeGreen,
    marginBottom: 4,
  },
  editAvatarButton: {
    marginTop: 4,
    marginBottom: 8,
    alignSelf: "center",
    backgroundColor: themeButton, // black
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editAvatarButtonText: {
    color: themeBackground, // white text
    fontWeight: "bold",
    fontSize: 16,
  },
  descriptionContainer: {
    backgroundColor: themeBackground,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: themeGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: themeGreen,
  },
  descriptionText: {
    fontSize: 15,
    color: themeGreen,
    marginBottom: 8,
  },
  descriptionInput: {
    borderColor: themeGreen,
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 15,
    backgroundColor: themeLightGreen,
    marginBottom: 8,
    minHeight: 60,
    textAlignVertical: "top",
    color: themeGreen,
  },
  saveButton: {
    marginBottom: 8,
    backgroundColor: themeButton, // black
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: themeBackground, // white text
    fontWeight: "bold",
    fontSize: 16,
  },
  privacyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  privacyText: {
    fontSize: 18,
    color: themeGreen,
  },
  menuContainer: {
    marginVertical: 20,
    alignItems: "flex-start",
    paddingHorizontal: 10,
    backgroundColor: themeBackground,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(24,24,24,0.6)", // Consistent with friendsStyle
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: themeBackground,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: themeGreen,
  },
  modalOption: {
    fontSize: 16,
    marginVertical: 10,
    color: themeButton, // black
    backgroundColor: themeButton, // black
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    textAlign: "center",
  },
  selectedOption: {
    color: themeBackground, // white text for selected
    backgroundColor: themeButton, // black
    fontWeight: "bold",
  },
  sendButton: {
    marginTop: 20,
    backgroundColor: themeButton, // black
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  sendButtonText: {
    color: themeBackground, // white text
    fontWeight: "bold",
    fontSize: 16,
  },
  // Add a generic button style for any other buttons
  button: {
    backgroundColor: themeButton,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  buttonText: {
    color: themeBackground,
    fontWeight: "bold",
    fontSize: 16,
  },
});