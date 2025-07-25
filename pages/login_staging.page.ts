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

     this.submitButton = page.locator("//input[@id='login-submit']"); 

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

      try{
        try {
            await expect(this.logoutButton).not.toBeVisible();
        } catch (error) {
            throw new Error(`Logout button is still visible: ${error instanceof Error ? error.message : String(error)}`);
        }

        try {
            await expect(this.logoutButton).not.toBeVisible();
        } catch (error) {
            throw new Error(`Logout button is still visible (second check): ${error instanceof Error ? error.message : String(error)}`);
        }

        try {
            await expect(this.loginContainer).toBeVisible();
        } catch (error) {
            throw new Error(`Login container is not visible: ${error instanceof Error ? error.message : String(error)}`);
        }
      } catch (error) {
        logStepError(0, 'FAILED: Logout verification failed', this.logoutButton, error instanceof Error ? error.message : String(error));
        throw error;
      }


    }

}

export default LoginPage;