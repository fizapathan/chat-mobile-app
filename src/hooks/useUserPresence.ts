import { usePresenceStore, useOnlineUsers, useIsUserOnline, useOnlineUsersCount } from '../store';

// Hook for handling user presence - now uses Zustand store
export const useUserPresence = () => {
  const onlineUsers = useOnlineUsers();
  const isUserOnline = usePresenceStore((state) => state.isUserOnline);
  const setUserOnline = usePresenceStore((state) => state.setUserOnline);
  const setUserOffline = usePresenceStore((state) => state.setUserOffline);
  const clearOnlineUsers = usePresenceStore((state) => state.clearOnlineUsers);
  const onlineUsersCount = useOnlineUsersCount();

  return {
    onlineUsers,
    onlineUsersCount,
    isUserOnline,
    setUserOnline,
    setUserOffline,
    clearOnlineUsers,
  };
};

export { useOnlineUsers, useIsUserOnline, useOnlineUsersCount };