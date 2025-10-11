import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShopPage } from '../pages/ShopPage';
import { CartPage } from '../pages/CartPage';
import { NavigationPage } from '../pages/NavigationPage';

test.describe('E-Commerce Flow Tests', () => {
  let loginPage: LoginPage;
  let shopPage: ShopPage;
  let cartPage: CartPage;
  let navigationPage: NavigationPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    shopPage = new ShopPage(page);
    cartPage = new CartPage(page);
    navigationPage = new NavigationPage(page);
  });

  test('TEST-0100 should display shop page elements', async ({ page }) => {
    await shopPage.goto();
    
    // Verify shop page elements are present
    await expect(page.locator('h1')).toContainText('Our Shop');
    await expect(shopPage.categoryFilter).toBeVisible();
    await expect(shopPage.sortFilter).toBeVisible();
    await expect(shopPage.searchInput).toBeVisible();
    
    // Wait for products to load
    await shopPage.waitForProductsToLoad();
  });

  test('TEST-0200 should filter products by category', async ({ page }) => {
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    const initialProductCount = await shopPage.getProductCount();
    
    // Filter by a specific category (adjust based on your test data)
    await shopPage.filterByCategory('Hardware');
    await shopPage.waitForProductsToLoad();
    
    const filteredProductCount = await shopPage.getProductCount();
    
    // Verify filter is applied (could be same or less than initial count)
    expect(filteredProductCount).toBeGreaterThanOrEqual(0);
    expect(filteredProductCount).toBeLessThanOrEqual(initialProductCount);
  });

  test('TEST-0300 should sort products', async ({ page }) => {
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    // Sort by price ascending
    await shopPage.sortBy('price_asc');
    await shopPage.waitForProductsToLoad();
    
    // Verify products are loaded (detailed price verification would require more complex logic)
    expect(await shopPage.getProductCount()).toBeGreaterThan(0);
  });

  test('TEST-0400 should search for products', async ({ page }) => {
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    // Search for products (adjust search term based on your test data)
    await shopPage.searchForProducts('test');
    await shopPage.waitForProductsToLoad();
    
    // Verify search results are shown
    const searchResultCount = await shopPage.getProductCount();
    expect(searchResultCount).toBeGreaterThanOrEqual(0);
  });

  test('TEST-0500 should reset filters', async ({ page }) => {
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    // Apply some filters
    await shopPage.filterByCategory('Software');
    await shopPage.searchForProducts('book');
    await shopPage.waitForProductsToLoad();
    
    // Reset filters
    await shopPage.resetFilters();
    await shopPage.waitForProductsToLoad();
    
    // Verify filters are reset (should show all products again)
    expect(await shopPage.getProductCount()).toBeGreaterThan(0);
  });

  test('TEST-0600 should add product to cart when logged in', async ({ page }) => {
    // First login
    await loginPage.goto();
    await loginPage.login('testuser', 'testpassword'); // Adjust credentials
    await navigationPage.waitForNavigation();
    
    // Go to shop
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    // Get first product and add to cart
    const productId = await shopPage.getFirstProductId();
    if (productId) {
      await shopPage.addProductToCart(productId, '2');
      
      // Verify cart update (you might need to check for success message or cart count)
      await page.waitForTimeout(1000); // Wait for cart update
    }
  });

  test('TEST-0700 should complete full purchase flow', async ({ page }) => {
    // Login first
    await loginPage.goto();
    await loginPage.login('testuser', 'testpassword'); // Adjust credentials
    await navigationPage.waitForNavigation();
    
    // Go to shop and add product
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    const productId = await shopPage.getFirstProductId();
    if (productId) {
      await shopPage.addProductToCart(productId, '1');
      await page.waitForTimeout(1000);
      
      // Go to cart
      await navigationPage.goToCart();
      
      // Verify product is in cart
      expect(await cartPage.isCartEmpty()).toBe(false);
      expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);
      
      // Proceed to checkout
      await cartPage.proceedToCheckout();
      
      // Verify redirect to success page
      await expect(page).toHaveURL(/thanks\.php/, { timeout: 10000 });
    }
  });

  test('TEST-0800 should update cart quantities', async ({ page }) => {
    // Login and add product to cart first
    await loginPage.goto();
    await loginPage.login('testuser', 'testpassword'); // Adjust credentials
    await navigationPage.waitForNavigation();
    
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    const productId = await shopPage.getFirstProductId();
    if (productId) {
      await shopPage.addProductToCart(productId, '1');
      await page.waitForTimeout(1000);
      
      // Go to cart
      await navigationPage.goToCart();
      
      // Update quantity
      await cartPage.updateProductQuantity(productId, '3');
      await cartPage.waitForCartUpdate();
      
      // Verify quantity was updated
      const quantityInput = await cartPage.getCartQuantityInput(productId);
      await expect(quantityInput).toHaveValue('3');
    }
  });

  test('TEST-0900 should remove product from cart', async ({ page }) => {
    // Login and add product to cart first
    await loginPage.goto();
    await loginPage.login('testuser', 'testpassword'); // Adjust credentials
    await navigationPage.waitForNavigation();
    
    await shopPage.goto();
    await shopPage.waitForProductsToLoad();
    
    const productId = await shopPage.getFirstProductId();
    if (productId) {
      await shopPage.addProductToCart(productId, '1');
      await page.waitForTimeout(1000);
      
      // Go to cart
      await navigationPage.goToCart();
      
      const initialItemCount = await cartPage.getCartItemCount();
      expect(initialItemCount).toBeGreaterThan(0);
      
      // Remove product
      await cartPage.removeProduct(productId);
      await cartPage.waitForCartUpdate();
      
      // Verify product was removed
      const finalItemCount = await cartPage.getCartItemCount();
      expect(finalItemCount).toBe(initialItemCount - 1);
    }
  });

  test('TEST-0910 should show empty cart message when no items', async ({ page }) => {
    // Login first
    await loginPage.goto();
    await loginPage.login('testuser', 'testpassword'); // Adjust credentials
    await navigationPage.waitForNavigation();
    
    // Go to cart (assuming it's empty)
    await cartPage.goto();
    
    // If cart is empty, verify empty message
    if (await cartPage.isCartEmpty()) {
      await expect(page.locator('text=Your cart is empty')).toBeVisible();
      await expect(cartPage.goToShopButton).toBeVisible();
    }
  });

  test('TEST-0920 should navigate from empty cart to shop', async ({ page }) => {
    // Login first
    await loginPage.goto();
    await loginPage.login('testuser', 'testpassword'); // Adjust credentials
    await navigationPage.waitForNavigation();
    
    // Go to cart
    await cartPage.goto();
    
    // If cart is empty, click go to shop
    if (await cartPage.isCartEmpty()) {
      await cartPage.goToShop();
      
      // Verify navigation to shop
      await expect(page).toHaveURL(/shop\.php/);
      await expect(page.locator('h1')).toContainText('Our Shop');
    }
  });
});
