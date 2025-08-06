
import { StartPage } from "../pages/StartPage";
import { LoginPage } from "../pages/LoginPage";
import { LoggedInPage } from "../pages/LoggedInPage";
import { RegistrationPage } from "../pages/RegistrationPage";


import MenubarItems from "../components/menubar.component";
import { test, expect } from '@playwright/test';
import { loadEnvironmentConfig } from '../utils/environment-config';
import { StepLogger } from "../utils/StepLogger";


test.describe('Login Page Tests', () => {


  let startPage: StartPage;
  let loginPage: LoginPage;
  let loggedInPage: LoggedInPage;
  let registrationPage: RegistrationPage;


  let envConfig = loadEnvironmentConfig();
  let expectedUrl = envConfig.baseURL;
  let testSpecName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
  let stepCount = 0;
  let testName: string;

  let newUser: string;
  let password: string;
  let passwordRepeat: string;

  test.beforeEach(async ({ page }) => {

    startPage = new StartPage(page);
    loginPage = new LoginPage(page);
    loggedInPage = new LoggedInPage(page);
    registrationPage = new RegistrationPage(page);

  });

  test.beforeAll(async () => {
    // Load environment configuration
     const testSpecName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    
  });

  test.afterAll(async () => {
    // Optionally, you can add cleanup code here if needed
    // HTML Report wird jetzt global in global-teardown.ts generiert
    console.log('✅ Login tests completed');
  });
 
  test('Open Website and Login in @REGISTRATION-001', async ({ page }) => {

    // This test uses fresh session without storage state
    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title,

    newUser = "VPNUser02";
    password = "password1234";
    passwordRepeat = password

    StepLogger.startTest(testName, envConfig.environment, testSpecName);

    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount, expectedUrl, testName);

    // Step 2
    stepCount++;
    await startPage.MenubarItems.LoginButtonClick(stepCount, testName);

    // Step 3
    stepCount++;
    await loginPage.ClickRegistrationButton(stepCount, testName);

    // Step 4
    stepCount++;
    await registrationPage.UsernameInputField(newUser,stepCount, testName);

    // Step 5
    stepCount++;
    await registrationPage.PasswordInputField(password, stepCount, testName);
    StepLogger.logRegisteredUSer(newUser, password);

    // Step 6
    stepCount++;
    await registrationPage.PasswordRepeadtInputField(password, stepCount, testName);


    // Step 7
    stepCount++;
    await registrationPage.ClickAgbCheckBox(stepCount, testName);


    // Step 7
    stepCount++;
    await registrationPage.ClickRegistrationButton(stepCount, testName);

    

    StepLogger.testEnd();




  });

  test('Open Website and Login in with invalid credentials @REGISTRATION-002', async ({ page }) => {
    // This test uses the logged-in storage state from the config

    // This test uses fresh session without storage state
    await page.context().clearCookies();
    await page.context().clearPermissions();
    stepCount = 0;
    testName = test.info().title;
    
    StepLogger.startTest(testName, envConfig.environment, testSpecName);
    
    let invalidUsername = 'invalidUser';
    let invalidPassword = 'invalidPassword';

    // Step 1
    stepCount++;
    await startPage.openUrl(stepCount, expectedUrl, testName);

    // Step 
    stepCount++;
    await loginPage.MenubarItems.LoginButtonClick(stepCount, testName);

    // Step 3
    stepCount++;
    await loginPage.UsernameInputField(invalidUsername, stepCount, testName);

    // Step 4
    stepCount++;
    await loginPage.PasswordInputField(invalidPassword, stepCount, testName);

    // Step 5
    stepCount++;
    await loginPage.ClickSubmitButton(stepCount, testName);

    // Step 6
    stepCount++;
    await registrationPage.CheckIfLogoutButtonIsNotAvailabel(stepCount, invalidUsername);

    StepLogger.testEnd();

  });




});