import { useMessagesStore } from '../store';

// Hook for handling incoming messages - now uses Zustand store
export const useMessages = () => {
  const messages = useMessagesStore((state) => state.messages);
  const typing = useMessagesStore((state) => state.typing);
  const isLoading = useMessagesStore((state) => state.isLoading);
  const error = useMessagesStore((state) => state.error);
  
  const addMessage = useMessagesStore((state) => state.addMessage);
  const clearMessages = useMessagesStore((state) => state.clearMessages);
  const sendMessage = useMessagesStore((state) => state.sendMessage);
  const markMessageAsRead = useMessagesStore((state) => state.markMessageAsRead);

  return {
    messages,
    typing,
    isLoading,
    error,
    addMessage,
    clearMessages,
    sendMessage,
    markMessageAsRead,
  };
};