import React from "react";
import { memo } from "react"
import { View, StyleSheet } from "react-native"
import { useAuth, useMessages, useTyping } from "../hooks";
import TypingIndicator from "./TypingIndicator";
import { ThemedTextInput, ThemedButton } from "./common";
import { theme } from "../styles/theme";

const MessageInput = () => {
  const [messageText, setMessageText] = React.useState('');
  const { sendMessage } = useMessages();
  const { user } = useAuth();
  const { typingUsers, startTyping, stopTyping } = useTyping();

  const send = () => {
    if (!messageText.trim() || !user) {
      return;
    }
    stopTyping(); // Stop typing when sending message
    sendMessage({
      text: messageText.trim(),
      senderId: user.id,
      chatRoomId: 'general', // passed static as there is only one chat room currently
      messageType: 'text',
      senderName: user.name
    });
    setMessageText('');
  }

  const handleTextChange = (text: string) => {
    setMessageText(text);

    if (text.trim()) {
      startTyping();
    } else {
      stopTyping();
    }
  };

  const handleBlur = () => {
    stopTyping();
  };

  return (
    <>
    <TypingIndicator typingUsers={typingUsers} />
    <View style={styles.container}>
      <ThemedTextInput
        style={styles.input}
        placeholder="Type a message..."
        value={messageText}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCorrect={false}
        multiline
      />
      <ThemedButton
        title="➤"
        variant="primary"
        size="small"
        onPress={send}
        style={styles.sendButton}
      />
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  input: {
    flex: 1,
    maxHeight: 100,
    marginBottom: 0,
  },
  sendButton: {
    marginLeft: theme.spacing.sm,
    width: 45,
    height: 45,
  },
})

export default memo(MessageInput);