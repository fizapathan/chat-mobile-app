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
  roomId?: string;
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

export interface SendMessageRequest {
  text: string;
  receiverId?: string;
  roomId?: string;
  messageType?: 'text' | 'image' | 'file';
}

// Socket event types
export interface IncomingSocketEvents {
  'message:received': Message;
  'message:read': { messageId: string; readBy: string };
  'user:online': { userId: string };
  'user:offline': { userId: string };
  'room:joined': { roomId: string; user: User };
  'room:left': { roomId: string; userId: string };
  'typing:start': { userId: string; roomId?: string };
  'typing:stop': { userId: string; roomId?: string };
}

export interface OutgoingSocketEvents {
  'message:send': SendMessageRequest;
  'message:markRead': { messageId: string };
  'room:join': { roomId: string };
  'room:leave': { roomId: string };
  'user:typing:start': { roomId?: string };
  'user:typing:stop': { roomId?: string };
}

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}