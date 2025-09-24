import { apiClient } from './api';
import type {
  AlertConfiguration,
  CreateAlertData,
  UpdateAlertData,
  AlertTestResult,
  AlertStats
} from '../types';

export const alertService = {
  // Get all alert configurations for the current user
  async getAlerts(): Promise<{ alerts: AlertConfiguration[]; count: number }> {
    const response = await apiClient.get<{ alerts: AlertConfiguration[]; count: number }>('/alerts');
    return response.data!;
  },

  // Get a specific alert configuration by ID
  async getAlert(id: string): Promise<AlertConfiguration> {
    const response = await apiClient.get<AlertConfiguration>(`/alerts/${id}`);
    return response.data!;
  },

  // Create a new alert configuration
  async createAlert(alertData: CreateAlertData): Promise<AlertConfiguration> {
    const response = await apiClient.post<AlertConfiguration>('/alerts', alertData);
    return response.data!;
  },

  // Update an existing alert configuration
  async updateAlert(id: string, alertData: UpdateAlertData): Promise<AlertConfiguration> {
    const response = await apiClient.put<AlertConfiguration>(`/alerts/${id}`, alertData);
    return response.data!;
  },

  // Delete an alert configuration
  async deleteAlert(id: string): Promise<void> {
    await apiClient.delete(`/alerts/${id}`);
  },

  // Toggle alert active status
  async toggleAlert(id: string): Promise<AlertConfiguration> {
    const response = await apiClient.patch<AlertConfiguration>(`/alerts/${id}/toggle`);
    return response.data!;
  },

  // Test an alert configuration against existing tenders
  async testAlert(id: string, limit: number = 10): Promise<AlertTestResult> {
    const response = await apiClient.post<AlertTestResult>(`/alerts/${id}/test?limit=${limit}`);
    return response.data!;
  },

  // Send test email for an alert configuration
  async sendTestEmail(id: string): Promise<{ success: boolean; messageId: string }> {
    const response = await apiClient.post<{ success: boolean; messageId: string }>(`/alerts/${id}/send-test-email`);
    return response.data!;
  },

  // Get alert statistics and summary
  async getAlertStats(): Promise<AlertStats> {
    const response = await apiClient.get<AlertStats>('/alerts/stats');
    return response.data!;
  }
};