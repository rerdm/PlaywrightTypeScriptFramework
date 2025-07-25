/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';
import Navigate from '../components/navigate_staging.component';
import LoginPage from '../pages/login_staging.page';
import RegisterPage from '../pages/registration_staging.page';
import { logTestStart, logTestEnd, logSeparator, logTestEndTime } from '../utils/logStep';


test.describe('LoginProzess', () => {
  test.use({storageState: 'notLoggedInState.json'})
  let navigate: Navigate;
  let loginPage: LoginPage;
  let registerPage: RegisterPage;
  let username: string;
  let password: string;

  test.beforeEach(async ({ page }) => {
    navigate = new Navigate(page);
    loginPage = new LoginPage(page);
    registerPage = new RegisterPage(page);
    await page.context().clearCookies();
    await navigate.navigateToStartPage();

    // Verwende logTestStart für strukturiertes Logging
    logTestStart(test.info().title, process.env.ENVIRONMENT || 'local');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Übergebe Testinformationen an logTestEndTime
    logTestEndTime(
      testInfo.title, 
      testInfo.status || 'unknown', 
      testInfo.duration
    );
  });


  // Test Case 1: Login with valid credentials
  test('Successfull login @STAGING @Login @TC-XX000', async ({ page }) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    username = "tester";
    password = "passwort";

    let stepCounter = 0;

    const actualStepCounter = await navigate.navigateToLogin(stepCounter);
    // Du kannst jetzt 'result' weiterverwenden, z.B. ausgeben oder prüfen:

    //successfull login
    const actualStepCounter1 = await loginPage.login(username,password,actualStepCounter);

    
  }); 

    // Test Case 1: Login with valid credentials
  test('Successfull login @STAGING @Login @TC-XXX00', async ({ page }) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    username = "tester";
    password = "passwort";

    let stepCounter = 0;

    const actualStepCounter = await navigate.navigateToLogin(stepCounter);
    // Du kannst jetzt 'result' weiterverwenden, z.B. ausgeben oder prüfen:

    //successfull login
    const actualStepCounter1 = await loginPage.login(username,password,actualStepCounter);

  }); 

  test('Login mit empty password @STAGING @Login @TC-XX001', async ({page}) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    username = "tester";
    password = ""
    
    let stepCounter = 0;
      
    const actualStepCounter = await navigate.navigateToLogin(stepCounter);

    // Enter username and passord
    const actualStepCounter1 = await loginPage.login(username,password, actualStepCounter)

    // Expect that error message is available 
    await expect(loginPage.passwordWrongMsg).toBeVisible();

    //assertion not-successfull login with invalid credentials
    await loginPage.verifysuccessfullLogout()

  });
});

