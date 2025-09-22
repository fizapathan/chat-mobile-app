import { create } from 'zustand';
import { User, ConnectedUser } from '../types/api';
import { SocketService } from '../services';

interface UsersState {
  users: {
    connectedUsers: ConnectedUser[];
    nonConnectedUsers: User[];
  };
  setUsers: (users: { connectedUsers: ConnectedUser[]; nonConnectedUsers: User[] }) => void;
  setConnectedUsers: (users: ConnectedUser[]) => void;
  setNonConnectedUsers: (users: User[]) => void;
  addConnectedUser: (user: ConnectedUser) => void;
  removeConnectedUser: (userId: string) => void;
  updateUnreadCount: (userId: string, count: number) => void;
  updateLastMessage: (userId: string, message: string) => void;
  setupSocketListeners: () => void;
  cleanupSocketListeners: () => void;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: {
    connectedUsers: [],
    nonConnectedUsers: [],
  },
  setUsers: (users) => set({ users }),
  setConnectedUsers: (connectedUsers) =>
    set((state) => ({
      users: { ...state.users, connectedUsers },
    })),
  setNonConnectedUsers: (nonConnectedUsers) =>
    set((state) => ({
      users: { ...state.users, nonConnectedUsers },
    })),
  addConnectedUser: (user) =>
    set((state) => ({
      users: {
        ...state.users,
        connectedUsers: [...state.users.connectedUsers, user],
      },
    })),
  removeConnectedUser: (userId) =>
    set((state) => ({
      users: {
        ...state.users,
        connectedUsers: state.users.connectedUsers.filter(
          (cu) => cu.user.id !== userId
        ),
      },
    })),
  updateUnreadCount: (userId, count) =>
    set((state) => ({
      users: {
        ...state.users,
        connectedUsers: state.users.connectedUsers.map((cu) =>
          cu.user.id === userId ? { ...cu, unreadCount: count } : cu
        ),
      },
    })),
  updateLastMessage: (userId, message) =>
    set((state) => ({
      users: {
        ...state.users,
        connectedUsers: state.users.connectedUsers.map((cu) =>
          cu.user.id === userId ? { ...cu, lastMessage: message } : cu
        ),
      },
    })),

  /**
   * Setup socket event listeners
   */
  setupSocketListeners: () => {
    const socketService = SocketService.getInstance();
    const { setUsers } = get();

    console.log('Setting up socket listeners for messages');

    // Listen for fetched users
    socketService.onUsersFetched(({ connectedUsers, nonConnectedUsers }) => {
      console.log('Received users via socket:', connectedUsers, nonConnectedUsers);
      setUsers({ connectedUsers, nonConnectedUsers });
    });
  },
  /**
   * Cleanup socket event listeners
   */
  cleanupSocketListeners: () => {
    const socketService = SocketService.getInstance();
    console.log('Cleaning up socket listeners for users');

    socketService.removeListener('users:received');
  },
}));


export const getUsers = () => useUsersStore((state) => state.users);