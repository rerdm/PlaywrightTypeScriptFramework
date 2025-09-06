import { Page, Locator } from '@playwright/test';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from "../utils/StepLogger";


export class CartPage {
  readonly page: Page;
  readonly updateCartButton: Locator;
  readonly checkoutButton: Locator;
  readonly goToShopButton: Locator;

  fileName: string;

  constructor(page: Page) {
    this.page = page;
    this.updateCartButton = page.locator('#update_cart_button');
    this.checkoutButton = page.locator('#checkout_button');
    this.goToShopButton = page.locator('#go_to_shop_button');

    this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
  }

  async goto() {
    await this.page.goto('/testing-website/public/cart.php');
  }

  async getCartQuantityInput(productId: string): Promise<Locator> {
    return this.page.locator(`#cart_quantity_input_${productId}`);
  }

  async getRemoveItemButton(productId: string): Promise<Locator> {
    return this.page.locator(`#remove_item_button_${productId}`);
  }

  async updateProductQuantity(productId: string, quantity: string) {
    const quantityInput = await this.getCartQuantityInput(productId);
    await quantityInput.fill(quantity);
    await this.updateCartButton.click();
  }

  async removeProduct(productId: string) {
    const removeButton = await this.getRemoveItemButton(productId);
    await removeButton.click();
  }

  async updateCart() {
    await this.updateCartButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async goToShop() {
    await this.goToShopButton.click();
  }

  async isCartEmpty(): Promise<boolean> {
    const emptyCartMessage = this.page.locator('text=Your cart is empty');
    return await emptyCartMessage.isVisible();
  }

  async getCartItemCount(): Promise<number> {
    const cartItems = this.page.locator('.bg-gray-700.border.border-gray-600.rounded-xl');
    return await cartItems.count();
  }

  async getTotalAmount(): Promise<string> {
    const totalElement = this.page.locator('.text-3xl.font-bold.text-teal-400');
    const totalText = await totalElement.textContent();
    return totalText?.trim() || '0,00 €';
  }

  async getProductIds(): Promise<string[]> {
    const quantityInputs = this.page.locator('[id^="cart_quantity_input_"]');
    const count = await quantityInputs.count();
    const productIds: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const input = quantityInputs.nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        productIds.push(id.replace('cart_quantity_input_', ''));
      }
    }
    
    return productIds;
  }

  async waitForCartUpdate() {
    // Wait for page to reload/update after cart operations
    await this.page.waitForLoadState('networkidle');
  }
}
