import { test, expect } from '@playwright/test';
import RegisterPage from '../pages/registration_staging.page';
import Navigate from '../components/navigate_staging.component';
import { faker } from '@faker-js/faker';
import { userRegistry } from '../utils/user-registry';


test.describe('Registrierungsprozess', () => {
  let registerPage: RegisterPage;
  let navigate: Navigate;


  test.beforeAll(async () => {
    // Optional: Hier können Sie globale Setup-Operationen durchführen, die vor allen Tests ausge
  });

  // Setup für jeden Test
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    navigate = new Navigate(page);
    await page.context().clearCookies();
    await navigate.navigateToStartPage();

    // Zeitstempel-Log am Testbeginn
    console.log(`🕐 Test gestartet um  ${new Date().toLocaleString('de-DE')}`);
  });

  test.afterEach(async ({ page }) => {
    console.log(`🕐 Test beendet um: ${new Date().toLocaleString('de-DE')}`);
  
  });

  // rerd 2025-07-22 passed
  test('Registration successfully @STAGING @Registration @TC-X0000', async ({ page }) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    const username = registerPage.generateValidUsername(); // Zufälliger, valider Benutzername
    const password = registerPage.generateValidPassword(faker.internet.password()); // Zufälliges Passwort

    console.log(`👤 Generated Username: ${username}`);
    console.log(`🔒 Generated Password: ${password}`);


    await navigate.navigateToRegistrieren(); 

    await registerPage.fillRegistrationForm(username, password, password, true);
    await registerPage.submitForm();

    // ecxpectations
    await registerPage.verifySuccessMessage();
    await registerPage.verifyUrlAfterOk();
    

  });

  // rerd 2025-07-22 passed
  test('Username too short @STAGING @Registration @TC-X0001', async ({ page }) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm('abc', 'Passwort123!', 'Passwort123!', true);// too short username

    await expect(page.locator('text=Bitte mindestens 4 Zeichen eingeben.')).toBeVisible();

  
  });

  // rerd 2025-07-22 passed
  test('Username with special characters @Registration @TC-X0002', async () => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    await navigate.navigateToRegistrieren();

    await registerPage.fillRegistrationForm('test_user@123', 'Passwort123!', 'Passwort123!', true);
    await registerPage.submitForm();

    // ecxpectations
    await registerPage.checkUsernameErrorMessage('Bitte einen gültigen Namen eingeben:');
    await registerPage.checkUsernameErrorMessage('4-12 Zeichen: a-z, A-Z, 0-9, Umlaute');

  });


  test('Password too short @Registration @TC-X0003 ', async ({ page }) => {

    console.log(`📝 Aktueller Test : ${test.info().title}`);

    await navigate.navigateToRegistrieren();
    
    await registerPage.fillRegistrationForm('tester123', 'short', 'short', true); //pw-short

    // ecxpectations
    await expect(page.locator('text=8-20 Zeichen: a-z, A-Z, 0-9, @$!%*?')).toBeVisible();

  });
});
