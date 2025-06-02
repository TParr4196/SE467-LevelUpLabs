import { StyleSheet } from "react-native";
export const friendStyles = StyleSheet.create({
  selectFriendsButton: {
    backgroundColor:'#0a7e3a',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  friendItem: {
    padding: 15,
    marginVertical: 6,
    marginHorizontal: 12,
    borderRadius: 8,
  },
  answerButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  closeModalButton: {
    backgroundColor: '#c0392b',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default friendStyles;