import { useEffect, useState, useRef } from 'react';
import { SocketService } from '../services/socketService';
import { useSocket } from './useSocket';
import { useUsersStore } from '../store/usersStore';
import { ConnectedUser, User } from '../types/api';
import { useAuthStore } from '../store';

interface UseTypingReturn {
  typingUsers: string[];
  startTyping: (chatRoomId?: string) => void;
  stopTyping: (chatRoomId?: string) => void;
  isUserTyping: (userId: string) => boolean;
}

export const useTyping = (chatRoomId?: string): UseTypingReturn => {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const { isConnected } = useSocket();
  const { users } = useUsersStore();
  const socketService = SocketService.getInstance();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUser = useAuthStore(state => state.user);

  useEffect(() => {
    if (!isConnected) return;

    const handleUserTyping = (data: { userName: string; userId: string; chatRoomId?: string }) => {
      // Only handle typing for the current chat room
      // if (chatRoomId && data.chatRoomId !== chatRoomId) return;
      if(data.userId === currentUser?.id) return;
      
      setTypingUsers(prev => {
        if (!prev.includes(data.userName)) {
          return [...prev, data.userName];
        }
        return prev;
      });
    };

    const handleUserStoppedTyping = (data: { userName: string; chatRoomId?: string }) => {
      // Only handle typing for the current chat room
      if (chatRoomId && data.chatRoomId !== chatRoomId) return;
console.log("removing user from typing list")
      setTypingUsers(prev => prev.filter(userName => userName !== data.userName));
    };

    socketService.onUserTyping(handleUserTyping);
    socketService.onUserStoppedTyping(handleUserStoppedTyping);

    return () => {
      socketService.removeListener('typing:start', handleUserTyping);
      socketService.removeListener('typing:stop', handleUserStoppedTyping);
    };
  }, [isConnected, chatRoomId]);

  const startTyping = () => {
    if (!isConnected || !currentUser) return;

    socketService.startTyping(currentUser.name);
    setTypingUsers(prev => {
      if (!prev.includes('You')) {
        return [...prev, 'You'];
      }
      return prev;
    });

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Auto-stop typing after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (!isConnected || !currentUser) return;

    socketService.stopTyping(currentUser.name);

    setTypingUsers(prev => prev.filter(name => name !== 'You'));

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  };

  const isUserTyping = (userName: string): boolean => {
    return typingUsers.includes(userName);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    typingUsers,
    startTyping,
    stopTyping,
    isUserTyping,
  };
};