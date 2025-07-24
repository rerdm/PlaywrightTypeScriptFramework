/* eslint-disable @typescript-eslint/no-unused-vars */
import { test, expect } from '@playwright/test';
import Navigate from '../components/navigate.component';
import LoginPage from '../pages/login.page';


test.describe('LoginProzess', () => {
  test.use({storageState: 'notLoggedInState.json'})
  let navigate: Navigate;
  let loginPage: LoginPage;
  let username: string;
  let password: string;

  test.beforeEach(async ({ page }) => {
    navigate = new Navigate(page);
    loginPage = new LoginPage(page);
    await page.context().clearCookies();
    await navigate.navigateToLogin();

    // Zeitstempel-Log am Testbeginn jedes Tests
    const startTime = new Date().toISOString();
    console.log(`🕐 Test gestartet um  ${new Date().toLocaleString('de-DE')}`);
  });

  test.afterEach(async ({ page }) => {
    
    // Zeitstempel-Log am Testende jedes Tests
    const endTime = new Date().toISOString();
    console.log(`🕐 Test beendet um: ${endTime}`);
    console.log(`🧪 Executing Test: Registration successfully\n`);
  });

   // Test Case 1: Login with valid credentials - rerd 2025-07-22 OK
  test('Successfull login @Login @TC-10000', async ({ page }) => {
    username = "tester";
    password = "passwort"
   
    await navigate.navigateToLogin();

    await loginPage.login(username,password)
    
    // Fix: Use locator.waitFor() instead of page.waitForSelector() with locator object
    //await loginPage.profil.waitFor({ state: 'visible' });
    
    //assertion successfull login with valid credentials
    await loginPage.verifySuccessfullLogin();


  })

   // Test Case 2: Login with invalid username - 2025-07-17 OK
  test('Login mit unvalid username @Login @TC-10001', async ({page}) => {


    username = "tester"; 
    password = "passwort"

    await navigate.navigateToLogin();

    //Fill username and and click on password input
    await loginPage.usernameInput.fill(username)
    await loginPage.passwordInput.click()

    // expect that error message is visible
    await expect(loginPage.usernameWrongMsg).toBeVisible

    //Fill in password and click submit
    await loginPage.passwordInput.fill(password)
    await loginPage.submitButton.click()

    // expect that error message is visible
    await expect(loginPage.passwordWrongMsg).toBeVisible

    //assertion not-successfull login with invalid credentials
    //await loginPage.verifysuccessfullLogout()

  })


    // Test Case 3: Login with invalid password - 2025-07-17 OK
   test('Login mit unvalid password @Login @TC-10002', async ({page}) => {

    username = "tester";
    password = "nopassword"

     await navigate.navigateToLogin();
    
    // Enter username and passord
    await loginPage.login(username,password)

    // Expect that error message is available 
    await expect(loginPage.passwordWrongMsg).toBeVisible

    //assertion not-successfull login with invalid credentials
    await loginPage.verifysuccessfullLogout()
  
   })


    // Test Case 4: Login with empty password - 2025-07-17 OK
  test('Login mit empty password @Login @TC-10003', async ({page}) => {

    username = "tester";
    password = ""
       
    // Enter username and passord
    await loginPage.login(username,password)

    // Expect that error message is available 
    await expect(loginPage.passwordWrongMsg).toBeVisible

    //assertion not-successfull login with invalid credentials
    await loginPage.verifysuccessfullLogout()
  
    })


    // Test Case 5: Login with empty credentials - 2025-07-17 OK
  test('Login mit empty password and username @Login @TC-10004', async ({page}) => {

    username = "";
    password = ""
    
    // Enter username and password
    await loginPage.login(username,password)

    // Expect that error message is available 
    await expect(loginPage.passwordWrongMsg).toBeVisible  

    //assertion not-successfull login with invalid credentials
    await loginPage.verifysuccessfullLogout()
  
  })


  // Test Case 6: successfull log-in and then log-out - 2025-07-17 OK
  test('successfull log-in and log-out @Login @TC-10005', async ({page}) => {

    username = "tester";
    password = "passwort"
    
    // Enter username and password
    await loginPage.login(username,password)

    //assertion that the elements are enabled
    await expect(loginPage.profilButton).toBeEnabled
    await expect(loginPage.logoutButton).toBeEnabled
    
    //log out
    await loginPage.logoutButton.click()

    //assertion logout was sucessfull
    await loginPage.verifysuccessfullLogout()
  
  })


  // Test Case 7: should close the login dialog when clicking outside
  // um einen TC hintereinander 5 mal auszuführen:  for ($i = 1; $i -le 5; $i++) { npx playwright test login.spec.ts:128 }  

  test('should close the login dialog when clicking outside @Login @TC-10006', async ({ page }) => {

    await expect(loginPage.loginContainer).toBeVisible
    // click header to close login-overlay 
    const header = loginPage.header.click({
      timeout: 3000,  // Timeout for the click operation. The test will wait for a maximum of 3000ms (3 seconds) before throwing an error.
      force: true,    // Force the click even if the element is not visible or interactable. Use this cautiously, as it can lead to unreliable interactions.
      button: 'left'  // The mouse button to use for the click. It can be 'left', 'middle', or 'right'.
    });
    // Assertion to login overlay is closed 
    await expect(loginPage.loginContainer).toBeHidden();
    //assertion unlogged
    await loginPage.verifysuccessfullLogout()
  
  });


    // Test Case 8: After Login close the Login Overlay
  test('After successfull login Login-Dialog is closed @Login @TC-10007', async ({ page}) => {  
    username = "tester";
    password = "passwort"
    //log in
    await loginPage.login(username,password);
    //assertion to login overlay is closed 
    await expect(loginPage.loginContainer).toBeHidden();
    //assertion user is logged in
    await loginPage.verifySuccessfullLogin()
  });


  
  // Testcase 9: Verify the layout and design of the login dialog
  test('TC_Login_09: Ensure the login dialog matches the design specifications @Login @TC-10008', async ({ page }) => {
  // Verify login-dialog is visiable
  await expect(loginPage.loginContainer).toBeVisible();

  // 2. Verify if the dialog is centered
  const dialogBoundingBox = await loginPage.loginContainer.boundingBox();
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  const viewportHeight = await page.evaluate(() => window.innerHeight);

  // The dialog should be horizontally and vertically centered
  expect(dialogBoundingBox!.x).toBeCloseTo(viewportWidth / 2 - dialogBoundingBox!.width / 2, 1);
  expect(dialogBoundingBox!.y).toBeCloseTo(viewportHeight / 2 - dialogBoundingBox!.height / 2, 1);

   // 3. Verify that the background content is grayed out and non-interactive
   await  loginPage.body;  // Replace with the actual CSS selector for the background content
   await expect(backgroundContent).toHaveCSS('opacity', '0.5'); // Assuming the background is grayed out
 
   // 4. Verify the visibility of error messages
   await loginPage.errorMessage; // Replace with the actual selector for the error message
   await expect(errorMessage).toBeVisible();
   await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)'); // Assuming error message color is red
 
   // Additional tests can be added, for example, checking if the dialog is not interactive
   // (e.g., by checking the disabled status of form fields)
 });



 //Testcase 10: Verify the visibility of error messages
 test('Verify the visibility of error messages @Login @TC-10009', async ({ page }) => {
  username = "nobody";
  password = "passwort"
 
   //assertion message from username-input
  await loginPage.usernameInput.fill(username)
  await loginPage.passwordInput.click()
  await expect(loginPage.usernameWrongMsg).toBeVisible();
  await expect(loginPage.usernameWrongMsg).toHaveCSS('color', 'rgb(255, 0, 0)'); // Assuming error message color is red

  //error message Password input
  await loginPage.usernameInput.fill('tester')
   await loginPage.passwordInput.fill("");
   await loginPage.submitButton.click();
   await expect(loginPage.passwordWrongMsg).toBeVisible();
   await expect(loginPage.passwordWrongMsg).toHaveCSS('color', 'rgb(255, 0, 0)'); // Assuming error message color is red


   




 });






});