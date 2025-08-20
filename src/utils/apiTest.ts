import { apiClient } from '../services/api';
import { authService } from '../services/authService';
import { tenderService } from '../services/tenderService';
import { subscriptionService } from '../services/subscriptionService';

// Test interface for API connectivity
interface ApiTestResult {
  endpoint: string;
  success: boolean;
  status: number;
  message: string;
  duration: number;
  timestamp: string;
}

class ApiTester {
  private results: ApiTestResult[] = [];

  private async testEndpoint(
    name: string,
    testFn: () => Promise<any>
  ): Promise<ApiTestResult> {
    const startTime = Date.now();
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      
      const result: ApiTestResult = {
        endpoint: name,
        success: true,
        status: 200,
        message: 'Success',
        duration,
        timestamp: new Date().toISOString(),
      };
      
      this.results.push(result);
      return result;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      const result: ApiTestResult = {
        endpoint: name,
        success: false,
        status: error.status || 0,
        message: error.message || 'Unknown error',
        duration,
        timestamp: new Date().toISOString(),
      };
      
      this.results.push(result);
      return result;
    }
  }

  // Test backend health endpoint
  async testHealth(): Promise<ApiTestResult> {
    return this.testEndpoint('Health Check', async () => {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      return response.json();
    });
  }

  // Test authentication endpoints
  async testAuthEndpoints(): Promise<ApiTestResult[]> {
    const tests: Promise<ApiTestResult>[] = [];
    
    // Test login endpoint (should fail without credentials)
    tests.push(
      this.testEndpoint('Auth - Login (validation)', async () => {
        try {
          await authService.login({ email: '', password: '' });
          throw new Error('Should have failed validation');
        } catch (error) {
          if (error instanceof Error && error.message.includes('validation')) {
            return; // Expected validation error
          }
          throw error;
        }
      })
    );

    // Test register endpoint (should fail without valid data)
    tests.push(
      this.testEndpoint('Auth - Register (validation)', async () => {
        try {
          await authService.register({
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            role: 'supplier'
          });
          throw new Error('Should have failed validation');
        } catch (error) {
          if (error instanceof Error && error.message.includes('validation')) {
            return; // Expected validation error
          }
          throw error;
        }
      })
    );

    return Promise.all(tests);
  }

  // Test tender endpoints
  async testTenderEndpoints(): Promise<ApiTestResult[]> {
    const tests: Promise<ApiTestResult>[] = [];
    
    // Test get tenders
    tests.push(
      this.testEndpoint('Tenders - Get List', async () => {
        return tenderService.getTenders({ page: 1, limit: 5 });
      })
    );

    // Test get tender stats
    tests.push(
      this.testEndpoint('Tenders - Get Stats', async () => {
        return tenderService.getTenderStats();
      })
    );

    return Promise.all(tests);
  }

  // Test subscription endpoints
  async testSubscriptionEndpoints(): Promise<ApiTestResult[]> {
    const tests: Promise<ApiTestResult>[] = [];
    
    // Test get subscription plans
    tests.push(
      this.testEndpoint('Subscriptions - Get Plans', async () => {
        return subscriptionService.getPlans();
      })
    );

    return Promise.all(tests);
  }

  // Test file endpoints
  async testFileEndpoints(): Promise<ApiTestResult[]> {
    const tests: Promise<ApiTestResult>[] = [];
    
    // Test file upload endpoint (should fail without auth)
    tests.push(
      this.testEndpoint('Files - Upload (auth required)', async () => {
        try {
          const formData = new FormData();
          const response = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (response.status === 401) {
            return; // Expected - auth required
          }
          
          throw new Error(`Unexpected status: ${response.status}`);
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            return; // Expected - auth required
          }
          throw error;
        }
      })
    );

    return Promise.all(tests);
  }

  // Run all tests
  async runAllTests(): Promise<{
    results: ApiTestResult[];
    summary: {
      total: number;
      passed: number;
      failed: number;
      successRate: number;
      averageDuration: number;
    };
  }> {
    console.log('🧪 Starting API Integration Tests...');
    this.results = [];

    try {
      // Test health
      await this.testHealth();
      
      // Test all endpoints
      await Promise.all([
        ...await this.testAuthEndpoints(),
        ...await this.testTenderEndpoints(),
        ...await this.testSubscriptionEndpoints(),
        ...await this.testFileEndpoints(),
      ]);
    } catch (error) {
      console.error('Test execution error:', error);
    }

    // Calculate summary
    const total = this.results.length;
    const passed = this.results.filter(r => r.success).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total) * 100 : 0;
    const averageDuration = total > 0 
      ? this.results.reduce((sum, r) => sum + r.duration, 0) / total 
      : 0;

    const summary = {
      total,
      passed,
      failed,
      successRate: Math.round(successRate * 100) / 100,
      averageDuration: Math.round(averageDuration),
    };

    console.log('📊 API Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${summary.successRate}%`);
    console.log(`⏱️ Average Duration: ${summary.averageDuration}ms`);

    if (failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`  - ${r.endpoint}: ${r.message} (${r.status})`);
        });
    }

    return {
      results: this.results,
      summary,
    };
  }

  // Get test results
  getResults(): ApiTestResult[] {
    return this.results;
  }

  // Clear results
  clearResults(): void {
    this.results = [];
  }
}

// Export singleton instance
export const apiTester = new ApiTester();

// Convenience function to run tests
export const runApiTests = () => apiTester.runAllTests();

// Development helper to add to window object
if (process.env.NODE_ENV === 'development') {
  (window as any).runApiTests = runApiTests;
  (window as any).apiTester = apiTester;
}