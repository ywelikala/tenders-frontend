import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { alertService } from '../services/alertService';
import { useToast } from './use-toast';
import type {
  AlertConfiguration,
  CreateAlertData,
  UpdateAlertData,
  AlertTestResult,
  AlertStats
} from '../types';

// Query keys
export const alertKeys = {
  all: ['alerts'] as const,
  lists: () => [...alertKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...alertKeys.lists(), { filters }] as const,
  details: () => [...alertKeys.all, 'detail'] as const,
  detail: (id: string) => [...alertKeys.details(), id] as const,
  stats: () => [...alertKeys.all, 'stats'] as const,
  test: (id: string) => [...alertKeys.all, 'test', id] as const,
};

// Hooks for alert data
export const useAlerts = () => {
  return useQuery({
    queryKey: alertKeys.lists(),
    queryFn: () => alertService.getAlerts(),
    staleTime: 300000, // 5 minutes
    gcTime: 600000, // 10 minutes
    retry: (failureCount, error: any) => {
      // Don't retry if it's a permission error
      if (error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
  });
};

export const useAlert = (id: string, enabled = true) => {
  return useQuery({
    queryKey: alertKeys.detail(id),
    queryFn: () => alertService.getAlert(id),
    enabled: enabled && !!id,
    staleTime: 300000,
    gcTime: 600000,
  });
};

export const useAlertStats = () => {
  return useQuery({
    queryKey: alertKeys.stats(),
    queryFn: () => alertService.getAlertStats(),
    staleTime: 600000, // 10 minutes
    gcTime: 900000, // 15 minutes
  });
};

// Mutations for alert management
export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (alertData: CreateAlertData) => alertService.createAlert(alertData),
    onSuccess: (newAlert) => {
      // Invalidate and refetch alerts list
      queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
      queryClient.invalidateQueries({ queryKey: alertKeys.stats() });

      // Add the new alert to the cache
      queryClient.setQueryData(alertKeys.detail(newAlert._id), newAlert);

      toast({
        title: "Success",
        description: "Alert configuration created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Alert",
        description: error.message || "Failed to create alert configuration.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAlertData }) =>
      alertService.updateAlert(id, data),
    onSuccess: (updatedAlert) => {
      // Update the alert in the cache
      queryClient.setQueryData(alertKeys.detail(updatedAlert._id), updatedAlert);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
      queryClient.invalidateQueries({ queryKey: alertKeys.stats() });

      toast({
        title: "Success",
        description: "Alert configuration updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Alert",
        description: error.message || "Failed to update alert configuration.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => alertService.deleteAlert(id),
    onSuccess: (_, deletedId) => {
      // Remove the alert from the cache
      queryClient.removeQueries({ queryKey: alertKeys.detail(deletedId) });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
      queryClient.invalidateQueries({ queryKey: alertKeys.stats() });

      toast({
        title: "Success",
        description: "Alert configuration deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Delete Alert",
        description: error.message || "Failed to delete alert configuration.",
        variant: "destructive",
      });
    },
  });
};

export const useToggleAlert = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => alertService.toggleAlert(id),
    onSuccess: (updatedAlert) => {
      // Update the alert in the cache
      queryClient.setQueryData(alertKeys.detail(updatedAlert._id), updatedAlert);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: alertKeys.lists() });
      queryClient.invalidateQueries({ queryKey: alertKeys.stats() });

      toast({
        title: "Success",
        description: `Alert ${updatedAlert.isActive ? 'activated' : 'deactivated'} successfully!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Toggle Alert",
        description: error.message || "Failed to toggle alert status.",
        variant: "destructive",
      });
    },
  });
};

export const useTestAlert = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, limit }: { id: string; limit?: number }) =>
      alertService.testAlert(id, limit),
    onSuccess: (result) => {
      toast({
        title: "Alert Test Complete",
        description: `Found ${result.matchCount} matching tenders out of ${result.totalTested} tested.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Alert Test Failed",
        description: error.message || "Failed to test alert configuration.",
        variant: "destructive",
      });
    },
  });
};

export const useSendTestEmail = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => alertService.sendTestEmail(id),
    onSuccess: (result) => {
      toast({
        title: "Test Email Sent",
        description: "A test email has been sent to your configured email address.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Test Email",
        description: error.message || "Failed to send test email.",
        variant: "destructive",
      });
    },
  });
};