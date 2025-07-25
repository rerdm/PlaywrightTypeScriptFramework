import {expect, Locator, Page} from '@playwright/test';
import Navigate from '../components/navigate_staging.component';
import { logStep, logStepError, logStepSuccess } from '../utils/logStep'

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

     this.submitButton = page.locator("//input[@id='login-submitX']"); 

     this.logoutButton = page.locator("//a[normalize-space()='Logout']")
     this.header = page.locator('//header')
    }
    
    async login(username: string,password:string, stepCount: number): Promise<number> {

        logStep(++stepCount, 'Enter Username', this.passwordInput);


        try {
            await this.usernameInput.fill(username)
            logStepSuccess(stepCount, 'Successfully filled Username input', this.usernameInput);
        }
        catch (error) {
            logStepError(stepCount, 'FAILED: The Username input field cannot be found or is not available', this.usernameInput);
            throw error;
        }

        logStep(++stepCount, 'Enter Pasword', this.passwordInput);

        try {
            await this.passwordInput.fill(password)
            logStepSuccess(stepCount, 'Successfully filled Password input', this.passwordInput);
        }
        catch (error) {
            logStepError(stepCount, 'FAILED: The Password input field cannot be found or is not available', this.passwordInput);
            throw error;
        }

        logStep(++stepCount, 'click submit button', this.passwordInput);

        try {
            await this.submitButton.click()
            logStepSuccess(stepCount, 'Successfully clicked Submit button', this.submitButton);
        }
        catch (error) {
            logStepError(stepCount, 'FAILED: The Submit button cannot be found or is not available', this.submitButton);
            throw error;
        }
        
        return stepCount;

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