// User types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt: string;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Chat types
export interface Message {
  id: string;
  text: string;
  senderId: string;
  receiverId?: string;
  chatRoomId?: string;
  timestamp: string;
  messageType: 'text' | 'image' | 'file';
  isRead: boolean;
  senderName?: string;
  senderAvatar?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'private' | 'group';
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectedUser {
    user: User;
    unreadCount: number;
    chatRoomId: string;
    lastMessage: string;
}

export interface SendMessageRequest {
  text: string;
  senderId: string;
  chatRoomId: string;
  messageType?: 'text' | 'image' | 'file';
  senderName?: string;
  timestamp?: string;
}

// Socket event types
export interface IncomingSocketEvents {
  'message:received': Message;
  'message:read': { messageId: string; readBy: string };
  'user:online': { userId: string };
  'user:offline': { userId: string };
  'users:received': { connectedUsers: ConnectedUser[]; nonConnectedUsers: User[]};
  'room:joined': { chatRoomId: string; user: User };
  'room:left': { chatRoomId: string; userId: string };
  'typing:start': { userId: string; chatRoomId?: string };
  'typing:stop': { userId: string; chatRoomId?: string };
}

export interface OutgoingSocketEvents {
  'message:send': SendMessageRequest;
  'message:markRead': { messageId: string };
  'room:join': { chatRoomId: string };
  'room:leave': { chatRoomId: string };
  'user:typing:start': { chatRoomId?: string };
  'user:typing:stop': { chatRoomId?: string };
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}