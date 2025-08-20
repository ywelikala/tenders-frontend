import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tenderService } from '../services/tenderService';
import type { Tender, TenderQueryParams, TenderStats, CreateTenderData } from '../types';
import { useToast } from './use-toast';

// Query keys
export const tenderKeys = {
  all: ['tenders'] as const,
  lists: () => [...tenderKeys.all, 'list'] as const,
  list: (params: TenderQueryParams) => [...tenderKeys.lists(), { params }] as const,
  details: () => [...tenderKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenderKeys.details(), id] as const,
  stats: () => [...tenderKeys.all, 'stats'] as const,
  myTenders: (params: TenderQueryParams) => [...tenderKeys.all, 'my-tenders', { params }] as const,
};

// Hooks for tenders
export const useTenders = (params: TenderQueryParams = {}) => {
  return useQuery({
    queryKey: tenderKeys.list(params),
    queryFn: () => tenderService.getTenders(params),
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

export const useTender = (id: string) => {
  return useQuery({
    queryKey: tenderKeys.detail(id),
    queryFn: () => tenderService.getTender(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};

export const useTenderStats = () => {
  return useQuery({
    queryKey: tenderKeys.stats(),
    queryFn: () => tenderService.getTenderStats(),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
};

export const useMyTenders = (params: TenderQueryParams = {}) => {
  return useQuery({
    queryKey: tenderKeys.myTenders(params),
    queryFn: () => tenderService.getMyTenders(params),
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
};

// Mutations for tenders
export const useCreateTender = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (tenderData: CreateTenderData) => tenderService.createTender(tenderData),
    onSuccess: (newTender) => {
      // Invalidate and refetch tender lists
      queryClient.invalidateQueries({ queryKey: tenderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenderKeys.stats() });
      
      toast({
        title: "Success",
        description: "Tender created successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tender.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateTender = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTenderData> }) => 
      tenderService.updateTender(id, data),
    onSuccess: (updatedTender) => {
      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: tenderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenderKeys.detail(updatedTender._id) });
      queryClient.invalidateQueries({ queryKey: tenderKeys.stats() });
      
      toast({
        title: "Success",
        description: "Tender updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update tender.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteTender = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => tenderService.deleteTender(id),
    onSuccess: () => {
      // Invalidate and refetch tender lists
      queryClient.invalidateQueries({ queryKey: tenderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenderKeys.stats() });
      
      toast({
        title: "Success",
        description: "Tender deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete tender.",
        variant: "destructive",
      });
    },
  });
};

