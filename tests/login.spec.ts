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

  test('should display login form elements @LOGIN-001', async ({ page }) => {
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

  test('should successfully login with valid credentials @SMOKE', async ({ page }) => {
    // Test data - you may need to adjust these credentials
    const validUsername = 'testerw';
    const validPassword = 'passwort1234';
    
    await test.step('Login with valid credentials', async () => {
      await test.step('Enter username and password', async () => {
        await loginPage.login(validUsername, validPassword);
      });

      await test.step('Verify navigation after login', async () => {
        await navigationPage.waitForNavigation();
        expect(await navigationPage.isLoggedIn()).toBe(true);
      });
    });
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const invalidUsername = 'tester2';
    const invalidPassword = 'invalidpassword';

    await test.step('Attempt login with invalid credentials', async () => {
      await loginPage.login(invalidUsername, invalidPassword);
    });

    await test.step('Verify error message is displayed', async () => {
      await expect(page.locator('text=error').or(page.locator('.text-red-400'))).toBeVisible({ timeout: 3000 });
    });

    await test.step('Ensure user is not logged in', async () => {
      expect(await navigationPage.isLoggedIn()).toBe(false);
    });
  });

  test('should show validation error for empty fields @Login-004', async ({ page }) => {
    await loginPage.loginButton.click();
    
    // HTML5 validation should prevent form submission
    await expect(loginPage.usernameInput).toHaveAttribute('required');
    await expect(loginPage.passwordInput).toHaveAttribute('required');
  });

  test('should navigate to register page @Login-001', async ({ page }) => {
    await test.step('Navigate to register page', async () => {
      await loginPage.goToRegister();
      await test.step('Verify register page', async () => {
        await expect(page).toHaveURL(/register\.php/);
        await expect(page.locator('h1')).toContainText('Create Account');
      });
    });
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
