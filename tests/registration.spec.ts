import { test, expect } from '@playwright/test';
import RegisterPage from '../pages/registration.page';
import { faker } from '@faker-js/faker';
import { userRegistry } from '../utils/user-registry';


test.describe('Registrierungsprozess', () => {
  let registerPage: RegisterPage;

  // Setup für jeden Test
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await page.context().clearCookies();
  });


  test('Registration successfully @Registration @TC-20000', async ({ page }) => {

    const username = registerPage.generateValidUsername(); // Zufälliger, valider Benutzername
    const password = registerPage.generateValidPassword(faker.internet.password()); // Zufälliges Passwort

    console.log(`🧪 Executing Test: Registration successfully`);
    console.log(`👤 Generated Username: ${username}`);
    console.log(`🔒 Generated Password: ${password}`);

    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm(username, password, password, true);
    await registerPage.submitForm();
    await registerPage.verifySuccessMessage();
    await registerPage.verifyUrlAfterOk();

    // Benutzer in der Registry speichern
    //try {
    //  const baseUrl = process.env.BASE_URL || 'unknown';
    // console.log(`🌍 Current BASE_URL: ${baseUrl}`);
      
    //  userRegistry.addUser(username, password, baseUrl);
    //  console.log(`✅ User successfully registered in user registry`);
      
      // Zeige aktuelle Statistiken
      //userRegistry.showStatistics();
      
    //} catch (error) {
    //  console.error('❌ Error saving user to registry:', error instanceof Error ? error.message : String(error));
      // Test sollte trotzdem weiterlaufen, auch wenn Registry-Speicherung fehlschlägt
    //}

  });

  // Kombinierter Test Case
  test('Registration with valid input data and username already taken @Registration @TC-20001', async ({ page }) => {
    const username = registerPage.generateValidUsername(); // Zufälliger, valider Benutzername
    const password = registerPage.generateValidPassword(faker.internet.password()); // Zufälliges Passwort

    // Ausgabe des zufällig generierten Benutzernamens und Passworts
    console.log(`Verwendeter Benutzername: ${username}`);
    console.log(`Verwendetes Passwort: ${password}`);

    // 1. Registrierung mit gültigen Daten
    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm(username, password, password, true);
    await registerPage.submitForm();
    await registerPage.verifySuccessMessage();
    await registerPage.verifyUrlAfterOk();
   
    // 2. Wiederholung der Registrierung mit denselben Daten
    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm(username, password, password, true);
    await registerPage.verifyUsernameTakenError();
  });

  // Test Case 3: Invalid username (too short)
  test('Username too short @Registration @TC-20002', async ({ page }) => {

    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm('abc', 'Passwort123!', 'Passwort123!', true);// too short username
    await expect(page.locator('text=Bitte mindestens 4 Zeichen eingeben.')).toBeVisible();
  });

  // Test Case 4: Username with special characters
  test('Username with special characters @Registration @TC-20003', async () => {
    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm('test_user@123', 'Passwort123!', 'Passwort123!', true);
    await registerPage.submitForm();

     //Check if the error message is displayed
    await registerPage.checkUsernameErrorMessage('Bitte einen gültigen Namen eingeben:');
    await registerPage.checkUsernameErrorMessage('4-12 Zeichen: a-z, A-Z, 0-9, Umlaute');
  });

  // Test Case 5: Invalid password (too short)
  test('Password too short @Registration @TC-20004', async ({ page }) => {
    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm('tester123', 'short', 'short', true); //pw-short

    //Check if the error message is displayed
    await expect(page.locator('text=8-20 Zeichen: a-z, A-Z, 0-9, @$!%*?')).toBeVisible();
  });

  // Test Case 6: Passwords do not match
  test('Passwords do not match @Registration @TC-20005', async ({ page }) => {
    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm('tester123', 'Passwort123!', 'Passwort12', true); // different password

    // Check if the error message is displayed
    await expect(page.locator('text=Die Passwörter stimmen nicht überein')).toBeVisible();
  });

    // Test Case 7: Password too long (more than 20 characters)
    test('Passwort zu lang @Registration @TC-20006', async ({ page }) => {
      await registerPage.navigateToRegister();
      await registerPage.fillRegistrationForm('testuser123', 'Passwort123456789012345', 'Passwort123456789012345', true); // Password with more than 20 characters

      // Check if the error message is displayed
      await expect(page.locator('text=8-20 Zeichen: a-z, A-Z, 0-9, @$!%*?')).toBeVisible();
    });
  
    // Test Case 8: Password without special characters
    test('Passwort ohne Sonderzeichen @Registration @TC-20007', async ({ page }) => {
      await registerPage.navigateToRegister();
      await registerPage.fillRegistrationForm('tester123', 'Passwort123', 'Passwort123', true); // Password without special characters
      
      // Check if the error message is displayed
      await expect(page.locator('text=8-20 Zeichen: a-z, A-Z, 0-9, @$!%*?')).toBeVisible();
    });
  
    // Test Case 9: Password without uppercase or lowercase letters
    test('Password without uppercase or lowercase letters @Registration @TC-20008', async ({ page }) => {
      await registerPage.navigateToRegister();
      await registerPage.fillRegistrationForm('tester123', '12356887', '12356887', true);

      // Check if the error message is displayed
      await expect(page.locator('text=8-20 Zeichen: a-z, A-Z, 0-9, @$!%*?')).toBeVisible();
  
    });

  // Test Case 10: Password with disallowed special characters (&)
  test('Password with disallowed special characters (&) @Registration @TC-20009', async ({ page }) => {
    await registerPage.navigateToRegister();
    
    // Füllen des Formulars mit dem ungültigen Passwort
    await registerPage.fillRegistrationForm('tester123', 'Passw&ord123', 'Passw&ord123', true);
    await registerPage.submitForm();
      
    // Überprüfen, ob eine Fehlermeldung erscheint
    await expect(page.locator('text=8-20 Zeichen: a-z, A-Z, 0-9, @$!%*?')).toBeVisible();
  });

  // Test Case 11: Terms and conditions not accepted
  test('Terms and conditions not accepted @Registration @TC-20010', async ({ page }) => {
    await registerPage.navigateToRegister();
    await registerPage.fillRegistrationForm('tester123', 'Password123', 'Password123', false);
    await registerPage.submitForm();

    // Check if the error message is displayed
    await expect(page.locator('text=Bitte den AGB zustimmen')).toBeVisible();
  });

 
  // Test Case 12: The link to the terms and conditions opens in a new tab
  test('Terms and conditions link opens in a new tab @Registration @TC-20011', async ({ page }) => {
  await registerPage.navigateToRegister();
  
  // Click on the link and check immediately if the URL is correct.
  await page.click('//*[@id="footer"]/div[1]/a');
  await expect(page).toHaveURL('http://10.40.226.38/Praxis_FFM_2024-12/agb.php');
  });

  // Test Case 13: Missing input fields
  test('Fehlende Eingabefelder @Registration @TC-20012', async ({ page }) => {
  await registerPage.navigateToRegister();
    
  // Leave the password field empty
  await registerPage.fillRegistrationForm('tester123', '', '');  // Passwort is empty
  await registerPage.submitForm();

  // Check if an error message for the password is displayed
  await expect(page.locator('text=Bitte ein Passwort eingeben')).toBeVisible();
  });

})
