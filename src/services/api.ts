// API configuration and base setup
// Get API URL from environment configuration
declare global {
  interface Window {
    ENV?: {
      API_BASE_URL: string;
      APP_NAME: string;
      APP_VERSION: string;
      NODE_ENV: string;
    };
  }
}

const getApiBaseUrl = (): string => {
  // Check if window.ENV is available (injected by Docker or config.js)
  if (window.ENV?.API_BASE_URL) {
    return window.ENV.API_BASE_URL;
  }
  
  // Fallback to environment variables for Vite development
  const envApiUrl = import.meta.env.VITE_API_BASE_URL;
  if (envApiUrl) {
    return envApiUrl;
  }
  
  // Default fallback
  return 'https://lankatender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      current: number;
      total: number;
      count: number;
      totalCount: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}

// Auth token management with refresh token support
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  static getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token && this.isTokenExpired()) {
      // Token is expired, clear it
      this.removeToken();
      return null;
    }
    return token;
  }

  static setToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
    
    // Decode JWT and set expiry (simple decode, not verification)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp) {
        localStorage.setItem(this.TOKEN_EXPIRY_KEY, payload.exp.toString());
      }
    } catch (error) {
      console.warn('Failed to parse JWT token:', error);
    }
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  static isTokenExpired(): boolean {
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);
    if (!expiry) return false;
    
    const expiryTime = parseInt(expiry) * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const bufferTime = 5 * 60 * 1000; // 5 minutes buffer
    
    return currentTime >= (expiryTime - bufferTime);
  }

  static shouldRefreshToken(): boolean {
    return this.isTokenExpired() && !!this.getRefreshToken();
  }
}

// HTTP client with authentication
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const token = TokenManager.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('🌐 ApiClient making request:', {
      method: options.method || 'GET',
      url: url,
      hasToken: !!token,
      hasBody: !!options.body,
      headers: config.headers,
      timestamp: new Date().toISOString()
    });

    try {
      console.log('⏳ Sending fetch request...');
      const response = await fetch(url, config);
      
      console.log('📡 Fetch response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      const data = await response.json();
      console.log('📄 Response data parsed:', data);

      if (!response.ok) {
        console.error('❌ HTTP error response:', { status: response.status, data });
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('❌ API request failed:', {
        url,
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  async upload<T>(endpoint: string, formData: FormData): Promise<ApiResponse<T>> {
    const token = TokenManager.getToken();
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

export { apiClient, TokenManager };