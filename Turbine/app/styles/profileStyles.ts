import { StyleSheet } from 'react-native';

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
    backgroundColor: "#eee",
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  avatarLabel: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  editAvatarButton: {
    marginTop: 4,
    marginBottom: 8,
    alignSelf: "center",
  },
  descriptionContainer: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#444",
    marginBottom: 8,
  },
  descriptionInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    fontSize: 15,
    backgroundColor: "#fff",
    marginBottom: 8,
    minHeight: 60,
    textAlignVertical: "top",
  },
  saveButton: {
    marginBottom: 8,
  },
  privacyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  privacyText: {
    fontSize: 18,
    color: "#333",
  },
  menuContainer: {
    marginVertical: 20,
    alignItems: "flex-start",
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalOption: {
    fontSize: 16,
    marginVertical: 10,
    color: "#007BFF",
  },
  selectedOption: {
    color: "#FF6347", // Highlight color when selected
    fontWeight: "bold",
  },
  sendButton: {
    marginTop: 20,
  },
});
