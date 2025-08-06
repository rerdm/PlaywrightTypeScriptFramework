import {Locator, Page} from '@playwright/test';
import BasePage from './BasePage';
import { StepLogger } from "../utils/StepLogger";


export class RegistrationPage extends BasePage {


    fileName: string;

    private usernameInput: Locator;
    private passwordInput: Locator;
    private passwordRepeat: Locator;
    private agbCheckbox: Locator;
    private registrationButton: Locator;
    private logoutButton: Locator;

    
    constructor(page: Page) {
        super(page);


        // Initialize the fileName variable to the current file name
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

        this.usernameInput = page.locator("//input[@id='register-username']");
        this.passwordInput = page.locator("//input[@id='register-pw']");
        this.passwordRepeat = page.locator("//input[@id='register-pwrep']");
        this.agbCheckbox = page.locator("//input[@id='register-check']");
        this.registrationButton = page.locator("//input[@value='Registrieren']");
        this.logoutButton = page.locator("//a[normalize-space()='Logout']");
        

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
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
        await this.page.waitForTimeout(3000);

    }
        
    async PasswordInputField(password: string, stepCount: number, testName: string): Promise<void> {

        const methodName = this.UsernameInputField.name;

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
        await this.page.waitForTimeout(3000);
    }

    async PasswordRepeadtInputField(passwordRepead: string, stepCount: number, testName: string): Promise<void> {

        const methodName = this.PasswordRepeadtInputField.name;

        try {
            await this.passwordRepeat.waitFor({ state: 'visible' });
            await this.passwordRepeat.fill(passwordRepead);
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
           
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.passwordRepeat
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
        await this.page.waitForTimeout(3000);
    }

    async ClickAgbCheckBox(stepCount: number, testName: string): Promise<void> {
        const methodName = this.ClickAgbCheckBox.name;

        try {
            await this.agbCheckbox.waitFor({ state: 'visible' });
            await this.agbCheckbox.check();
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                this.agbCheckbox
            );

            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async ClickRegistrationButton(stepCount: number, testName: string): Promise<void> {
        
        const methodName = this.ClickRegistrationButton.name;

        try {
            await this.registrationButton.waitFor({ state: 'visible' });
            await this.registrationButton.check();
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

    
    async CheckIfLogoutButtonIsAvailabel(stepCount: number, testName: string): Promise<void> {

        const methodName = this.CheckIfLogoutButtonIsAvailabel.name;

        try {
            const isVisible = await this.logoutButton.isVisible();
            if (isVisible) {
                await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
            } else {
                await StepLogger.logStepFailed(
                    this.fileName,
                    methodName,
                    testName,
                    stepCount,
                    this.logoutButton
                );
                StepLogger.testEnd();
                throw new Error("Logout button is not visible, but it should be.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                this.logoutButton
            );
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async CheckIfLogoutButtonIsNotAvailabel(stepCount: number, testName: string): Promise<void> {

        const methodName = this.CheckIfLogoutButtonIsNotAvailabel.name;

        try {
            const isVisible = await this.logoutButton.isVisible();
            if (isVisible) {
                await StepLogger.logStepFailed(
                    this.fileName,
                    methodName,
                    testName,
                    stepCount,
                    this.logoutButton
                );
                StepLogger.testEnd();
                throw new Error("Logout button is visible, but it should not be.");
            } else {
                await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                this.logoutButton
            );
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }
}