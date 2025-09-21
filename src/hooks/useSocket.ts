import { useState, useEffect, useCallback, useRef } from 'react';
import { SocketService } from '../services';
import { SendMessageRequest } from '../types/api';

interface SocketState {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface SocketActions {
  connect: () => Promise<void>;
  disconnect: () => void;
  sendMessage: (messageData: SendMessageRequest) => void;
  markMessageAsRead: (messageId: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  startTyping: (roomId?: string) => void;
  stopTyping: (roomId?: string) => void;
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
      
      await socketService.current.connect();
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        error: null,
      }));
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
  const joinRoom = useCallback((roomId: string) => {
    try {
      socketService.current.joinRoom(roomId);
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
  const leaveRoom = useCallback((roomId: string) => {
    try {
      socketService.current.leaveRoom(roomId);
    } catch (error) {
      console.warn('Failed to leave room:', error);
    }
  }, []);

  /**
   * Start typing indicator
   */
  const startTyping = useCallback((roomId?: string) => {
    socketService.current.startTyping(roomId);
  }, []);

  /**
   * Stop typing indicator
   */
  const stopTyping = useCallback((roomId?: string) => {
    socketService.current.stopTyping(roomId);
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
    sendMessage,
    markMessageAsRead,
    joinRoom,
    leaveRoom,
    startTyping,
    stopTyping,
  };
};