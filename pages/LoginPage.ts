import { Page, Locator } from '@playwright/test';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from "../utils/StepLogger";


export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly successContinueButton: Locator;

  fileName: string;


  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username_input');
    this.passwordInput = page.locator('#password_input');
    this.loginButton = page.locator('#login_button');
    this.registerLink = page.locator('#register_link');
    this.successContinueButton = page.locator('#login_success_continue_button');

    this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

  }

  async goto() {


    await this.page.goto('https://rerd.de/testing-website/login.php');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async goToRegister() {
    await this.registerLink.click();
  }

  async continueAfterSuccess() {
    await this.successContinueButton.click();
  }

  async isLoggedIn() {
    // Check if we're redirected to a different page or see success elements
    await this.page.waitForURL(/\/(shop|cart|account|index)\.php/, { timeout: 5000 });
    return true;
  }

  async hasValidationError() {
    // Look for common error indicators
    const errorSelectors = [
      '.text-red-400',
      '.text-red-500',
      '.bg-red-900',
      '[class*="error"]'
    ];
    
    for (const selector of errorSelectors) {
      const element = this.page.locator(selector);
      if (await element.isVisible()) {
        return true;
      }
    }
    return false;
  }
}
