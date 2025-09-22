import { create } from 'zustand';
import { Message, SendMessageRequest } from '../types/api';
import { SocketService } from '../services';
import { useAuthStore } from './authStore';

interface MessagesState {
  messages: Message[];
  typing: string[]; // Array of userNames who are typing
  isLoading: boolean;
  error: string | null;
}

interface MessagesActions {
  addMessage: (message: Message) => void;
  addMessages: (messages: Message[]) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  deleteMessage: (messageId: string) => void;
  markMessageAsRead: (messageId: string) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Typing indicators
  addTypingUser: (userId: string, chatRoomId?: string) => void;
  removeTypingUser: (userId: string, chatRoomId?: string) => void;
  clearTyping: () => void;
  
  // Test and utility functions
  addTestMessage: () => void;
  sendMessage: (messageData: SendMessageRequest) => void;
  
  // Socket event handlers
  setupSocketListeners: () => void;
  cleanupSocketListeners: () => void;
}

type MessagesStore = MessagesState & MessagesActions;

export const useMessagesStore = create<MessagesStore>((set, get) => ({
  // Initial state
  messages: [],
  typing: [],
  isLoading: false,
  error: null,

  // Basic actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  /**
   * Add a single message
   */
  addMessage: (message) => {
    console.log('Adding message to store:', message);
    set((state) => ({
      messages: [...state.messages, message],
      error: null,
    }));
  },

  /**
   * Add multiple messages (for initial load)
   */
  addMessages: (newMessages) => {
    console.log('Adding multiple messages to store:', newMessages.length);
    set((state) => ({
      messages: [...state.messages, ...newMessages],
      error: null,
    }));
  },

  /**
   * Update an existing message
   */
  updateMessage: (messageId, updates) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, ...updates } : msg
      ),
    }));
  },

  /**
   * Delete a message
   */
  deleteMessage: (messageId) => {
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId),
    }));
  },

  /**
   * Mark message as read
   */
  markMessageAsRead: (messageId) => {
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ),
    }));
  },

  /**
   * Clear all messages
   */
  clearMessages: () => {
    console.log('Clearing all messages');
    set({ messages: [], typing: [], error: null });
  },

  /**
   * Add typing indicator
   */
  addTypingUser: (userName) => {
    set((state) => {
      const exists = state.typing.includes(userName);
      if (!exists) {
        return {
          typing: [...state.typing, userName],
        };
      }
      return state;
    });
  },

  /**
   * Remove typing indicator
   */
  removeTypingUser: (userId, chatRoomId) => {
    set((state) => ({
      typing: state.typing.filter((name) => name !== userId)
    }));
  },

  /**
   * Clear all typing indicators
   */
  clearTyping: () => set({ typing: [] }),

  /**
   * Add a test message for development
   */
  addTestMessage: () => {
    const testMessage: Message = {
      id: `test-${Date.now()}`,
      text: `Test message at ${new Date().toLocaleTimeString()}`,
      senderId: 'test-user-1',
      timestamp: new Date().toISOString(),
      messageType: 'text',
      isRead: false,
      senderName: 'Test User',
    };
    console.log('Adding test message:', testMessage);
    get().addMessage(testMessage);
  },

  /**
   * Send a message via socket
   */
  sendMessage: (messageData) => {
    try {
      const socketService = SocketService.getInstance();
      
      if (!socketService.isConnected()) {
        throw new Error('Socket not connected');
      }
      console.log('Sending message via socket:', messageData);
      // Send via socket
      socketService.sendMessage(messageData);
      
      // Optimistically add to local state
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        text: messageData.text || '',
        senderId: messageData.senderId, 
        // receiverId: messageData.receiverId,
        chatRoomId: messageData.chatRoomId,
        timestamp: new Date().toISOString(),
        messageType: messageData.messageType || 'text',
        isRead: false,
        senderName: 'You',
      };
      console.log('Optimistically adding message to store:', optimisticMessage);
      get().addMessage(optimisticMessage);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      set({ error: errorMessage });
      console.error('Send message failed:', error);
    }
  },

  /**
   * Handle incoming message history 
   * @param messages Array of messages
   */
  onMessageHistory: (messages: Message[]) => {
    console.log('Received message history via socket:', messages.length);
    get().addMessages(messages);
  },

  /**
   * Setup socket event listeners
   */
  setupSocketListeners: () => {
    const socketService = SocketService.getInstance();
    const { addMessage, markMessageAsRead, addTypingUser, removeTypingUser } = get();

    console.log('Setting up socket listeners for messages');

    // Listen for chat room created
    socketService.onChatRoomCreated((room) => {
      console.log('Chat room created via socket:', room);
      // Handle the newly created chat room
    });
    // Listen for chat room history
    socketService.onChatRoomHistory((messages) => {
      console.log('Received chat room history via socket:', messages);
      messages.forEach((message) => addMessage(message));
    });

    // Listen for messages history
    socketService.onMessageHistory((messages) => {
      console.log('Received messages history via socket:', messages.length);
      const loggedInUser = useAuthStore.getState().user;
      messages.forEach((message) => {
          addMessage(message);
      });
    });

    // Listen for incoming messages
    socketService.onMessageReceived((message) => {
      console.log('Received message via socket:', message);
      const loggedInUser = useAuthStore.getState().user;
      if (loggedInUser && message.senderId !== loggedInUser.id) {
        addMessage(message);
      }
    });

    // Listen for message read receipts
    socketService.onMessageRead(({ messageId }) => {
      console.log('Message marked as read:', messageId);
      markMessageAsRead(messageId);
    });

    // Listen for typing indicators
    socketService.onUserTyping(({ userName }) => {
      console.log('User started typing:', userName);
      addTypingUser(userName);
    });

    socketService.onUserStoppedTyping(({ userName }) => {
      console.log('User stopped typing:', userName);
      removeTypingUser(userName);
    });
  },

  /**
   * Cleanup socket event listeners
   */
  cleanupSocketListeners: () => {
    const socketService = SocketService.getInstance();
    console.log('Cleaning up socket listeners for messages');
    
    socketService.removeListener('message:received');
    socketService.removeListener('message:read');
    socketService.removeListener('typing:start');
    socketService.removeListener('typing:stop');
  },
}));