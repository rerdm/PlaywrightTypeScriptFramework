import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';
import { NavigationPage } from '../pages/NavigationPage';

test.describe('Registration Tests', () => {
  let registerPage: RegisterPage;
  let loginPage: LoginPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    loginPage = new LoginPage(page);
    navigationPage = new NavigationPage(page);
    await registerPage.goto();
  });

  test('TEST-0010 should display registration form elements', async ({ page }) => {
    // Verify all registration form elements are present
    await expect(registerPage.usernameInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.birthdateInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.passwordRepeatInput).toBeVisible();
    await expect(registerPage.registerButton).toBeVisible();
    await expect(registerPage.loginLink).toBeVisible();
    
    // Verify page title and heading
    await expect(page).toHaveTitle(/Register/);
    await expect(page.locator('h1')).toContainText('Create Account');
  });

  test('TEST-0020 should successfully register with valid data', async ({ page }) => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      birthdate: '1990-01-01',
      password: 'TestPassword123!',
      passwordRepeat: 'TestPassword123!'
    };
    
    await registerPage.register(userData);
    
    // Verify successful registration by checking redirect to login page
    await expect(registerPage.isRegistrationSuccessful()).resolves.toBe(true);
    
    // Verify we're on login page with success parameter
    await expect(page).toHaveURL(/login\.php\?registered=1/);
    
    // Verify success popup is visible
    await expect(page.locator('#successPopup')).toBeVisible();
    await expect(page.locator('text=Registration Successful!')).toBeVisible();
  });

  test('TEST-0030 should show error for duplicate username', async ({ page }) => {
    const userData = {
      username: 'existinguser', // This should be an existing username in your test data
      email: 'newemail@example.com',
      birthdate: '1990-01-01',
      password: 'TestPassword123!',
      passwordRepeat: 'TestPassword123!'
    };
    
    await registerPage.register(userData);
    
    // Verify error is shown
    expect(await registerPage.hasValidationErrors()).toBe(true);
    
    const errors = await registerPage.getValidationErrors();
    expect(errors.some(error => error.toLowerCase().includes('username'))).toBe(true);
  });

  test('TEST-0040 should show error for duplicate email', async ({ page }) => {
    const userData = {
      username: 'newuser123',
      email: 'existing@example.com', // This should be an existing email in your test data
      birthdate: '1990-01-01',
      password: 'TestPassword123!',
      passwordRepeat: 'TestPassword123!'
    };
    
    await registerPage.register(userData);
    
    // Verify error is shown
    expect(await registerPage.hasValidationErrors()).toBe(true);
    
    const errors = await registerPage.getValidationErrors();
    expect(errors.some(error => error.toLowerCase().includes('email'))).toBe(true);
  });

  test('TEST-0050 should show error for password mismatch', async ({ page }) => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      birthdate: '1990-01-01',
      password: 'TestPassword123!',
      passwordRepeat: 'DifferentPassword123!'
    };
    
    await registerPage.register(userData);
    
    // Verify error is shown
    expect(await registerPage.hasValidationErrors()).toBe(true);
    
    const errors = await registerPage.getValidationErrors();
    expect(errors.some(error => error.toLowerCase().includes('password'))).toBe(true);
  });

  test('TEST-0060 should show validation error for empty required fields', async ({ page }) => {
    await registerPage.registerButton.click();
    
    // HTML5 validation should prevent form submission
    await expect(registerPage.usernameInput).toHaveAttribute('required');
    await expect(registerPage.emailInput).toHaveAttribute('required');
    await expect(registerPage.birthdateInput).toHaveAttribute('required');
    await expect(registerPage.passwordInput).toHaveAttribute('required');
    await expect(registerPage.passwordRepeatInput).toHaveAttribute('required');
  });

  test('TEST-0070 should validate email format', async ({ page }) => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: 'invalid-email-format',
      birthdate: '1990-01-01',
      password: 'TestPassword123!',
      passwordRepeat: 'TestPassword123!'
    };
    
    await registerPage.register(userData);
    
    // HTML5 email validation should prevent form submission
    await expect(registerPage.emailInput).toHaveAttribute('type', 'email');
  });

  test('TEST-0080 should validate date format', async ({ page }) => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      birthdate: 'invalid-date',
      password: 'TestPassword123!',
      passwordRepeat: 'TestPassword123!'
    };
    
    // Try to fill invalid date - should be handled by date input type
    await registerPage.usernameInput.fill(userData.username);
    await registerPage.emailInput.fill(userData.email);
    await registerPage.birthdateInput.fill(userData.birthdate);
    await registerPage.passwordInput.fill(userData.password);
    await registerPage.passwordRepeatInput.fill(userData.passwordRepeat);
    await registerPage.registerButton.click();
    
    // HTML5 date validation should prevent form submission
    await expect(registerPage.birthdateInput).toHaveAttribute('type', 'date');
  });

  test('TEST-0090 should navigate to login page', async ({ page }) => {
    await registerPage.goToLogin();
    
    // Verify navigation to login page
    await expect(page).toHaveURL(/login\.php/);
    await expect(page.locator('h1')).toContainText('Welcome Back');
  });

  test('TEST-0091 should register and then login with new account', async ({ page }) => {
    const timestamp = Date.now();
    const userData = {
      username: `testuser${timestamp}`,
      email: `testuser${timestamp}@example.com`,
      birthdate: '1990-01-01',
      password: 'TestPassword123!',
      passwordRepeat: 'TestPassword123!'
    };
    
    // Register new user
    await registerPage.register(userData);
    
    // Verify registration success
    await expect(page).toHaveURL(/login\.php\?registered=1/);
    
    // Close success popup and login
    await loginPage.continueAfterSuccess();
    await loginPage.login(userData.username, userData.password);
    
    // Verify successful login
    await navigationPage.waitForNavigation();
    expect(await navigationPage.isLoggedIn()).toBe(true);
    
    // Verify username is displayed in navigation
    const displayedUsername = await navigationPage.getCurrentUsername();
    expect(displayedUsername).toBe(userData.username);
  });
});
