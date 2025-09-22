import React from "react";
import { memo } from "react"
import { Text, View, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { useAuth, useMessages, useTyping } from "../hooks";
import TypingIndicator from "./TypingIndicator";

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
    <View style={{ flexDirection: 'row' }}>
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        placeholderTextColor="#999"
        value={messageText}
        onChangeText={handleTextChange}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity style={{ marginLeft: 8, paddingHorizontal: 12, justifyContent: 'center' }} onPress={send}>
        <Text style={[{ color: 'blue' }]}>Send</Text>
      </TouchableOpacity>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
})

export default memo(MessageInput);