import { Page, Locator } from '@playwright/test';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from "../utils/StepLogger";


export class RegisterPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly birthdateInput: Locator;
  readonly passwordInput: Locator;
  readonly passwordRepeatInput: Locator;
  readonly registerButton: Locator;
  readonly loginLink: Locator;

  fileName: string;


  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#register_username_input');
    this.emailInput = page.locator('#register_email_input');
    this.birthdateInput = page.locator('#register_birthdate_input');
    this.passwordInput = page.locator('#register_password_input');
    this.passwordRepeatInput = page.locator('#register_password_repeat_input');
    this.registerButton = page.locator('#register_button');
    this.loginLink = page.locator('#login_link');

    this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

  }

  async goto() {
    await this.page.goto('/testing-website/public/register.php');
  }

  async register(userData: {
    username: string;
    email: string;
    birthdate: string;
    password: string;
    passwordRepeat: string;
  }) {
    await this.usernameInput.fill(userData.username);
    await this.emailInput.fill(userData.email);
    await this.birthdateInput.fill(userData.birthdate);
    await this.passwordInput.fill(userData.password);
    await this.passwordRepeatInput.fill(userData.passwordRepeat);
    await this.registerButton.click();
  }

  async goToLogin() {
    await this.loginLink.click();
  }

  async isRegistrationSuccessful() {
    // Check if redirected to login page with success parameter
    await this.page.waitForURL(/login\.php\?registered=1/, { timeout: 5000 });
    return true;
  }

  async hasValidationErrors() {
    // Look for error messages container
    const errorContainer = this.page.locator('.bg-red-900\\/20');
    return await errorContainer.isVisible();
  }

  async getValidationErrors() {
    const errorContainer = this.page.locator('.bg-red-900\\/20');
    const errorList = errorContainer.locator('li');
    const errors = [];
    
    const count = await errorList.count();
    for (let i = 0; i < count; i++) {
      const errorText = await errorList.nth(i).textContent();
      if (errorText) {
        errors.push(errorText.trim());
      }
    }
    
    return errors;
  }
}
