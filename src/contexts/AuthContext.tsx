import React, { createContext, useContext, ReactNode } from 'react';
import { useCurrentUser, useLogin, useRegister, useLogout } from '../hooks/useAuth';
import type { User, LoginCredentials, RegisterData } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Use React Query hooks for authentication
  const { data: user, isLoading: loading } = useCurrentUser();
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

  const login = async (credentials: LoginCredentials) => {
    console.log('🎯 AuthContext.login called with:', {
      email: credentials.email,
      hasPassword: !!credentials.password,
      timestamp: new Date().toISOString()
    });
    
    try {
      console.log('📞 Using login mutation...');
      await loginMutation.mutateAsync(credentials);
      console.log('✅ Login mutation completed successfully');
    } catch (error) {
      console.error('❌ AuthContext.login failed:', error);
      throw error;
    }
  };

  const register = async (userData: RegisterData) => {
    await registerMutation.mutateAsync(userData);
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const updateUser = (userData: Partial<User>) => {
    // This will be handled by React Query cache updates
    console.log('Update user called with:', userData);
  };

  const value: AuthContextType = {
    user: user || null,
    loading: loading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};