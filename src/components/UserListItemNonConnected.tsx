import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ConnectedUser, Message, User } from '../types/api';
import { useAuth, useSocket } from '../hooks';

const UsersListItemNonConnected = ({user}: {user: User}) => {

  const { createChatRoom} = useSocket();
  const { user: currentUser } = useAuth();

  if (!currentUser) return null;

  const handlePress = () => {
    // Handle the press event here
    console.log('User pressed:', user.name);
    /**
     * pass current userid first
     */
    createChatRoom([currentUser.id, user.id]);
  };
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
    >
      <Text>{user.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#e86666ff',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
  }
});

export default UsersListItemNonConnected;