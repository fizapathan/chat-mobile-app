
import React, { useEffect, memo } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useMessages } from '../hooks';
import MessageListItem from './MessageItem';
import { ConnectedUser, Message, User } from '../types/api';
import { useUsersList } from '../hooks/useUsersList';
import UsersListItem from './UserListItem';
import UsersListItemNonConnected from './UserListItemNonConnected';

const UsersList = () => {
  const { users } = useUsersList();

  console.log('UsersList component rendering');

  useEffect(() => {
    console.log('UsersList: Users updated:', users);
  }, [users]);

  const renderItem = ({ item } :{ item: ConnectedUser}) => {
    return <UsersListItem user={item} />;
  };

  const keyExtractor = (item: ConnectedUser) => Math.random().toString()+item.chatRoomId;

  const renderItemNonConnected = ({ item } :{ item: User}) => {
    return <UsersListItemNonConnected user={item} />;
  };

  const keyExtractorNonConnected = (item: User) => Math.random().toString()+item.id;

  return (
    <View style={styles.container}>

      <FlatList
        style={{ flex: 1, backgroundColor: '#bdbcbcff' }}
        data={users.connectedUsers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <FlatList
        style={{ backgroundColor: '#bdbcbcff' }}
        data={users.nonConnectedUsers}
        renderItem={renderItemNonConnected}
        keyExtractor={keyExtractorNonConnected}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default memo(UsersList);