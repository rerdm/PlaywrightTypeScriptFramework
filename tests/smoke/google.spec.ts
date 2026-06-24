import { test, expect } from '@playwright/test';

test.describe('Google Tests', () => {

  test('TEST-Google-001 should navigate to Google homepage @GOOGLE-001', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com');
    
  });

});