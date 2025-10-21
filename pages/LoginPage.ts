import { Page, Locator, expect } from "@playwright/test";
import { loadEnvironmentConfig } from "../utils/environment-config";

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
    this.usernameInput = page.locator("#username_input");
    this.passwordInput = page.locator("#password_input");
    this.loginButton = page.locator("#login_button");
    this.registerLink = page.locator("#register_link");
    this.successContinueButton = page.locator("#login_success_continue_button");
    this.fileName = __filename.split(/[\\/]/).pop() || "PageNotFound";
  }

  /**
   * Erwartet, dass alle Login-Form-Elemente sichtbar sind
   */
  async expectLoginFormVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.registerLink).toBeVisible();
  }

  /**
   * @description
   * @return {*}  {Promise<void>}
   * @memberof LoginPage
   */
  async expectLoginErrorVisible(): Promise<void> {
    await expect(
      this.page.locator("text=error").or(this.page.locator(".text-red-400"))
    ).toBeVisible({ timeout: 3000 });
  }


  async expectRequiredFields(): Promise<void> {
    await expect(this.usernameInput).toHaveAttribute("required");
    await expect(this.passwordInput).toHaveAttribute("required");
  }

  /**
   * Erwartet, dass die Register-Seite angezeigt wird
   */
  async expectOnRegisterPage(): Promise<void> {
    await expect(this.page).toHaveURL(/register\.php/);
    await expect(this.page.locator("h1")).toContainText("Create Account");
  }

  /**
   * Erwartet, dass das Success-Popup sichtbar ist
   */
  async expectSuccessPopupVisible(): Promise<void> {
    await expect(this.page.locator("#successPopup")).toBeVisible();
    await expect(
      this.page.locator("text=Registration Successful!")
    ).toBeVisible();
  }

  /**
   * Erwartet, dass das Success-Popup nicht sichtbar ist
   */
  async expectSuccessPopupNotVisible(): Promise<void> {
    await expect(this.page.locator("#successPopup")).not.toBeVisible();
  }

  async goto() {
    await this.page.goto("https://rerd.de/testing-website/login.php");
  }

  async login(username: string, password: string) {
    this.lgoIn2(username, password)
  }

  async lgoIn2(username: string, password: string){
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
    await this.page.waitForURL(/\/(shop|cart|account|index)\.php/, {
      timeout: 5000,
    });
    return true;
  }

  async hasValidationError() {
    // Look for common error indicators
    const errorSelectors = [
      ".text-red-400",
      ".text-red-500",
      ".bg-red-900",
      '[class*="error"]',
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
