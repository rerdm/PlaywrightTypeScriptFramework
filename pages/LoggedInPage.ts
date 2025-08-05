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

    async ProfileButtonClick(stepCount: number, testName: string) {
        
        try {
            await this.profilButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.ProfileButtonClick.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.ProfileButtonClick.name,testName, stepCount,this.profilButton);
            throw new Error();
        }
        
    }

    async Logoutbutton(stepCount: number, testName: string) {

        try {
            await this.logoutButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.Logoutbutton.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.Logoutbutton.name,testName, stepCount,this.profilButton);
            throw new Error();
        }
        
    }

    async CheckIfLoggedInUsernameIsVisble(stepCount: number, username: string, testName: string) {


        const dynamicUsernameLocator = this.page.locator(`//td[normalize-space()='${username}']`);

        try {
            await expect(dynamicUsernameLocator).toBeVisible({ timeout: 5000 });
            StepLogger.logStepSuccess(this.fileName, this.CheckIfLoggedInUsernameIsVisble.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.CheckIfLoggedInUsernameIsVisble.name, testName, stepCount, dynamicUsernameLocator);
            StepLogger.testEnd();
            throw new Error();
        }

    }

}
