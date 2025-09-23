import { apiClient, TokenManager } from './api';
import type { 
  User, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  UpdateProfileData, 
  ChangePasswordData 
} from '../types';

class AuthService {
  // Authentication methods
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('🚀 AuthService.login called with:', {
      email: credentials.email,
      hasPassword: !!credentials.password,
      timestamp: new Date().toISOString()
    });

    try {
      console.log('📤 Making login API request to /auth/login');
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
      
      console.log('📥 Login API response received:', {
        success: response.success,
        hasData: !!response.data,
        hasToken: !!(response.data?.token),
        tokenInRoot: !!response.token,
        message: response.message || 'No message',
        dataKeys: response.data ? Object.keys(response.data) : [],
        rootKeys: Object.keys(response)
      });
      
      // The token might be in response.data.token OR response.token
      const token = response.data?.token || (response as any).token;
      if (response.success && token) {
        console.log('🔑 Setting token in storage');
        TokenManager.setToken(token, response.data?.refreshToken);
        console.log('✅ Token stored successfully');
      } else {
        console.error('❌ No token in response:', response);
      }
      
      return response.data!;
    } catch (error) {
      console.error('❌ Login API request failed:', error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    
    if (response.success && response.data?.token) {
      TokenManager.setToken(response.data.token);
    }
    
    return response.data!;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      TokenManager.removeToken();
    }
  }

  // User management
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data!.user;
  }

  async updateProfile(userData: UpdateProfileData): Promise<User> {
    const response = await apiClient.put<{ user: User }>('/auth/profile', userData);
    return response.data!.user;
  }

  async changePassword(passwordData: ChangePasswordData): Promise<void> {
    await apiClient.put('/auth/change-password', passwordData);
  }

  // Password reset
  async forgotPassword(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<void> {
    await apiClient.put('/auth/reset-password', { token, password });
  }

  // Social login methods
  async googleLogin(credential: string): Promise<AuthResponse> {
    console.log('🚀 AuthService.googleLogin called');

    try {
      const response = await apiClient.post<AuthResponse>('/auth/google', {
        credential
      });

      if (response.success && response.data?.token) {
        TokenManager.setToken(response.data.token, response.data?.refreshToken);
      }

      return response.data!;
    } catch (error) {
      console.error('❌ Google login failed:', error);
      throw error;
    }
  }

  async facebookLogin(accessToken: string, userID: string): Promise<AuthResponse> {
    console.log('🚀 AuthService.facebookLogin called');

    try {
      const response = await apiClient.post<AuthResponse>('/auth/facebook', {
        accessToken,
        userID
      });

      if (response.success && response.data?.token) {
        TokenManager.setToken(response.data.token, response.data?.refreshToken);
      }

      return response.data!;
    } catch (error) {
      console.error('❌ Facebook login failed:', error);
      throw error;
    }
  }

  // Utility methods
  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  }

  getToken(): string | null {
    return TokenManager.getToken();
  }

}

export const authService = new AuthService();