import { create } from 'zustand';
import { AuthService } from '../services';
import { User, LoginRequest, SignupRequest } from '../types/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (userData: SignupRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  checkAuthStatus: () => Promise<void>;
  initialize: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Actions
  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user,
      error: null 
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  /**
   * Initialize auth state on app start
   */
  initialize: async () => {
    const { checkAuthStatus } = get();
    await checkAuthStatus();
  },

  /**
   * Check authentication status
   */
  checkAuthStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const isAuthenticated = await AuthService.isAuthenticated();
      console.log("Auth status check:", isAuthenticated);
      
      if (isAuthenticated) {
        const storedUser = await AuthService.getStoredUser();
        set({
          user: storedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      set({
        error: 'Failed to check authentication status',
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      console.error('Auth status check failed:', error);
    }
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    try {
      set({ isLoading: true, error: null });
      console.log("Logging in with credentials:", credentials);
      
      const authResponse = await AuthService.login(credentials);
      
      set({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log("Login successful:", authResponse.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  signup: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      console.log("Signing up with data:", userData);
      
      const authResponse = await AuthService.signup(userData);
      
      set({
        user: authResponse.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      console.log("Signup successful:", authResponse.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      set({
        error: errorMessage,
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });
      console.error('Signup failed:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      
      await AuthService.logout();
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      console.log("Logout successful");
    } catch (error) {
      // Even if logout fails, clear local state
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      console.error('Logout failed:', error);
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async () => {
    try {
      const authResponse = await AuthService.refreshToken();
      
      set({
        user: authResponse.user,
        isAuthenticated: true,
        error: null,
      });
      
      console.log("Token refresh successful");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Token refresh failed';
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage,
      });
      console.error('Token refresh failed:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      
      const updatedUser = await AuthService.updateProfile(userData);
      
      set({
        user: updatedUser,
        isLoading: false,
        error: null,
      });
      
      console.log("Profile update successful:", updatedUser);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Profile update failed';
      set({
        error: errorMessage,
        isLoading: false,
      });
      console.error('Profile update failed:', error);
      throw error;
    }
  },
}));