import { test, expect } from '@playwright/test';

test.describe('Proxy Verification', () => {
  test('should verify Vite proxy is working correctly', async ({ page }) => {
    const apiRequests: any[] = [];
    const corsErrors: any[] = [];

    // Capture network requests
    page.on('request', request => {
      if (request.url().includes('/api/')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          isProxied: !request.url().includes('localhost:3000')
        });
        console.log(`🌐 API REQUEST: ${request.method()} ${request.url()}`);
      }
    });

    // Capture console errors for CORS issues
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('cors')) {
        corsErrors.push(msg.text());
        console.log(`🚨 CORS ERROR: ${msg.text()}`);
      }
    });

    // Navigate to the application
    console.log('📱 Navigating to application...');
    await page.goto('http://localhost:8082/');
    
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Test the debug API tools if available
    const debugResult = await page.evaluate(async () => {
      if ((window as any).debugApi) {
        console.log('🧪 Running debug API tests...');
        try {
          return await (window as any).debugApi.testConnection();
        } catch (error) {
          return { success: false, error: error.message };
        }
      } else {
        return { success: false, error: 'Debug API not available' };
      }
    });

    console.log('🧪 Debug API Test Result:', debugResult);

    // Wait for any additional requests
    await page.waitForTimeout(3000);

    // Analyze results
    console.log('\n📊 PROXY ANALYSIS:');
    console.log(`Total API requests captured: ${apiRequests.length}`);
    console.log(`CORS errors detected: ${corsErrors.length}`);

    if (apiRequests.length > 0) {
      apiRequests.forEach((req, index) => {
        const status = req.isProxied ? '✅ PROXIED' : '❌ DIRECT';
        console.log(`${index + 1}. ${status}: ${req.method} ${req.url}`);
      });

      // Check if requests are being proxied
      const proxiedRequests = apiRequests.filter(req => req.isProxied);
      const directRequests = apiRequests.filter(req => !req.isProxied);

      if (proxiedRequests.length > 0) {
        console.log(`✅ ${proxiedRequests.length} requests are being proxied correctly`);
      }

      if (directRequests.length > 0) {
        console.log(`❌ ${directRequests.length} requests are bypassing the proxy`);
        directRequests.forEach(req => {
          console.log(`   - ${req.url}`);
        });
      }
    } else {
      console.log('ℹ️ No API requests were made during the test');
    }

    if (corsErrors.length === 0) {
      console.log('✅ No CORS errors detected');
    } else {
      console.log(`❌ ${corsErrors.length} CORS errors detected`);
      corsErrors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }

    // Take a screenshot
    await page.screenshot({ path: 'tests/proxy-verification-result.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/proxy-verification-result.png');
  });
});