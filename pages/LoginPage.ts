import {Locator, Page} from '@playwright/test';
import BasePage from './BasePage';
import { StepLogger } from "../utils/StepLogger";


export class LoginPage extends BasePage {

    private usernameInput: Locator;
    private passwordInput: Locator;
    private submitButton: Locator;
    private logoutButton: Locator;
    private registrationButton: Locator;

    usernameWrongMsg: Locator;
    passwordWrongMsg: Locator;

    loginContainer: Locator;
    header:Locator;

    fileName: string;
    
    constructor(page: Page) {
        super(page);

        this.usernameInput = page.locator("//input[@id='login-username-']");
        this.passwordInput = page.locator("//input[@id='login-password']");
        this.submitButton = page.locator("//input[@id='login-submit']"); 
        this.registrationButton = page.locator("//a[normalize-space()='Anmelden']");
        
        this.usernameWrongMsg = page.locator("//span[@id='login-username-msg']");
        this.passwordWrongMsg = page.locator("//span[@id='login-password-msg']");

        this.loginContainer = page.locator('#loginContainer')
        this.logoutButton = page.locator("//a[normalize-space()='Logout']")
        this.header = page.locator("'//div[@id='overlay']'")

        // Initialize the fileName variable to the current file name
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

    }
    
    async UsernameInputField(username: string, stepCount: number, testName: string): Promise<void> {

        const methodName = this.UsernameInputField.name;

        try {
            await this.usernameInput.waitFor({ state: 'visible' });
            await this.usernameInput.fill(username);
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.usernameInput
            );
            
            StepLogger.testEnd();
            throw new Error(`Failed to fill username field: ${errorMessage}`);
        }
    }

    async PasswordInputField(password: string, stepCount: number, testName: string): Promise<void> {

        const methodName = this.PasswordInputField.name;

        try {
            await this.passwordInput.waitFor({ state: 'visible' });
            await this.passwordInput.fill(password);
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.passwordInput
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async ClickSubmitButton(stepCount: number, testName: string): Promise<void> {

        const methodName = this.ClickSubmitButton.name;
        

        try {
            await this.submitButton.waitFor({ state: 'visible' });
            await this.submitButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.submitButton
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async ClickRegistrationButton(stepCount: number, testName: string): Promise<void> {
        
        const methodName = this.ClickRegistrationButton.name;

        try {
            await this.registrationButton.waitFor({ state: 'visible' });
            await this.registrationButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                this.registrationButton
            );

            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

}