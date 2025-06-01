import { StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';


const themeGreen = '#0a7e3a';
const themeBlack = '#181818';
const themeLightGreen = '#e6f9ed';
const themeWhite = '#ffffff';

export const styles = StyleSheet.create({
     buttonWrapper: {
    flex: 1,
    marginHorizontal: 8,
    minWidth: 140,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 8,
    width: "100%",
  },
  bottomButtonContainer: {
    marginBottom: 16,
  },
  spacedButton: {
    marginHorizontal: 24, // More spacing between buttons
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: themeWhite, // changed to white
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeWhite, // changed to white
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    height: 60,
    backgroundColor: themeWhite, // changed to white
  },
  toggleBox: {
    flex: 1,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: themeGreen,
    backgroundColor: themeWhite, // changed to white
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBox: {
    backgroundColor: themeGreen,
    borderColor: themeGreen,
  },
  toggleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: themeGreen,
  },
  activeText: {
    color: themeWhite, // changed to white for contrast
  },
  grid: {
    gap: 16,
    backgroundColor: themeWhite, // changed to white
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeLightGreen,
    borderRadius: 8,
    padding: 16,
    shadowColor: themeGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: themeGreen,
    backgroundColor: themeWhite, // changed to white
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: themeGreen,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: themeGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: themeWhite, // changed to white
    flexDirection: 'row',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    height: '100%',
  },
  bottomButton: {
    backgroundColor: themeBlack,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  bottomButtonText: {
    color: themeWhite,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  addFriendButton: {
    backgroundColor: themeBlack,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  addFriendButtonText: {
    color: themeWhite,
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeFriendButton: {
    backgroundColor: themeBlack,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  removeFriendButtonText: {
    color: themeWhite,
    fontWeight: 'bold',
    fontSize: 16,
  },
  guildInvitesButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: themeBlack,
    padding: 15,
    borderRadius: 8,
    shadowColor: themeGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guildInvitesButtonBar: {
    position: 'absolute',
    right: 16,
    bottom: 10,
  },
  guildInvitesText: {
    color: themeWhite, // changed to white
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(24,24,24,0.6)',
  },
  modalContent: {
    width: 320,
    backgroundColor: themeWhite, // changed to white
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: themeGreen,
  },
  modalDescription: {
    fontSize: 16,
    color: themeGreen,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalLabel: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    fontSize: 16,
    color: themeGreen,
  },
  inviteItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: themeGreen,
    width: '100%',
  },
  inviteText: {
    fontSize: 16,
    color: themeGreen,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: themeGreen,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: themeWhite, // changed to white
    color: themeGreen,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: themeGreen,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: themeWhite, // changed to white
    color: themeGreen,
  },
  addTagButton: {
    marginLeft: 8,
    backgroundColor: themeGreen,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    width: '100%',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: themeGreen,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: themeWhite, // changed to white
    marginRight: 6,
  },
  removeTag: {
    color: '#ff3333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  removeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: themeLightGreen,
  },
  selectedRemoveItem: {
    backgroundColor: '#b6f5c6',
  },
  guildCardContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 8,
    padding: 8,
    backgroundColor: themeLightGreen,
    borderRadius: 12,
    elevation: 2,
  },
  guildProfileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: themeGreen,
    backgroundColor: themeWhite, // changed to white
  },
  guildName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: themeGreen,
    textAlign: 'center',
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  memberImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    borderWidth: 1,
    borderColor: themeGreen,
    backgroundColor: themeWhite, // changed to white
  },
  memberName: {
    fontSize: 15,
    color: themeGreen,
  },
  membersList: {
    paddingVertical: 8,
  },




});