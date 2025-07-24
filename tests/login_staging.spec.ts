/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';
import Navigate from '../components/navigate_staging.component';
import LoginPage from '../pages/login_staging.page';
import RegisterPage from '../pages/registration_staging.page';


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

    // Zeitstempel-Log am Testbeginn
    console.log(`🕐 Test gestartet um  ${new Date().toLocaleString('de-DE')}`);
  });

  test.afterEach(async ({ page }) => {
    console.log(`🕐 Test beendet um: ${new Date().toLocaleString('de-DE')}`);
  
  });


  // Test Case 1: Login with valid credentials
  test('Successfull login @STAGING @Login @TC-XX000', async ({ page }) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    username = "tester";
    password = "passwort";
   
    await navigate.navigateToLogin();

    //successfull login
    await loginPage.login(username,password)

    
    // rerd 2025-07-16
    // Test is not working because DB is missing
    //await loginPage.verifySuccessfullLogin();

  }); 

  test('Login mit empty password @STAGING @Login @TC-XX001', async ({page}) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    username = "tester";
    password = ""
      
    await navigate.navigateToLogin();

    // Enter username and passord
    await loginPage.login(username,password)

    // Expect that error message is available 
    await expect(loginPage.passwordWrongMsg).toBeVisible();

    //assertion not-successfull login with invalid credentials
    await loginPage.verifysuccessfullLogout()

  });
});

