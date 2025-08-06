import test, { expect } from '@playwright/test';

import BasePage from '../pages/BasePage';
import { StartPage } from '../pages/StartPage';
import { ShopPage } from '../pages/ShopPage';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from '../utils/StepLogger';



test.describe('Smoke Tests', () => {


    let basePage: BasePage;
    let startPage: StartPage;
    let shopPage: ShopPage;
    let stepCount = 0;
    let envConfig = loadEnvironmentConfig();
    let expectedUrl = envConfig.baseURL;
    let testSpecName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    let testName: string;
    let product: string;
    const testData = require('../test-data/ShopSearchProducts.json');
    const testDataVisobleOnScreen = require('../test-data/ShopProductsVisibleOnScreen.json');
    


    test.beforeEach(async ({ page }) => {
        // Load environment configuration
        basePage = new BasePage(page);
        startPage = new StartPage(page);
        shopPage = new ShopPage(page);
    });

    test.afterAll(async () => {
        // Optionally, you can add cleanup code here if needed
        //StepLogger.generateHtmlReport();
    
    });

test('Open Shop and search a ITEM via searchField @SHOP-001', async ({ page }) => {

    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title,

    StepLogger.startTest(testName, envConfig.environment, testSpecName);
    
    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount,expectedUrl, testName);

    // Step 2
    stepCount++;
    await startPage.MenubarItems.ShopButtonClick(stepCount, testName);

    // Step 3
    await shopPage.SearchInputFiledForPoducts(testData.searchProducts.Espresso, stepCount, testName);


    StepLogger.testEnd();

    });


test('Open Shop and search a ITEM via searchField and click it @SHOP-002', async ({ page }) => {

    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title,

    product = testDataVisobleOnScreen.searchProducts.Nivea_Creme;

    StepLogger.startTest(testName, envConfig.environment, testSpecName);
    
    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount,expectedUrl, testName);

    // Step 2
    stepCount++;
    await startPage.MenubarItems.ShopButtonClick(stepCount, testName);

    // Step 3
    stepCount++;
    await shopPage.SearchInputFiledForPoducts(product, stepCount, testName);

    // Step 4
    stepCount++;
    await shopPage.ClickShopProduct(product, stepCount, testName);

    //await page.waitForTimeout(20000);

    StepLogger.testEnd();

    });

test('Open Shop and search and add it to cart it @SHOP-003', async ({ page }) => {

    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title,

    product = testDataVisobleOnScreen.searchProducts.Nivea_Creme;

    StepLogger.startTest(testName, envConfig.environment, testSpecName);
    
    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount,expectedUrl, testName);

    // Step 2
    stepCount++;
    await startPage.MenubarItems.ShopButtonClick(stepCount, testName);

    // Step 3
    stepCount++;
    await shopPage.SearchInputFiledForPoducts(product, stepCount, testName);

    // Step 4
    stepCount++;
    await shopPage.ClickShopProduct(product, stepCount, testName);


    // Step 5
    stepCount++;
    await shopPage.AdItemToCart(stepCount, testName);

    //await page.waitForTimeout(20000);

    StepLogger.testEnd();

    });


test('Open Shop and search in available ITEMS on the screen @SHOP-004', async ({ page }) => {

    
    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title,

    StepLogger.startTest(testName, envConfig.environment, testSpecName);
    
    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount,expectedUrl, testName);

    // Step 2
    stepCount++;
    await startPage.MenubarItems.ShopButtonClick(stepCount, testName);

    // Step 3
    stepCount++;
    await shopPage.ScrollToCartProduct(testDataVisobleOnScreen.searchProducts.Nivea_Creme, stepCount, testName);


    StepLogger.testEnd();

    });


test('Open Cart via Start Page @SHOP-005', async ({ page }) => {

    
    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title,

    StepLogger.startTest(testName, envConfig.environment, testSpecName);
    
    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount,expectedUrl, testName);

    // Step 2
    stepCount++;
    await startPage.MenubarItems.CartButtonClick(stepCount, testName);


    StepLogger.testEnd();

    });
    
});


