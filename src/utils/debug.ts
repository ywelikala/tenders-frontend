// Debug utilities for API testing
export const debugApi = {
  // Test basic connectivity to backend
  async testConnection() {
    console.log('🔍 Testing backend connection...');
    
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      
      console.log('✅ Backend connection successful:', data);
      return { success: true, data };
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return { success: false, error };
    }
  },

  // Test CORS
  async testCors() {
    console.log('🔍 Testing CORS...');
    
    try {
      const response = await fetch('/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ CORS test passed');
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      return { success: true };
    } catch (error) {
      console.error('❌ CORS test failed:', error);
      return { success: false, error };
    }
  },

  // Test login endpoint specifically
  async testLogin(email: string = 'test@example.com', password: string = 'test123') {
    console.log('🔍 Testing login endpoint...');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      console.log('📤 Login request sent');
      console.log('📥 Login response:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      
      return { success: response.ok, status: response.status, data };
    } catch (error) {
      console.error('❌ Login test failed:', error);
      return { success: false, error };
    }
  },

  // Test with apiClient
  async testWithApiClient() {
    console.log('🔍 Testing with ApiClient...');
    
    try {
      // Import dynamically to avoid circular dependencies
      const { apiClient } = await import('../services/api');
      
      const response = await apiClient.get('/health');
      console.log('✅ ApiClient test passed:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('❌ ApiClient test failed:', error);
      return { success: false, error };
    }
  },

  // Run all tests
  async runAllTests() {
    console.log('🧪 Running API debug tests...');
    console.log('=====================================');
    
    const results = {
      connection: await this.testConnection(),
      cors: await this.testCors(),
      login: await this.testLogin(),
      apiClient: await this.testWithApiClient(),
    };
    
    console.log('📊 Test Results Summary:');
    console.log('=====================================');
    Object.entries(results).forEach(([test, result]) => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${test}: ${result.success ? 'PASSED' : 'FAILED'}`);
      if (!result.success && result.error) {
        console.log(`   Error: ${result.error.message || result.error}`);
      }
    });
    
    return results;
  }
};

// Make available globally in development
if (process.env.NODE_ENV === 'development') {
  (window as any).debugApi = debugApi;
  console.log('🔧 Debug API tools available: window.debugApi');
  console.log('  - debugApi.runAllTests() - Run all connection tests');
  console.log('  - debugApi.testLogin() - Test login specifically');
  console.log('  - debugApi.testConnection() - Test basic connection');
}