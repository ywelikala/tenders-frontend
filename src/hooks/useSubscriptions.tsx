import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';
import type { SubscriptionPlan } from '../types';
import { useToast } from './use-toast';

// Query keys
export const subscriptionKeys = {
  all: ['subscriptions'] as const,
  plans: () => [...subscriptionKeys.all, 'plans'] as const,
  current: () => [...subscriptionKeys.all, 'current'] as const,
};

// Hooks for subscriptions
export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: subscriptionKeys.plans(),
    queryFn: () => subscriptionService.getPlans(),
    staleTime: 600000, // 10 minutes
    gcTime: 1800000, // 30 minutes
  });
};

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.current(),
    queryFn: () => subscriptionService.getCurrentSubscription(),
    staleTime: 300000, // 5 minutes
    gcTime: 900000, // 15 minutes
  });
};

// Mutations for subscriptions
export const useSubscribe = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (planId: string) => subscriptionService.subscribe(planId),
    onSuccess: () => {
      // Invalidate subscription queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
      
      toast({
        title: "Success",
        description: "Successfully subscribed to the plan!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to subscribe to the plan.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (planId: string) => subscriptionService.updateSubscription(planId),
    onSuccess: () => {
      // Invalidate subscription queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
      
      toast({
        title: "Success",
        description: "Subscription updated successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update subscription.",
        variant: "destructive",
      });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => subscriptionService.cancelSubscription(),
    onSuccess: () => {
      // Invalidate subscription queries
      queryClient.invalidateQueries({ queryKey: subscriptionKeys.current() });
      
      toast({
        title: "Success",
        description: "Subscription cancelled successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Cancellation Failed",
        description: error.message || "Failed to cancel subscription.",
        variant: "destructive",
      });
    },
  });
};