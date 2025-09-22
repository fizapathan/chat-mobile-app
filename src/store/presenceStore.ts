import { create } from 'zustand';
import { SocketService } from '../services';

interface PresenceState {
  onlineUsers: Set<string>;
  isLoading: boolean;
  error: string | null;
}

interface PresenceActions {
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  setMultipleUsersOnline: (userIds: string[]) => void;
  setMultipleUsersOffline: (userIds: string[]) => void;
  isUserOnline: (userId: string) => boolean;
  getOnlineUsersList: () => string[];
  clearOnlineUsers: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Socket event handlers
  setupSocketListeners: () => void;
  cleanupSocketListeners: () => void;
}

type PresenceStore = PresenceState & PresenceActions;

export const usePresenceStore = create<PresenceStore>((set, get) => ({
  // Initial state
  onlineUsers: new Set<string>(),
  isLoading: false,
  error: null,

  // Basic actions
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  /**
   * Set a user as online
   */
  setUserOnline: (userId) => {
    console.log('Setting user online:', userId);
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
      error: null,
    }));
  },

  /**
   * Set a user as offline
   */
  setUserOffline: (userId) => {
    console.log('Setting user offline:', userId);
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      newOnlineUsers.delete(userId);
      return {
        onlineUsers: newOnlineUsers,
        error: null,
      };
    });
  },

  /**
   * Set multiple users as online
   */
  setMultipleUsersOnline: (userIds) => {
    console.log('Setting multiple users online:', userIds);
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, ...userIds]),
      error: null,
    }));
  },

  /**
   * Set multiple users as offline
   */
  setMultipleUsersOffline: (userIds) => {
    console.log('Setting multiple users offline:', userIds);
    set((state) => {
      const newOnlineUsers = new Set(state.onlineUsers);
      userIds.forEach((userId) => newOnlineUsers.delete(userId));
      return {
        onlineUsers: newOnlineUsers,
        error: null,
      };
    });
  },

  /**
   * Check if a user is online
   */
  isUserOnline: (userId) => {
    return get().onlineUsers.has(userId);
  },

  /**
   * Get list of online users as array
   */
  getOnlineUsersList: () => {
    return Array.from(get().onlineUsers);
  },

  /**
   * Clear all online users
   */
  clearOnlineUsers: () => {
    console.log('Clearing all online users');
    set({ onlineUsers: new Set(), error: null });
  },

  /**
   * Setup socket event listeners for presence
   */
  setupSocketListeners: () => {
    const socketService = SocketService.getInstance();
    const { setUserOnline, setUserOffline } = get();

    console.log('Setting up socket listeners for presence');

    // Listen for user online events
    socketService.onUserOnline(({ userId }) => {
      console.log('User came online via socket:', userId);
      setUserOnline(userId);
    });

    // Listen for user offline events
    socketService.onUserOffline(({ userId }) => {
      console.log('User went offline via socket:', userId);
      setUserOffline(userId);
    });
  },

  /**
   * Cleanup socket event listeners
   */
  cleanupSocketListeners: () => {
    const socketService = SocketService.getInstance();
    console.log('Cleaning up socket listeners for presence');
    
    socketService.removeListener('user:online');
    socketService.removeListener('user:offline');
  },
}));

// Selector hooks for common use cases
export const useOnlineUsers = () => usePresenceStore((state) => state.getOnlineUsersList());
export const useIsUserOnline = (userId: string) => usePresenceStore((state) => state.isUserOnline(userId));
export const useOnlineUsersCount = () => usePresenceStore((state) => state.onlineUsers.size);