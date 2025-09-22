import { useRef } from 'react';
import { SocketService } from '../services/socketService';
import { useSocket } from './useSocket';
import { useMessagesStore } from '../store/messagesStore';
import { useAuthStore } from '../store/authStore';

interface UseTypingReturn {
  typingUsers: string[];
  startTyping: (chatRoomId?: string) => void;
  stopTyping: (chatRoomId?: string) => void;
  isUserTyping: (userId: string) => boolean;
  getTypingUserNames: () => string[];
}

export const useTyping = (chatRoomId?: string): UseTypingReturn => {
  const { isConnected } = useSocket();
  const { typing: typingData } = useMessagesStore();
  const currentUser = useAuthStore(state => state.user);
  const socketService = SocketService.getInstance();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startTyping = (roomId?: string) => {
    if (!isConnected || !currentUser) return;

    socketService.startTyping(currentUser.id);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(roomId);
    }, 3000);
  };

  const stopTyping = (roomId?: string) => {
    if (!isConnected || !currentUser) return;
    
    socketService.stopTyping(currentUser.id);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const isUserTyping = (userId: string): boolean => {
    return typingData.some(user => user.userId === userId);
  };

  const getTypingUserNames = (): string[] => {
    return typingData.map(user => user.userName);
  };

  return {
    typingUsers: getTypingUserNames(), // Return user names for backward compatibility
    startTyping,
    stopTyping,
    isUserTyping,
    getTypingUserNames,
  };
};