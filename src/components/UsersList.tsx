
import React, { useEffect, memo } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { ConnectedUser, User } from '../types/api';
import { useUsersList } from '../hooks/useUsersList';
import UsersListItem from './UserListItem';
import UsersListItemNonConnected from './UserListItemNonConnected';
import { theme } from '../styles/theme';

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
        style={styles.flatList}
        data={users.connectedUsers}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
      <FlatList
        style={styles.flatList}
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
    backgroundColor: theme.colors.background,
  },
  flatList: {
    backgroundColor: theme.colors.background,
  },
});

export default memo(UsersList);