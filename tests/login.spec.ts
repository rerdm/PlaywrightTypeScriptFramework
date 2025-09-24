import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { NavigationPage } from '../pages/NavigationPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    await loginPage.goto();
  });

  test('should display login form elements @SMOKE', async ({ page }) => {
    // Verify all login form elements are present

    await loginPage.expectLoginFormVisible();
    //await expect(loginPage.usernameInput).toBeVisible();
    //await expect(loginPage.passwordInput).toBeVisible();
    //await expect(loginPage.loginButton).toBeVisible();
    //await expect(loginPage.registerLink).toBeVisible();
    
    // Verify page title and heading
    await expect(page).toHaveTitle(/Login/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('should successfully login with valid credentials @Login-002', async ({ page }) => {
    // Test data - you may need to adjust these credentials
    const validUsername = 'tester1';
    const validPassword = 'passwort1234';
    
    await loginPage.login(validUsername, validPassword);
    
    // Verify successful login by checking if redirected and navigation shows logged-in state
    await navigationPage.waitForNavigation();
    expect(await navigationPage.isLoggedIn()).toBe(true);
  });

  test('should show error for invalid credentials @SMOKE', async ({ page }) => {
    const invalidUsername = 'tester2';
    const invalidPassword = 'invalidpassword';
    
    await loginPage.login(invalidUsername, invalidPassword);
    
    // Verify error is shown and user is not logged in
    await expect(page.locator('text=error').or(page.locator('.text-red-400'))).toBeVisible({ timeout: 3000 });
    expect(await navigationPage.isLoggedIn()).toBe(false);
  });

  test('should show validation error for empty fields @Login-004', async ({ page }) => {
    await loginPage.loginButton.click();
    
    // HTML5 validation should prevent form submission
    await expect(loginPage.usernameInput).toHaveAttribute('required');
    await expect(loginPage.passwordInput).toHaveAttribute('required');
  });

  test('should navigate to register page @Login-001', async ({ page }) => {
    await loginPage.goToRegister();
    
    // Verify navigation to register page
    await expect(page).toHaveURL(/register\.php/);
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('should handle registration success popup @Login-005', async ({ page }) => {
    // Navigate to login page with registration success parameter
    await page.goto('/testing-website/public/login.php?registered=1');
    
    // Verify success popup is visible
    await expect(page.locator('#successPopup')).toBeVisible();
    await expect(page.locator('text=Registration Successful!')).toBeVisible();
    
    // Click continue button
    await loginPage.continueAfterSuccess();
    
    // Verify popup is closed
    await expect(page.locator('#successPopup')).not.toBeVisible();
  });

  test('should auto-close registration success popup @Login-006', async ({ page }) => {
    // Navigate to login page with registration success parameter
    await page.goto('/testing-website/public/login.php?registered=1');
    
    // Verify popup is visible initially
    await expect(page.locator('#successPopup')).toBeVisible();
    
    // Wait for auto-close (5 seconds + animation)
    await page.waitForTimeout(6000);
    
    // Verify popup is closed
    await expect(page.locator('#successPopup')).not.toBeVisible();
  });
});
