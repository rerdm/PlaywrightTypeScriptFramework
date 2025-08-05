import {expect, Locator, Page} from '@playwright/test';
import BasePage from './BasePage';
import { StepLogger } from "../utils/StepLogger";
import test from 'node:test';


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

        this.usernameInput = page.locator("//input[@id='login-username']");
        this.passwordInput = page.locator("//input[@id='login-password']");
        this.submitButton = page.locator("//input[@id='login-submit']"); 
        this.registrationButton = page.locator("//a[normalize-space()='Anmelden']"); // Name should be change in Registration

        
        this.usernameWrongMsg = page.locator("//span[@id='login-username-msg']");
        this.passwordWrongMsg = page.locator("//span[@id='login-password-msg']");

        this.loginContainer = page.locator('#loginContainer')
        this.logoutButton = page.locator("//a[normalize-space()='Logout']")
        this.header = page.locator("'//div[@id='overlay']'")

        // Initialize the fileName variable to the current file name
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

    }
    
    async UsernameInputField(username: string, stepCount: number, testName: string) {
        

        try {
            await this.usernameInput.fill(username);
            await StepLogger.logStepSuccess(this.fileName, this.UsernameInputField.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.UsernameInputField.name,testName, stepCount,this.usernameInput);
            throw new Error();
        }
        
    }
    async PasswordInputField(password: string, stepCount: number, testName: string) {
        try {
            await this.passwordInput.fill(password);
            await StepLogger.logStepSuccess(this.fileName, this.PasswordInputField.name,testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.PasswordInputField.name, testName, stepCount, this.passwordInput);
            throw new Error();
        }
    }

    async ClickSubmitButton(stepCount: number, testName: string) {
        try {
            await this.submitButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.ClickSubmitButton.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.ClickSubmitButton.name, testName, stepCount, this.submitButton);
            throw new Error();
        }
    }

}
