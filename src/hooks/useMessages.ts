import { useState, useRef, useEffect, useCallback } from "react";
import { SocketService } from "../services";
import { Message } from "../types/api";

// Hook for handling incoming messages
export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<{ userId: string; roomId?: string }[]>([]);
  const socketService = useRef<SocketService>(SocketService.getInstance());

  useEffect(() => {
    console.log("Messages updated in hook: ", messages);
  }, [messages]);
  /**
   * Add a new message to the list
   */
  const addMessage = useCallback((message: Message) => {
    setMessages(prev => [...prev, message]);
  }, []);

  /**
   * Update message read status
   */
  const updateMessageReadStatus = useCallback((messageId: string, readBy: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  }, []);

  /**
   * Clear all messages
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Add typing indicator
   */
  const addTypingUser = useCallback((userId: string, roomId?: string) => {
    setTyping(prev => {
      const exists = prev.some(t => t.userId === userId && t.roomId === roomId);
      if (!exists) {
        return [...prev, { userId, roomId }];
      }
      return prev;
    });
  }, []);

  /**
   * Remove typing indicator
   */
  const removeTypingUser = useCallback((userId: string, roomId?: string) => {
    setTyping(prev => prev.filter(t => !(t.userId === userId && t.roomId === roomId)));
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    const socket = socketService.current;

    // Message listeners
    socket.onMessageReceived(addMessage);
    socket.onMessageRead(({ messageId, readBy }) => {
      updateMessageReadStatus(messageId, readBy);
    });

    // Typing listeners
    socket.onUserTyping(({ userId, roomId }) => {
      addTypingUser(userId, roomId);
    });

    socket.onUserStoppedTyping(({ userId, roomId }) => {
      removeTypingUser(userId, roomId);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.removeListener('message:received', addMessage);
      socket.removeListener('message:read');
      socket.removeListener('typing:start');
      socket.removeListener('typing:stop');
    };
  }, [addMessage, updateMessageReadStatus, addTypingUser, removeTypingUser]);

  return {
    messages,
    typing,
    addMessage,
    clearMessages,
  };
};