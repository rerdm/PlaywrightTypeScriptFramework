import {expect, Locator, Page} from '@playwright/test';
import Navigate from '../components/navigate_staging.component';

class LoginPage{
    page: Page;
    submitButton: Locator;
    usernameInput: Locator;
    passwordInput: Locator;
    //profilButton: Locator;
    //logoutButton: Locator;
    usernameWrongMsg: Locator;
    passwordWrongMsg: Locator;
    logoutButton: Locator;
    //body: Locator;
    loginContainer: Locator;
    //profil: Locator;
    header:Locator;
    

    constructor(page: Page){
     this.page = page;
    
     this.usernameInput = page.locator("//input[@id='login-username']");
     this.passwordInput = page.locator("//input[@id='login-password']");


     this.usernameWrongMsg = page.locator("//span[@id='login-username-msg']");
     this.passwordWrongMsg = page.locator("//span[@id='login-password-msg']");

     this.loginContainer = page.locator('#loginContainer')

     this.submitButton = page.locator("//input[@id='login-submit']"); 

     this.logoutButton = page.locator("//a[normalize-space()='Logout']")
     this.header = page.locator('//header')
    }
    
    async login(username: string,password:string) {
        await this.usernameInput.fill(username)
        await this.passwordInput.fill(password)
        await this.page.waitForTimeout(1500);
        await this.submitButton.click()
    
    }

    async verifySuccessfullLogin(){
       await expect(this.logoutButton).toBeVisible();
       await expect(this.logoutButton).toBeVisible();
    }

    async verifysuccessfullLogout(){
      const navigate = new Navigate(this.page)
      
      // rerd 2025-07-16
      // added try catch and logging for better error handling
      try {
        await expect(this.logoutButton).not.toBeVisible();
        await expect(this.logoutButton).not.toBeVisible();
        await expect(this.loginContainer).toBeVisible();
      } catch (error) {
        throw new Error(`Logout verification failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

}

export default LoginPage;