import { test, expect } from '@playwright/test';

test.describe('Login Flow Debug', () => {
  test('should debug the complete login flow', async ({ page }) => {
    const logs: string[] = [];
    
    // Capture all console logs
    page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
      console.log(`🖥️  [${msg.type()}] ${msg.text()}`);
    });

    // Navigate to login page
    console.log('🚪 Navigating to login page...');
    await page.goto('/login');
    
    // Wait for page to load
    await page.waitForTimeout(2000);

    // Fill login form
    console.log('📝 Filling login form...');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');

    // Monitor navigation changes
    let currentUrl = page.url();
    console.log(`📍 Starting URL: ${currentUrl}`);

    // Submit login form
    console.log('🔐 Submitting login form...');
    await page.click('button[type="submit"]');

    // Wait for navigation/response
    await page.waitForTimeout(3000);
    
    let newUrl = page.url();
    console.log(`📍 URL after login attempt: ${newUrl}`);

    // Check if we're on tenders page
    if (newUrl.includes('/tenders')) {
      console.log('✅ Successfully navigated to /tenders');
      
      // Wait a bit more to see if there's a redirect back
      await page.waitForTimeout(5000);
      
      let finalUrl = page.url();
      console.log(`📍 Final URL after waiting: ${finalUrl}`);
      
      if (finalUrl.includes('/login')) {
        console.log('❌ Redirected back to login - this is the bug!');
        
        // Check authentication state
        const authState = await page.evaluate(() => {
          const token = localStorage.getItem('auth_token');
          return {
            hasToken: !!token,
            token: token ? token.substring(0, 20) + '...' : null,
            isAuthenticated: (window as any).authService?.isAuthenticated?.() || false
          };
        });
        
        console.log('🔑 Auth state after redirect:', authState);
      } else {
        console.log('✅ Stayed on /tenders page - login successful!');
      }
    } else if (newUrl.includes('/login')) {
      console.log('❌ Still on login page - login might have failed');
      
      // Check for error messages
      const errorMessage = await page.locator('.bg-destructive\\/10').textContent().catch(() => null);
      if (errorMessage) {
        console.log('❌ Error message displayed:', errorMessage);
      }
    } else {
      console.log(`❓ Unexpected URL: ${newUrl}`);
    }

    // Capture final authentication state
    const finalAuthState = await page.evaluate(() => {
      const token = localStorage.getItem('auth_token');
      return {
        hasToken: !!token,
        tokenLength: token?.length || 0,
        authServiceAvailable: typeof (window as any).authService !== 'undefined',
        debugApiAvailable: typeof (window as any).debugApi !== 'undefined'
      };
    });

    console.log('🔍 Final auth state:', finalAuthState);

    // Take a screenshot
    await page.screenshot({ path: 'tests/login-flow-debug.png', fullPage: true });
    console.log('📸 Screenshot saved to tests/login-flow-debug.png');

    // Log relevant console messages
    console.log('\n📜 Relevant console logs:');
    logs.filter(log => 
      log.includes('login') || 
      log.includes('auth') || 
      log.includes('token') || 
      log.includes('user') ||
      log.includes('navigate') ||
      log.includes('redirect')
    ).forEach(log => console.log(`  ${log}`));
  });
});