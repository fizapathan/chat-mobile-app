import { io, Socket } from 'socket.io-client';
import { API_CONFIG } from './api';
import { AuthService } from './authService';
import {
  Message,
  SendMessageRequest,
  IncomingSocketEvents,
  OutgoingSocketEvents,
} from '../types/api';

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  /**
   * Connect to socket server
   */
  async connect(): Promise<void> {
    try {
      const token = await AuthService.getStoredToken();
      
      if (!token) {
        throw new Error('No authentication token available');
      }

      this.socket = io(API_CONFIG.SOCKET_URL, {
        auth: {
          token,
        },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      });

      this.setupEventListeners();
      
    } catch (error) {
      console.error('Socket connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from socket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  /**
   * Check if socket is connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Send a message
   */
  sendMessage(messageData: SendMessageRequest): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('message:send', messageData);
  }

  /**
   * Mark message as read
   */
  markMessageAsRead(messageId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('message:markRead', { messageId });
  }

  /**
   * Join a chat room
   */
  joinRoom(roomId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('room:join', { roomId });
  }

  /**
   * Leave a chat room
   */
  leaveRoom(roomId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Socket not connected');
    }
    
    this.socket.emit('room:leave', { roomId });
  }

  /**
   * Start typing indicator
   */
  startTyping(roomId?: string): void {
    if (!this.socket?.connected) {
      return;
    }
    
    this.socket.emit('user:typing:start', { roomId });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(roomId?: string): void {
    if (!this.socket?.connected) {
      return;
    }
    
    this.socket.emit('user:typing:stop', { roomId });
  }

  /**
   * Listen for incoming messages
   */
  onMessageReceived(callback: (message: Message) => void): void {
    if (!this.socket) return;
    
    this.socket.on('message:received', callback);
  }

  /**
   * Listen for message read receipts
   */
  onMessageRead(callback: (data: { messageId: string; readBy: string }) => void): void {
    if (!this.socket) return;
    
    this.socket.on('message:read', callback);
  }

  /**
   * Listen for user online status
   */
  onUserOnline(callback: (data: { userId: string }) => void): void {
    if (!this.socket) return;
    
    this.socket.on('user:online', callback);
  }

  /**
   * Listen for user offline status
   */
  onUserOffline(callback: (data: { userId: string }) => void): void {
    if (!this.socket) return;
    
    this.socket.on('user:offline', callback);
  }

  /**
   * Listen for typing indicators
   */
  onUserTyping(callback: (data: { userId: string; roomId?: string }) => void): void {
    if (!this.socket) return;
    
    this.socket.on('typing:start', callback);
  }

  /**
   * Listen for stop typing indicators
   */
  onUserStoppedTyping(callback: (data: { userId: string; roomId?: string }) => void): void {
    if (!this.socket) return;
    
    this.socket.on('typing:stop', callback);
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(): void {
    if (!this.socket) return;
    
    this.socket.removeAllListeners();
  }

  /**
   * Remove specific event listener
   */
  removeListener(event: keyof IncomingSocketEvents, callback?: (...args: any[]) => void): void {
    if (!this.socket) return;
    
    if (callback) {
      this.socket.off(event, callback);
    } else {
      this.socket.off(event);
    }
  }

  /**
   * Setup core socket event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.handleReconnect();
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  /**
   * Handle reconnection logic
   */
  private async handleReconnect(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    // exponential backoff
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
    
    setTimeout(async () => {
      try {
        await this.connect();
      } catch (error) {
        console.error('Reconnection failed:', error);
      }
    }, delay);
  }
}