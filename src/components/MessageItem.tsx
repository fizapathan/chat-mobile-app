import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Message } from '../types/api';
import { useAuthStore } from '../store/authStore';
import { theme } from '../styles/theme';

const MessageListItem = ({message}: {message: Message}) => {
  const { user } = useAuthStore();
  const isCurrentUser = user?.id === message.senderId;
  
  // Format timestamp to hh:mm format
  const formatTime = (timestamp: string | number) => {
    const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) : timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  return (
    <View style={[styles.container, isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer]}>
      {!isCurrentUser && message.senderName && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}
      <View style={[styles.bubble, isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble]}>
        <Text style={[styles.messageText, isCurrentUser ? styles.currentUserText : styles.otherUserText]}>
          {message.text}
        </Text>
        <Text style={[styles.timestamp, isCurrentUser ? styles.currentUserTimestamp : styles.otherUserTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.md,
  },
  currentUserContainer: {
    alignItems: 'flex-end',
  },
  otherUserContainer: {
    alignItems: 'flex-start',
  },
  senderName: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginBottom: 2,
    marginLeft: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    minWidth: 60,
    ...theme.shadows.sm,
  },
  currentUserBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.borderRadius.sm,
  },
  otherUserBubble: {
    backgroundColor: theme.colors.tertiary,
    borderBottomLeftRadius: theme.borderRadius.sm,
  },
  messageText: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
    marginBottom: 2,
  },
  currentUserText: {
    color: theme.colors.textPrimary,
  },
  otherUserText: {
    color: theme.colors.textPrimary,
  },
  timestamp: {
    fontSize: theme.typography.fontSize.xs,
    alignSelf: 'flex-end',
  },
  currentUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default MessageListItem;