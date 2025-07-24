import { test, expect } from '@playwright/test';
import Navigate from '../components/navigate.component';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let navigate: Navigate;

// diese teste werden alle zusammen ausgeführt da sie in dem gleichen describe-Block sind

test.describe ('Example Test with Navigate', ()=> {
test('navigate To Home @Example-Test @TC-00000', async ({ page }) => {
  navigate = new Navigate(page);
  await navigate.navigateToStartPage()
  await expect(page).toHaveTitle('coffeeshop');

});
test('navigate To About @Example-Test @TC-00001', async ({ page }) => {
  navigate = new Navigate(page);
  await navigate.navigateToAbout()

});
test('navigate To Shop @Example-Test @TC-00002', async ({ page }) => {
  navigate = new Navigate(page);
  await navigate.navigateToShop()

});
test('navigate To Contact @Example-Test @TC-00003', async ({ page }) => {
  navigate = new Navigate(page);
  await navigate.navigateToContact()

});
test('navigate To Login @Example-Test @TC-00004', async ({ page }) => {
  navigate = new Navigate(page);
  await navigate.navigateToLogin()

});

});



 

