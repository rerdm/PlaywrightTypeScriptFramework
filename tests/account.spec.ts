import { test, expect } from '@playwright/test';
import Navigate from '../components/navigate.component';

let navigate: Navigate;

test.describe('Global Setup', () => {

    test('Verify logout is visible @Account @TC-40000', async ({ page }) => {
        navigate = new Navigate(page);
        await navigate.navigateToStartPage()
        await page.waitForTimeout(5000);
        await expect(page.locator('//a[text()="Logout"]')).toBeVisible()
    });
    
    test('Should show login button when not logged in @Account @TC-40001', async ({ page }) => {
        await page.context().clearCookies();
        navigate = new Navigate(page);
        await navigate.navigateToStartPage()
        await page.waitForTimeout(5000);
        await expect(page.locator('//a[text()="Login"]')).toBeVisible()

    
        // // Optional
        // const dashboardElement = page.locator('//*[@id="accountbar"]/table/tbody/tr[2]/td/a[2]');
        // await expect(dashboardElement).not.toBeVisible();
      });  
})
