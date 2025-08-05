import { chromium, FullConfig } from '@playwright/test';
import { loadEnvironmentConfig } from './environment-config';
import { StepLogger } from './StepLogger';

async function globalSetup(config: FullConfig) {

  // Clear any existing reports at the start
  StepLogger.clearReports();
  console.log('🧹 Cleared previous test reports - ready for new test run');

  // Get environment configuration
  const envConfig = loadEnvironmentConfig();
  //const credentials = getEnvironmentCredentials(envConfig.environment);

  //console.log(`Global setup using baseURL: ${envConfig.baseURL}`);
  //console.log(`Environment: ${envConfig.environment}`);

  // Navigate to the base URL
  //await page.goto(envConfig.baseURL);

  // Wait until the login form is visible before saving the state
  
  //const loginLink = page.locator('//a[text()="Login"]');
  //await loginLink.waitFor({ timeout: 10000 });

  // Save the state when the user is not logged in
  //await page.context().storageState({ path: 'notLoggedInState.json' });

  // Perform login based on environment
  //await loginLink.click();
  
  // Use environment-specific credentials
  //await page.locator("//input[@id='login-username']").fill(envConfig.testUsername || 'defaultUser');
  //await page.locator("//input[@id='login-password']").fill(credentials.password);
  //await page.locator("//input[@id='login-submit']").click();


  // rerd 2025-07-16
  // Wait for an element that should be visible after logging in
  // This locator is not available on  http://10.40.226.38/Praxis_FFM_2024-12/index.php  - rerd 2025-07-16
  //await page.locator('//*[@id="accountbar"]/table/tbody/tr[2]/td/a[2]').waitFor({ timeout: 10000 });
  

  // Save the state after a successful login
  //await page.context().storageState({ path: 'loggedInState.json' });


  //await browser.close();


}

export default globalSetup;
