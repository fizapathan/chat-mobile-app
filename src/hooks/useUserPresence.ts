import { useState, useRef, useCallback, useEffect } from "react";
import { SocketService } from "../services";

// Hook for handling user presence
export const useUserPresence = () => {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const socketService = useRef<SocketService>(SocketService.getInstance());

  /**
   * Set user as online
   */
  const setUserOnline = useCallback((userId: string) => {
    setOnlineUsers(prev => new Set([...prev, userId]));
  }, []);

  /**
   * Set user as offline
   */
  const setUserOffline = useCallback((userId: string) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  }, []);

  /**
   * Check if user is online
   */
  const isUserOnline = useCallback((userId: string): boolean => {
    return onlineUsers.has(userId);
  }, [onlineUsers]);

  // Set up socket event listeners
  useEffect(() => {
    const socket = socketService.current;

    socket.onUserOnline(({ userId }) => {
      setUserOnline(userId);
    });

    socket.onUserOffline(({ userId }) => {
      setUserOffline(userId);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.removeListener('user:online');
      socket.removeListener('user:offline');
    };
  }, [setUserOnline, setUserOffline]);

  return {
    onlineUsers: Array.from(onlineUsers),
    isUserOnline,
  };
};