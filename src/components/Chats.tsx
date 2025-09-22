
import React, { useEffect, memo, useRef, useState } from 'react';
import { FlatList, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useMessages } from '../hooks';
import MessageListItem from './MessageItem';
import { Message } from '../types/api';
import { ThemedText } from './common';
import { theme } from '../styles/theme';

const Chats = () => {
  const { messages } = useMessages();
  const flatListRef = useRef<FlatList>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(true);

  // console.log('Chats component rendering with messages:', messages.length);

  useEffect(() => {
    // console.log('Chats: Messages updated:', messages);
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
            style={styles.flatList}
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
              <ThemedText style={styles.scrollToBottomText}>↓</ThemedText>
            </TouchableOpacity>
          )}
    </View>
  );
};

const ChatsEmptyView = memo(() => {
  return (
    <View style={styles.emptyContainer}>
      <Image style={styles.emptyImage} source={require('../../assets/icebreaker.webp')} />
      <ThemedText variant="heading3" style={styles.emptyText}>Be the Ice-breaker! Send a message to start.</ThemedText>
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.background,
  },
  flatList: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
  },
  scrollToBottomButton: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.lg,
  },
  scrollToBottomText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
export default memo(Chats);