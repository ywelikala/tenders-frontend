import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';
import type { 
  LoginCredentials, 
  RegisterData, 
  UpdateProfileData, 
  ChangePasswordData,
  User 
} from '../types';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

// Query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
};

// Hooks for authentication
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      console.log('🔍 Fetching current user...');
      const user = await authService.getCurrentUser();
      console.log('✅ Current user fetched successfully:', user);
      return user;
    },
    enabled: authService.isAuthenticated(),
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    retry: (failureCount, error: any) => {
      console.log('⚠️ useCurrentUser retry attempt:', failureCount, error);
      // Don't retry if it's an authentication error
      if (error?.status === 401 || error?.message?.includes('Unauthorized')) {
        console.log('❌ Authentication error - clearing tokens');
        // Clear tokens on auth failure
        authService.logout();
        return false;
      }
      return failureCount < 3;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

// Mutations for authentication
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: async (authResponse) => {
      console.log('🎉 Login mutation onSuccess called with:', authResponse);
      
      // Invalidate and refetch user data to ensure it's up to date
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });
      
      // Set user data in cache if available
      if (authResponse.user) {
        queryClient.setQueryData(authKeys.user(), authResponse.user);
        console.log('👤 User data set in cache:', authResponse.user);
      }
      
      toast({
        title: "Success",
        description: "Successfully logged in!",
      });
      
      // Navigate to tenders page
      navigate('/tenders');
    },
    onError: (error: Error) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (authResponse) => {
      // Set user data in cache
      queryClient.setQueryData(authKeys.user(), authResponse.user);
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      
      // Navigate to tenders page
      navigate('/tenders');
    },
    onError: (error: Error) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      toast({
        title: "Success",
        description: "Successfully logged out!",
      });
      
      // Navigate to home page
      navigate('/');
    },
    onError: (error: Error) => {
      // Still clear cache even if logout API fails
      queryClient.clear();
      navigate('/');
      
      console.error('Logout error:', error);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userData: UpdateProfileData) => authService.updateProfile(userData),
    onSuccess: (updatedUser) => {
      // Update user data in cache
      queryClient.setQueryData(authKeys.user(), updatedUser);
      
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive",
      });
    },
  });
};

export const useChangePassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (passwordData: ChangePasswordData) => authService.changePassword(passwordData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password changed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password.",
        variant: "destructive",
      });
    },
  });
};

export const useForgotPassword = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (email: string) => authService.forgotPassword(email),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset email sent. Check your inbox.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Request Failed",
        description: error.message || "Failed to send password reset email.",
        variant: "destructive",
      });
    },
  });
};

export const useResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      authService.resetPassword(token, password),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Password reset successfully. Please log in with your new password.",
      });

      navigate('/login');
    },
    onError: (error: Error) => {
      toast({
        title: "Reset Failed",
        description: error.message || "Failed to reset password.",
        variant: "destructive",
      });
    },
  });
};

// Social login hooks
export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credential: string) => authService.googleLogin(credential),
    onSuccess: async (authResponse) => {
      console.log('🎉 Google login successful:', authResponse);

      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // Set user data in cache
      if (authResponse.user) {
        queryClient.setQueryData(authKeys.user(), authResponse.user);
      }

      toast({
        title: "Success",
        description: "Successfully logged in with Google!",
      });

      navigate('/tenders');
    },
    onError: (error: Error) => {
      toast({
        title: "Google Login Failed",
        description: error.message || "Failed to log in with Google.",
        variant: "destructive",
      });
    },
  });
};

