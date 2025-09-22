
import React, { useEffect, memo, useRef, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useMessages } from '../hooks';
import MessageListItem from './MessageItem';
import { Message } from '../types/api';

const Chats = () => {
  const { messages } = useMessages();
  const flatListRef = useRef<FlatList>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(true);

  console.log('Chats component rendering with messages:', messages.length);

  useEffect(() => {
    console.log('Chats: Messages updated:', messages);
    if (isAtEnd && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isAtEnd]);

  const renderItem = ({ item }: { item: Message }) => {
    return <MessageListItem message={item} />;
  };

  const keyExtractor = (item: Message) => Math.random().toString() + item.id;

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const isCloseToBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
    setIsAtEnd(isCloseToBottom);
    setShowScrollToBottom(!isCloseToBottom && messages.length > 0);
  };

  const scrollToBottom = () => {
    flatListRef.current?.scrollToEnd({ animated: true });
    setShowScrollToBottom(false);
    setIsAtEnd(true);
  };

  return (
    <View style={styles.container}>
      
          <FlatList
            ref={flatListRef}
            style={{ flex: 1, backgroundColor: '#bdbcbcff' }}
            data={messages}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            ListEmptyComponent={ChatsEmptyView}
            keyboardDismissMode='on-drag'
          />

          {showScrollToBottom && (
            <TouchableOpacity
              style={styles.scrollToBottomButton}
              onPress={scrollToBottom}
            >
              <Text style={styles.scrollToBottomText}>↓</Text>
            </TouchableOpacity>
          )}
    </View>
  );
};

const ChatsEmptyView = memo(() => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Image style={{ width: 200, height: 200, marginBottom: 20 }} source={require('../../assets/icebreaker.webp')} />
      <Text style={{ alignSelf: 'center', textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>Be the Ice-breaker! Send a message to start.</Text>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollToBottomText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
export default memo(Chats);