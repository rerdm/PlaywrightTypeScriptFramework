import { Page,Locator } from "playwright/test";
import { StepLogger } from "../utils/StepLogger";

export default class MenubarItems {

    private page: Page;
    private homeMenuButton: Locator;
    private aboutMenuButton: Locator;
    private shopMenuButton: Locator;
    private contactMenuButton: Locator;
    private loginMenuButton: Locator;
    private cartMenuButton: Locator;

    private fileName: string;

    constructor(page: Page) {
        this.page = page;
        this.homeMenuButton = this.page.locator("//a[normalize-space()='Home']");
        this.aboutMenuButton = this.page.locator("//a[normalize-space()='About']");
        this.shopMenuButton = this.page.locator("//a[normalize-space()='Shop']");
        this.contactMenuButton = this.page.locator("//a[normalize-space()='Contactt']"); 
        this.loginMenuButton = this.page.locator("//a[normalize-space()='Login']");
        this.cartMenuButton = this.page.locator('#shoppingcart');

        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    }

    async HomeButtonClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.HomeButtonClick.name;
        
        try {
            await this.homeMenuButton.waitFor({ state: 'visible' });
            await this.homeMenuButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.homeMenuButton
            );
            
            StepLogger.testEnd();
             throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async AboutbuttonClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.AboutbuttonClick.name;
        
        try {
            await this.aboutMenuButton.waitFor({ state: 'visible' });
            await this.aboutMenuButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.aboutMenuButton
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async ShopButtonClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.ShopButtonClick.name;
        
        try {
            await this.shopMenuButton.waitFor({ state: 'visible' });
            await this.shopMenuButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.shopMenuButton
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }   

    async ContactButtonClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.ContactButtonClick.name;
        
        try {
            await this.contactMenuButton.waitFor({ state: 'visible' });
            await this.contactMenuButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.contactMenuButton
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async LoginButtonClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.LoginButtonClick.name;
        
        try {
            await this.loginMenuButton.waitFor({ state: 'visible' });
            await this.loginMenuButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.loginMenuButton
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async CartButtonClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.CartButtonClick.name;
        
        try {
            await this.cartMenuButton.waitFor({ state: 'visible' });
            await this.cartMenuButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.cartMenuButton
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }
}