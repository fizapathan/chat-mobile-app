// Export all stores
export { useAuthStore } from './authStore';
export { useMessagesStore } from './messagesStore';
export { usePresenceStore, useOnlineUsers, useIsUserOnline, useOnlineUsersCount } from './presenceStore';
export { useUsersStore, getUsers } from './usersStore';

// Store initialization helper
import { useAuthStore } from './authStore';
import { useMessagesStore } from './messagesStore';
import { usePresenceStore } from './presenceStore';
import { useUsersStore } from './usersStore';

/**
 * Initialize all stores - call this when app starts
 */
export const initializeStores = async () => {
  console.log('Initializing all stores...');
  
  try {
    // Initialize auth store
    await useAuthStore.getState().initialize();
        
    console.log('All stores initialized successfully');
  } catch (error) {
    console.error('Store initialization failed:', error);
  }
};

export const setupSocketListeners = () => {
  // socket listeners for users
  useUsersStore.getState().setupSocketListeners();
  // socket listeners for messages and presence
  useMessagesStore.getState().setupSocketListeners();
  usePresenceStore.getState().setupSocketListeners();
};

/**
 * Cleanup all stores - call this when app is closing
 */
export const cleanupStores = () => {
  console.log('Cleaning up all stores...');
  
  // Cleanup socket listeners
  useUsersStore.getState().cleanupSocketListeners();
  useMessagesStore.getState().cleanupSocketListeners();
  usePresenceStore.getState().cleanupSocketListeners();
  
  // Clear store data
  useMessagesStore.getState().clearMessages();
  usePresenceStore.getState().clearOnlineUsers();
  
  console.log('All stores cleaned up');
};