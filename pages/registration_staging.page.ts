import { Page, Locator, expect } from '@playwright/test';
import Navigate from '../components/navigate_staging.component'; 
import { faker } from '@faker-js/faker';

class RegisterPage {
  page: Page;
  usernameInput: Locator;
  passwordInput: Locator;
  passwordRepeatInput: Locator;
  termsCheckbox: Locator;
  submitRegButton: Locator;

  registerBtn: Locator;  // Button for the registration process.
  loginButton: Locator; // Button to navigate to the login page.
  okButton: Locator;
  errorMessage: Locator;  // Error message for invalid inputs.
  usernameError: Locator; // Error message for invalid username (e.g., special characters)
  usernameTakenError: Locator;
  successMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Locators for the registration form
    this.usernameInput = page.locator("//input[@id='register-username']");
    this.passwordInput = page.locator("//input[@id='register-pw']");
    this.passwordRepeatInput = page.locator("//input[@id='register-pwrep']");

    this.termsCheckbox = page.locator('//*[@id="register-check"]');
    this.submitRegButton = page.locator('//*[@type="submit"]');

    // Buttons
    this.loginButton = page.locator("//a[normalize-space()='Login']");
    this.registerBtn = page.locator("//a[normalize-space()='Registrieren']");
    this.okButton = page.locator("//button[normalize-space()='OK']");

    // Error messages
  	this.errorMessage = page.locator("//span[@id='agbmsg']");
  	this.usernameError = page.locator("//span[@id='usrmsg']");  // Error message for invalid username
    this.usernameTakenError = page.locator('text=Dieser Name ist schon vergeben.');

    // Success message
    this.successMessage = page.locator("//h2[normalize-space()='Deine Registrierung war erfolgreich!']");
  }
  
  // Funktion zur Erzeugung eines gültigen Benutzernamens
  generateValidUsername() {
    const username = faker.internet.userName();
  
  // Erlaubte Zeichen für den Benutzernamen (alphanumerisch + Umlaute)
    const validUsername = username.replace(/[^a-zA-Z0-9äöüÄÖÜ]/g, '').slice(0, 12); // max. 12 Zeichen
  
  // Falls der generierte Name kürzer als 4 Zeichen ist, fügen wir zufällige Zeichen hinzu
  return validUsername.length < 4 ? validUsername + '123' : validUsername;
};

generateValidPassword(password: string): string {
  // Erlaubte Zeichen für das Passwort
  const validPassword = password.replace(/[^a-zA-Z0-9@$!%*?]/g, '').slice(0, 20); // max. 20 Zeichen
  
  // Falls das generierte Passwort kürzer als 8 Zeichen ist, fügen wir zufällige Zeichen hinzu
  return validPassword.length < 8 ? validPassword + '123' : validPassword;
}

  // Filling out the registration form
  async fillRegistrationForm(username: string, password: string, password2: string, acceptTerms: boolean = true) {
	  await this.usernameInput.pressSequentially(username, { delay: 100 });
	  await this.passwordInput.pressSequentially(password, { delay: 100 });
	  await this.passwordRepeatInput.pressSequentially(password2, { delay: 100 });
  
	if (acceptTerms) {
	  await this.termsCheckbox.check();  // for Test case 11
	}
  }

  // Submitting the form
  async submitForm() {
    await this.submitRegButton.click();
  }

  async navigateToLogin() {
    const navigate = new Navigate(this.page);
    try {
      await navigate.navigateToLogin();
      await this.loginButton.click();
    } catch (error) {
      console.error('Error navigating to the registration page or clicking the register button:', error);
      throw error;
    }
  }

  // Method for navigating to the registration page with login
  async navigateToRegister() {
    const navigate = new Navigate(this.page);
    try {
      await navigate.navigateToLogin();
      await this.registerBtn.click();
    } catch (error) {
      console.error('Error navigating to the registration page or clicking the register button:', error);
      throw error;
    }
  }

  async verifyUrlAfterOk() {
    await this.okButton.click();
    // Wait until the expected URL is loaded
    await this.page.waitForURL(process.env.BASE_URL ?? '**/index.php');
  }

  // Checking if an error message is visible
  async checkErrorMessage(expectedMessage: string) {
    await expect(this.errorMessage).toHaveText(expectedMessage);
  }
  
  // Checking the error message for the username
  async checkUsernameErrorMessage(expectedMessage: string) {
    const errorText = await this.usernameError.textContent();
    expect(errorText).toContain(expectedMessage);
  };

  // Verify if the success message appears
  async verifySuccessMessage() {
    await expect(this.successMessage).toBeVisible();
  };

  // Verify if the username already taken error is visible
  async verifyUsernameTakenError() {
    await expect(this.usernameTakenError).toBeVisible();
  }
}

export default RegisterPage;