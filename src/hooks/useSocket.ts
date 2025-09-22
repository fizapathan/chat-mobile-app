import { useState, useEffect, useCallback, useRef } from 'react';
import { SocketService } from '../services';
import { SendMessageRequest } from '../types/api';
import { setupSocketListeners } from '../store';

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface SocketActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  fetchUsers: (userId: string) => void;
  createChatRoom: (userIds: string[]) => void;
  sendMessage: (messageData: SendMessageRequest) => void;
  markMessageAsRead: (messageId: string) => void;
  joinRoom: (chatRoomId: string) => void;
  leaveRoom: (chatRoomId: string) => void;
}

export const useSocket = (): SocketState & SocketActions => {
  const [state, setState] = useState<SocketState>({
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  const socketService = useRef<SocketService>(SocketService.getInstance());

  /**
   * Connect to socket server
   */
  const connect = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isConnecting: true, error: null }));
      
      await socketService.current.connect(setConnectionStateByEventName);

      // Setup socket listeners for messages and presence
      setupSocketListeners();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed',
      }));
      throw error;
    }
  }, []);

  const setConnectionStateByEventName = useCallback((eventName: string) => {
    switch (eventName) {
      case 'connect':
        setState(prev => ({
          ...prev,
          isConnected: true,
          isConnecting: false,
          error: null,
        }));
        break;
      case 'disconnect':
      case 'error':
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: false,
          error: null,
        }));
        break;
      case 'connect_error':
        setState(prev => ({
          ...prev,
          isConnected: false,
          isConnecting: true,
          error: 'Connection error',
        }));
        break;
      default:
        break;
    }
  }, []);

  /**
   * Disconnect from socket server
   */
  const disconnect = useCallback(() => {
    socketService.current.disconnect();
    setState({
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  }, []);

  /**
   * Send a message
   */
  const sendMessage = useCallback((messageData: SendMessageRequest) => {
    try {
      socketService.current.sendMessage(messageData);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message',
      }));
    }
  }, []);

  /**
   * Fetch chat users
   */
  const fetchUsers = useCallback((userId: string) => {
    try {
      socketService.current.fetchUsers(userId);
    } catch (error) {
      console.warn('Failed to fetch chat users:', error);
    }
  }, []);

  /**
   * Fetch chat users
   */
  const createChatRoom = useCallback((userIds: string[]) => {
    try {
      socketService.current.createChatRoom(userIds[0], userIds[1]);
    } catch (error) {
      console.warn('Failed to create chat room:', error);
    }
  }, []);

  /**
   * Mark message as read
   */
  const markMessageAsRead = useCallback((messageId: string) => {
    try {
      socketService.current.markMessageAsRead(messageId);
    } catch (error) {
      console.warn('Failed to mark message as read:', error);
    }
  }, []);

  /**
   * Join a chat room
   */
  const joinRoom = useCallback((chatRoomId: string) => {
    try {
      socketService.current.joinRoom(chatRoomId);
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to join room',
      }));
    }
  }, []);

  /**
   * Leave a chat room
   */
  const leaveRoom = useCallback((chatRoomId: string) => {
    try {
      socketService.current.leaveRoom(chatRoomId);
    } catch (error) {
      console.warn('Failed to leave room:', error);
    }
  }, []);

  // Monitor connection status
  useEffect(() => {
    const checkConnection = () => {
      const connected = socketService.current.isConnected();
      setState(prev => ({
        ...prev,
        isConnected: connected,
      }));
    };

    const interval = setInterval(checkConnection, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    fetchUsers,
    createChatRoom,
    sendMessage,
    markMessageAsRead,
    joinRoom,
    leaveRoom
  };
};