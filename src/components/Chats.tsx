
import React, { useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useMessages } from '../hooks';
import MessageListItem from './MessageItem';
import { Message } from '../types/api';

const Chats: React.FC<{ messages: Message[] }> = ({ messages }) => {
// console.log('Rendering Chats with messages:', messages);
  useEffect(() => {
    console.log('Messages updated:', messages);
  }, [messages]);

  const renderItem = ({ item } :{ item: Message}) => {
    return <MessageListItem message={item} />;
  };

  const keyExtractor = (item: Message) => Math.random().toString()+item.id;

  return (
    <View style={styles.container}>
      <FlatList
      style={{ flex: 1, backgroundColor: '#bdbcbcff' }}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  }
});

export default Chats;