import { Page, Locator } from '@playwright/test';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from "../utils/StepLogger";


export class ShopPage {
  readonly page: Page;
  readonly categoryFilter: Locator;
  readonly sortFilter: Locator;
  readonly searchInput: Locator;
  readonly resetFiltersButton: Locator;
  readonly scrollToTopButton: Locator;
  readonly resetAllFiltersButton: Locator;

  fileName: string;

  constructor(page: Page) {
    this.page = page;
    this.categoryFilter = page.locator('#category_filter');
    this.sortFilter = page.locator('#sort_filter');
    this.searchInput = page.locator('#search_input');
    this.resetFiltersButton = page.locator('#reset_filters_button');
    this.scrollToTopButton = page.locator('#scroll_to_top_button');
    this.resetAllFiltersButton = page.locator('#reset_all_filters_button');

    this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

  }

  async goto() {
    await this.page.goto('/testing-website/public/shop.php');
  }

  async filterByCategory(category: string) {
    await this.categoryFilter.selectOption(category);
  }

  async sortBy(sortOption: string) {
    await this.sortFilter.selectOption(sortOption);
  }

  async searchForProducts(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    // Wait a bit for debounced search
    await this.page.waitForTimeout(600);
  }

  async resetFilters() {
    await this.resetFiltersButton.click();
  }

  async resetAllFilters() {
    await this.resetAllFiltersButton.click();
  }

  async scrollToTop() {
    await this.scrollToTopButton.click();
  }

  async getProductQuantityInput(productId: string): Promise<Locator> {
    return this.page.locator(`#quantity_input_${productId}`);
  }

  async getAddToCartButton(productId: string): Promise<Locator> {
    return this.page.locator(`#add_to_cart_button_${productId}`);
  }

  async addProductToCart(productId: string, quantity: string = '1') {
    const quantityInput = await this.getProductQuantityInput(productId);
    const addToCartButton = await this.getAddToCartButton(productId);
    
    await quantityInput.fill(quantity);
    await addToCartButton.click();
  }

  async getProductCount(): Promise<number> {
    const productCards = this.page.locator('.bg-gray-800.border.border-gray-700.rounded-2xl');
    return await productCards.count();
  }

  async waitForProductsToLoad() {
    // Wait for at least one product or no products message
    await this.page.waitForFunction(() => {
      const products = document.querySelectorAll('.bg-gray-800.border.border-gray-700.rounded-2xl');
      const noProductsMessage = document.querySelector('.col-span-full.text-center');
      return products.length > 0 || noProductsMessage !== null;
    });
  }

  async getFirstProductId(): Promise<string | null> {
    const firstAddToCartButton = this.page.locator('[id^="add_to_cart_button_"]').first();
    const id = await firstAddToCartButton.getAttribute('id');
    if (id) {
      return id.replace('add_to_cart_button_', '');
    }
    return null;
  }
}
