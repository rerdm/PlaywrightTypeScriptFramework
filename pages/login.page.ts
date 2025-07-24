import {expect, Locator, Page} from '@playwright/test';
import Navigate from '../components/navigate.component';

class LoginPage{
    page: Page;
    submitButton: Locator;
    usernameInput: Locator;
    passwordInput: Locator;
    profilButton: Locator;
    logoutButton: Locator;
    usernameWrongMsg: Locator;
    passwordWrongMsg: Locator;
    body: Locator;
    loginContainer: Locator;
    profil: Locator;
    header:Locator;
    

    
    constructor(page: Page){
     this.page = page;
     this.submitButton = page.locator('//*[@id="login-submit"]'); 
     this.usernameInput = page.locator('//*[@id="login-username"]');
     this.passwordInput = page.locator('//*[@id="login-password"]');
     this.profilButton = page.locator('//a[@href="userprofile.php"]');
     this.logoutButton = page.locator('//a[@href="login.php"]');
     this.usernameWrongMsg = page.locator('#login-username-msg');
     this.passwordWrongMsg = page.locator('#login-password-msg');
     this.loginContainer = page.locator('#loginContainer')
     // rerd 2025-07-16
     //this.body.backgroundContent = page.locator('//body');
     //this.errorMessage = page.locator('.error-message'); 
     this.profil = page.locator('//*[text()="Profil"]')
     this.header = page.locator('//header')
    }

    async login(username: string,password:string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.submitButton.click()
    
    }

    async verifySuccessfullLogin(){
       await expect(this.logoutButton).toBeVisible();
       await expect(this.profilButton).toBeVisible();
    }

    async verifysuccessfullLogout(){
      const navigate = new Navigate(this.page)
      
      // rerd 2025-07-16
      // added try catch and logging for better error handling
      try {
        await expect(this.logoutButton).not.toBeVisible();
        await expect(this.profilButton).not.toBeVisible();

      } catch (error) {
        throw new Error(`Logout verification failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

}

export default LoginPage;