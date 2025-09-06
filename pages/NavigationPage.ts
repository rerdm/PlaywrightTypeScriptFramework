import { Page, Locator } from '@playwright/test';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from "../utils/StepLogger";


export class NavigationPage {
  readonly page: Page;
  // Desktop Navigation
  readonly homeLink: Locator;
  readonly shopLink: Locator;
  readonly cartLink: Locator;
  readonly accountLink: Locator;
  readonly loginButton: Locator;
  readonly registerButton: Locator;
  readonly logoutButton: Locator;
  
  // Mobile Navigation
  readonly mobileMenuButton: Locator;
  readonly mobileHomeLink: Locator;
  readonly mobileShopLink: Locator;
  readonly mobileCartLink: Locator;
  readonly mobileAccountLink: Locator;
  readonly mobileLoginButton: Locator;
  readonly mobileRegisterButton: Locator;
  readonly mobileLogoutButton: Locator;

  fileName: string;

  constructor(page: Page) {
    this.page = page;
    
    // Desktop Navigation
    this.homeLink = page.locator('#nav_home_link');
    this.shopLink = page.locator('#nav_shop_link');
    this.cartLink = page.locator('#nav_cart_link');
    this.accountLink = page.locator('#nav_account_link');
    this.loginButton = page.locator('#nav_login_button');
    this.registerButton = page.locator('#nav_register_button');
    this.logoutButton = page.locator('#nav_logout_button');
    
    // Mobile Navigation
    this.mobileMenuButton = page.locator('#mobile_menu_button');
    this.mobileHomeLink = page.locator('#mobile_nav_home_link');
    this.mobileShopLink = page.locator('#mobile_nav_shop_link');
    this.mobileCartLink = page.locator('#mobile_nav_cart_link');
    this.mobileAccountLink = page.locator('#mobile_nav_account_link');
    this.mobileLoginButton = page.locator('#mobile_nav_login_button');
    this.mobileRegisterButton = page.locator('#mobile_nav_register_button');
    this.mobileLogoutButton = page.locator('#mobile_nav_logout_button');

    this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

  }

  // Desktop Navigation Methods
  async goToHome() {
    await this.homeLink.click();
  }

  async goToShop() {
    await this.shopLink.click();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async goToAccount() {
    await this.accountLink.click();
  }

  async goToLogin() {
    await this.loginButton.click();
  }

  async goToRegister() {
    await this.registerButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  // Mobile Navigation Methods
  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }

  async goToHomeMobile() {
    await this.openMobileMenu();
    await this.mobileHomeLink.click();
  }

  async goToShopMobile() {
    await this.openMobileMenu();
    await this.mobileShopLink.click();
  }

  async goToCartMobile() {
    await this.openMobileMenu();
    await this.mobileCartLink.click();
  }

  async goToAccountMobile() {
    await this.openMobileMenu();
    await this.mobileAccountLink.click();
  }

  async goToLoginMobile() {
    await this.openMobileMenu();
    await this.mobileLoginButton.click();
  }

  async goToRegisterMobile() {
    await this.openMobileMenu();
    await this.mobileRegisterButton.click();
  }

  async logoutMobile() {
    await this.openMobileMenu();
    await this.mobileLogoutButton.click();
  }

  // Utility Methods
  async isLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }

  async isLoggedOut(): Promise<boolean> {
    return await this.loginButton.isVisible();
  }

  async isMobileMenuVisible(): Promise<boolean> {
    const mobileMenu = this.page.locator('#mobile-menu');
    return await mobileMenu.isVisible();
  }

  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentUsername(): Promise<string | null> {
    const usernameSpan = this.page.locator('span:has-text("Hello,") strong');
    if (await usernameSpan.isVisible()) {
      return await usernameSpan.textContent();
    }
    return null;
  }
}
