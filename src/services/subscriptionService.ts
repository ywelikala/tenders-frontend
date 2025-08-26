import { apiClient } from './api';
import type { SubscriptionPlan, UserSubscription } from '../types';

class SubscriptionService {
  // Get all subscription plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    const response = await apiClient.get<{ plans: SubscriptionPlan[] }>('/subscriptions/plans');
    return response.data!.plans;
  }

  // Get user's current subscription
  async getUserSubscription(): Promise<UserSubscription | null> {
    try {
      const response = await apiClient.get<{ subscription: UserSubscription }>('/subscriptions/user/current');
      return response.data!.subscription;
    } catch (error: any) {
      if (error.status === 404) {
        return null; // User has no subscription
      }
      throw error;
    }
  }

  // Subscribe to a plan
  async subscribeToPlan(planName: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<UserSubscription> {
    const response = await apiClient.post<{ subscription: UserSubscription }>('/subscriptions/user/subscribe', {
      plan: planName,
      billingCycle,
    });
    return response.data!.subscription;
  }

  // Cancel subscription
  async cancelSubscription(reason?: string): Promise<void> {
    await apiClient.post('/subscriptions/user/cancel', { reason });
  }

  // Update subscription (upgrade/downgrade)
  async updateSubscription(planName: string, billingCycle?: 'monthly' | 'yearly'): Promise<UserSubscription> {
    const response = await apiClient.put<{ subscription: UserSubscription }>('/subscriptions/user/update', {
      plan: planName,
      billingCycle,
    });
    return response.data!.subscription;
  }

  // Get subscription usage
  async getUsage(): Promise<{
    tenderViews: number;
    tenderUploads: number;
    documentsDownloaded: number;
    apiCalls: number;
  }> {
    const response = await apiClient.get<{
      usage: {
        tenderViews: number;
        tenderUploads: number;
        documentsDownloaded: number;
        apiCalls: number;
      };
    }>('/subscriptions/user/usage');
    return response.data!.usage;
  }

  // Create Stripe checkout session
  async createCheckoutSession(planId: string, stripePriceId: string): Promise<{ url: string }> {
    const response = await apiClient.post<{ url: string }>('/subscriptions/create-checkout-session', {
      planId,
      priceId: stripePriceId
    });
    return response.data!;
  }

  // Verify Stripe session
  async verifySession(sessionId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.get<{ success: boolean; message: string }>(`/subscriptions/verify-session/${sessionId}`);
    return response.data!;
  }

  // Mock data for development (fallback when backend is not available)
  private getMockPlans(): SubscriptionPlan[] {
    return [
      {
        _id: 'plan-free',
        name: 'free',
        displayName: 'Free Plan',
        description: 'Basic access to tender listings',
        price: { monthly: 0, yearly: 0 },
        features: {
          maxTenderViews: 10,
          canUploadTenders: false,
          maxTenderUploads: 0,
          advancedFiltering: false,
          emailAlerts: false,
          apiAccess: false,
          prioritySupport: false,
          customReports: false,
          savedSearches: 3,
        },
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'plan-basic',
        name: 'basic',
        displayName: 'Basic Plan',
        description: 'Enhanced access with basic features',
        price: { monthly: 2500, yearly: 25000 },
        features: {
          maxTenderViews: 100,
          canUploadTenders: true,
          maxTenderUploads: 10,
          advancedFiltering: true,
          emailAlerts: true,
          apiAccess: false,
          prioritySupport: false,
          customReports: false,
          savedSearches: 10,
        },
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'plan-premium',
        name: 'premium',
        displayName: 'Premium Plan',
        description: 'Full access with premium features',
        price: { monthly: 7500, yearly: 75000 },
        features: {
          maxTenderViews: 500,
          canUploadTenders: true,
          maxTenderUploads: 50,
          advancedFiltering: true,
          emailAlerts: true,
          apiAccess: true,
          prioritySupport: true,
          customReports: true,
          savedSearches: 50,
        },
        isActive: true,
        sortOrder: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        _id: 'plan-enterprise',
        name: 'enterprise',
        displayName: 'Enterprise Plan',
        description: 'Unlimited access with enterprise features',
        price: { monthly: 15000, yearly: 150000 },
        features: {
          maxTenderViews: -1, // Unlimited
          canUploadTenders: true,
          maxTenderUploads: -1, // Unlimited
          advancedFiltering: true,
          emailAlerts: true,
          apiAccess: true,
          prioritySupport: true,
          customReports: true,
          savedSearches: -1, // Unlimited
        },
        isActive: true,
        sortOrder: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Development mode methods (fallback when backend is not available)
  async getPlansMock(): Promise<SubscriptionPlan[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.getMockPlans();
  }

  async getUserSubscriptionMock(): Promise<UserSubscription | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock user subscription
    return {
      _id: 'sub-1',
      user: 'user-1',
      plan: 'free',
      status: 'active',
      billingCycle: 'monthly',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      usage: {
        currentPeriodStart: new Date().toISOString(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        tenderViews: 3,
        tenderUploads: 0,
        documentsDownloaded: 2,
        apiCalls: 0,
      },
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getUsageMock(): Promise<{
    tenderViews: number;
    tenderUploads: number;
    documentsDownloaded: number;
    apiCalls: number;
  }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      tenderViews: 3,
      tenderUploads: 0,
      documentsDownloaded: 2,
      apiCalls: 0,
    };
  }
}

export const subscriptionService = new SubscriptionService();