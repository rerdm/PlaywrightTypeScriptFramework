import { test, expect } from '@playwright/test';

test.describe('Google Tests', () => {

  test('TEST-Google-001 should navigate to Google homepage @GOOGLE-001', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com');
    
    // Verify we're on Google
    await expect(page).toHaveTitle(/Google/);
    
    // Verify Google logo is visible
    await expect(page.locator('img[alt="Google"]')).toBeVisible();
    
    // Verify search box is visible
    await expect(page.locator('textarea[name="q"], input[name="q"]')).toBeVisible();
    
    console.log('✅ Successfully navigated to Google and verified page elements');
  });

  test('TEST-Google-002 should perform a simple search @GOOGLE-002', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com');
    
    // Accept cookies if dialog appears (common in EU)
    try {
      await page.locator('button:has-text("Accept"), button:has-text("Alle akzeptieren"), button:has-text("I agree")').click({ timeout: 3000 });
    } catch (error) {
      console.log('No cookie dialog found or already accepted');
    }
    
    // Search for "Playwright"
    const searchBox = page.locator('textarea[name="q"], input[name="q"]');
    await searchBox.fill('Playwright');
    await searchBox.press('Enter');
    
    // Verify search results page
    await expect(page).toHaveTitle(/Playwright/);
    await expect(page.locator('#search')).toBeVisible();
    
    // Verify search results are present
    await expect(page.locator('h3')).toHaveCount({ greaterThan: 0 });
    
    console.log('✅ Successfully performed search and verified results');
  });

  test('TEST-Google-003 should navigate to Google Images @GOOGLE-003', async ({ page }) => {
    // Navigate to Google
    await page.goto('https://www.google.com');
    
    // Click on Images link
    await page.locator('a:has-text("Images"), a:has-text("Bilder")').click();
    
    // Verify we're on Google Images
    await expect(page).toHaveURL(/.*images.google.com.*/);
    
    // Verify image search box is visible
    await expect(page.locator('input[name="q"]')).toBeVisible();
    
    console.log('✅ Successfully navigated to Google Images');
  });

});