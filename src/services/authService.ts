import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient, API_CONFIG, handleApiResponse, handleApiError } from './api';
import {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  RefreshTokenRequest,
  User,
} from '../types/api';

export class AuthService {
  static getUrlPrefix() {
    return '/auth';
  }

  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(this.getUrlPrefix() + '/login', credentials);
      const authData = handleApiResponse(response);
      
      // Store auth data locally
      await this.storeAuthData(authData);
      
      return authData;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Register new user
   */
  static async signup(userData: SignupRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>(this.getUrlPrefix() + '/signup', userData);
      const authData = handleApiResponse(response);
      
      // Store auth data locally
      await this.storeAuthData(authData);
      
      return authData;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Logout user and clear local storage
   */
  static async logout(): Promise<void> {
    // try {
    //   // Call logout endpoint to invalidate token on server
    //   await apiClient.post('/logout');
    // } catch (error) {
    //   // Continue with logout even if server call fails
    //   console.warn('Logout API call failed:', handleApiError(error));
    // } finally {
      // Always clear local storage
      await this.clearAuthData();
    // }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(): Promise<AuthResponse> {
    try {
      const refreshToken = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<AuthResponse>(this.getUrlPrefix() + '/refresh', {
        refreshToken,
      } as RefreshTokenRequest);
      
      const authData = handleApiResponse(response);
      
      // Update stored auth data
      await this.storeAuthData(authData);
      
      return authData;
    } catch (error) {
      // If refresh fails, clear auth data
      await this.clearAuthData();
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>(this.getUrlPrefix() + '/me');
      return handleApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await apiClient.put<User>(this.getUrlPrefix() + '/profile', userData);
      const updatedUser = handleApiResponse(response);
      
      // Update stored user data
      await AsyncStorage.setItem(
        API_CONFIG.STORAGE_KEYS.USER_DATA,
        JSON.stringify(updatedUser)
      );
      
      return updatedUser;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get stored user data
   */
  static async getStoredUser(): Promise<User | null> {
    try {
      const userDataString = await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.USER_DATA);
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  static async getStoredToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(API_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      return null;
    }
  }

  /**
   * Store authentication data locally
   */
  private static async storeAuthData(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [API_CONFIG.STORAGE_KEYS.AUTH_TOKEN, authData.token],
        [API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken],
        [API_CONFIG.STORAGE_KEYS.USER_DATA, JSON.stringify(authData.user)],
      ]);
    } catch (error) {
      console.error('Failed to store auth data:', error);
      throw new Error('Failed to store authentication data');
    }
  }

  /**
   * Clear all authentication data from local storage
   */
  private static async clearAuthData(): Promise<void> {
    try {
      console.log('Clearing authentication data from storage');
      await AsyncStorage.multiRemove([
        API_CONFIG.STORAGE_KEYS.AUTH_TOKEN,
        API_CONFIG.STORAGE_KEYS.REFRESH_TOKEN,
        API_CONFIG.STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }
}