import { apiClient } from './api';
import type { 
  Tender, 
  TenderQueryParams, 
  CreateTenderData, 
  TenderStats,
  PaginatedResponse 
} from '../types';

class TenderService {
  // Get tenders with filtering and pagination
  async getTenders(params: TenderQueryParams = {}): Promise<PaginatedResponse<Tender>> {
    const queryString = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, value.toString());
      }
    });

    const response = await apiClient.get<{
      tenders: Tender[];
      pagination: {
        current: number;
        total: number;
        count: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/tenders?${queryString.toString()}`);
    
    return {
      success: response.success,
      data: {
        items: response.data!.tenders,
        pagination: response.data!.pagination,
      },
    };
  }

  // Get single tender by ID
  async getTender(id: string): Promise<Tender> {
    const response = await apiClient.get<{ tender: Tender }>(`/tenders/${id}`);
    return response.data!.tender;
  }

  // Create new tender
  async createTender(tenderData: CreateTenderData): Promise<Tender> {
    const response = await apiClient.post<{ tender: Tender }>('/tenders', tenderData);
    return response.data!.tender;
  }

  // Update tender
  async updateTender(id: string, tenderData: Partial<CreateTenderData>): Promise<Tender> {
    const response = await apiClient.put<{ tender: Tender }>(`/tenders/${id}`, tenderData);
    return response.data!.tender;
  }

  // Delete tender
  async deleteTender(id: string): Promise<void> {
    await apiClient.delete(`/tenders/${id}`);
  }

  // Get tender statistics
  async getTenderStats(): Promise<TenderStats> {
    const response = await apiClient.get<TenderStats>('/tenders/stats');
    return response.data!;
  }

  // Get user's own tenders
  async getMyTenders(params: TenderQueryParams = {}): Promise<PaginatedResponse<Tender>> {
    const queryString = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, value.toString());
      }
    });

    const response = await apiClient.get<{
      tenders: Tender[];
      pagination: {
        current: number;
        total: number;
        count: number;
        totalCount: number;
        hasNext: boolean;
        hasPrev: boolean;
      };
    }>(`/tenders/user/my-tenders?${queryString.toString()}`);
    
    return {
      success: response.success,
      data: {
        items: response.data!.tenders,
        pagination: response.data!.pagination,
      },
    };
  }

}

export const tenderService = new TenderService();