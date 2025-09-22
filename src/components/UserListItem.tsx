import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { ConnectedUser, Message } from '../types/api';

const UsersListItem = ({user}: {user: ConnectedUser}) => {
  return (
    <View style={styles.container}>
      <Text>{user.user.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4e8e8ff',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 16,
  }
});

export default UsersListItem;