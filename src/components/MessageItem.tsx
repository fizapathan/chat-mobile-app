import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Message } from '../types/api';

const MessageListItem = ({message}: {message: Message}) => {
  return (
    <View style={styles.container}>
      <Text>{message.text}</Text>
    </View>
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

export default MessageListItem;