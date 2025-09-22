import { useAuthStore } from '../store';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const clearError = useAuthStore((state) => state.clearError);
  const checkAuthStatus = useAuthStore((state) => state.checkAuthStatus);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    refreshToken,
    updateProfile,
    clearError,
    checkAuthStatus,
  };
};