import { test, expect } from '@playwright/test';

test.describe('API Proxy Testing', () => {
  test('should capture network requests and test login flow', async ({ page }) => {
    const requests: any[] = [];
    const responses: any[] = [];

    // Capture all network requests
    page.on('request', request => {
      requests.push({
        url: request.url(),
        method: request.method(),
        headers: request.headers(),
        postData: request.postData(),
        timestamp: new Date().toISOString()
      });
      console.log(`🌐 REQUEST: ${request.method()} ${request.url()}`);
    });

    // Capture all network responses
    page.on('response', response => {
      responses.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers(),
        timestamp: new Date().toISOString()
      });
      console.log(`📡 RESPONSE: ${response.status()} ${response.url()}`);
    });

    // Navigate to the application
    await page.goto('/');
    await expect(page).toHaveTitle(/Tender Portal/);

    // Navigate to login page
    await page.click('text=Login');
    await page.waitForURL('**/login');

    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Submit login form and wait for any API calls
    await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/') || response.status() !== 200, { timeout: 10000 }),
      page.click('button[type="submit"]')
    ]).catch(() => {
      // Ignore timeout - we still want to capture what happened
      console.log('⚠️ No API response received within timeout');
    });

    // Wait a bit more to capture any delayed requests
    await page.waitForTimeout(3000);

    // Log all captured requests
    console.log('\n📊 CAPTURED REQUESTS:');
    requests.forEach((req, index) => {
      console.log(`${index + 1}. ${req.method} ${req.url}`);
      if (req.url.includes('/api/')) {
        console.log(`   ✅ API Request found: ${req.url}`);
        console.log(`   Headers:`, JSON.stringify(req.headers, null, 2));
        if (req.postData) {
          console.log(`   Post Data:`, req.postData);
        }
      }
    });

    // Log all captured responses
    console.log('\n📊 CAPTURED RESPONSES:');
    responses.forEach((res, index) => {
      console.log(`${index + 1}. ${res.status} ${res.url}`);
      if (res.url.includes('/api/')) {
        console.log(`   ✅ API Response found: ${res.status} ${res.url}`);
        console.log(`   Headers:`, JSON.stringify(res.headers, null, 2));
      }
    });

    // Check for API requests specifically
    const apiRequests = requests.filter(req => req.url.includes('/api/'));
    const apiResponses = responses.filter(res => res.url.includes('/api/'));

    console.log(`\n🔍 ANALYSIS:`);
    console.log(`Total requests: ${requests.length}`);
    console.log(`API requests: ${apiRequests.length}`);
    console.log(`API responses: ${apiResponses.length}`);

    if (apiRequests.length === 0) {
      console.log('❌ No API requests were made - this might indicate the form is not submitting properly');
    }

    if (apiResponses.length > 0) {
      apiResponses.forEach(res => {
        if (res.status === 204) {
          console.log(`⚠️ Found 204 No Content response: ${res.url}`);
        } else if (res.status >= 400) {
          console.log(`❌ Found error response: ${res.status} ${res.url}`);
        } else {
          console.log(`✅ Found successful response: ${res.status} ${res.url}`);
        }
      });
    }

    // Screenshot for debugging
    await page.screenshot({ path: 'tests/debug-login-page.png', fullPage: true });

    // Take a screenshot of the current state
    console.log('\n📸 Screenshot saved to tests/debug-login-page.png');
  });

  test('should test direct API call to check proxy configuration', async ({ page }) => {
    // Test direct API call via fetch in browser context
    const apiTestResult = await page.evaluate(async () => {
      try {
        console.log('🧪 Testing direct API call...');
        
        // Test the proxy by making a direct fetch call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'password123'
          })
        });

        return {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
          text: await response.text().catch(() => 'Could not read response text')
        };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        };
      }
    });

    console.log('\n🧪 DIRECT API TEST RESULT:');
    console.log(JSON.stringify(apiTestResult, null, 2));

    if (apiTestResult.error) {
      console.log('❌ Direct API call failed:', apiTestResult.error);
      if (apiTestResult.error.includes('CORS')) {
        console.log('🔍 CORS error detected - proxy might not be working');
      } else if (apiTestResult.error.includes('Failed to fetch')) {
        console.log('🔍 Network error - backend might not be running on port 3000');
      }
    } else {
      console.log(`✅ Direct API call response: ${apiTestResult.status} ${apiTestResult.statusText}`);
      if (apiTestResult.status === 204) {
        console.log('⚠️ Received 204 No Content - this might be the CORS preflight response');
      }
    }
  });
});