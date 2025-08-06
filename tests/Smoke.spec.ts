import test, { expect } from '@playwright/test';
import { StartPage } from '../pages/StartPage';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from '../utils/StepLogger';


test.describe('Smoke Tests', () => {

    let startPage: StartPage;
    let stepCount = 0;
    let envConfig = loadEnvironmentConfig();
    let expectedUrl = envConfig.baseURL;
    let testSpecName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    let testName: string;

    test.beforeEach(async ({ page }) => {
        // Load environment configuration
        startPage = new StartPage(page);
    });

    test.afterAll(async () => {
        // Optionally, you can add cleanup code here if needed
        //StepLogger.generateHtmlReport();
    
    });

test('Open Start Page @SMOKE', async ({ page }) => {
    // This test uses the logged-in storage state from the config

    // This test uses fresh session without storage state
    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title,

    StepLogger.startTest(testName, envConfig.environment, testSpecName);
    
    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount,expectedUrl, testName);

    StepLogger.testEnd();

    });
    
});
