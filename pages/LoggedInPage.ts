import {expect, Locator, Page} from '@playwright/test';
import BasePage from './BasePage';
import { StepLogger } from "../utils/StepLogger";


export class LoggedInPage extends BasePage {

    private profilButton: Locator;
    private logoutButton: Locator;

    constructor(page: Page) {
        super(page);

        this.profilButton = page.locator("//a[normalize-space()='Profil']");
        this.logoutButton = page.locator("//a[normalize-space()='Logout']");
      
        // Initialize the fileName variable to the current file name
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

    }


    async ProfileButtonClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.ProfileButtonClick.name;
        
        try {
            await this.profilButton.waitFor({ state: 'visible' });
            await this.profilButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.profilButton
            );
            
            StepLogger.testEnd();
            throw new Error(`Error deteils : ${errorMessage}`);
        }
    }

    async Logoutbutton(stepCount: number, testName: string): Promise<void> {

        const methodName = this.Logoutbutton.name;
        
        try {
            await this.logoutButton.waitFor({ state: 'visible' });
            await this.logoutButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.logoutButton  // Korrektur: war profilButton
            );
            
            StepLogger.testEnd();
            throw new Error(`Error deteils : ${errorMessage}`);
        }
    }

    async CheckIfLoggedInUsernameIsVisble(stepCount: number, username: string, testName: string): Promise<void> {

        const methodName = this.CheckIfLoggedInUsernameIsVisble.name;

        const dynamicUsernameLocator = this.page.locator(`//td[normalize-space()='${username}']`);
        
        try {
            await dynamicUsernameLocator.waitFor({ state: 'visible', timeout: 5000 });
            await expect(dynamicUsernameLocator).toBeVisible({ timeout: 5000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                dynamicUsernameLocator
            );
            
            StepLogger.testEnd();
            throw new Error(`Error deteils : ${errorMessage}`);
        }
    }

}
