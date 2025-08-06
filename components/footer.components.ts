import { Page,Locator } from "playwright/test";
import { StepLogger } from "../utils/StepLogger";

export default class FooterItems {

    page: Page;
    agbButton: Locator;
    emailLink: Locator;
    footerText: Locator;
    fileName: string;

    constructor(page: Page) {
        this.page = page;
        this.agbButton = this.page.locator("//a[normalize-space()='AGB']");
        this.emailLink = this.page.locator("//a[normalize-space()='finetest@coffee.inc']");
        this.footerText = this.page.locator("#footer");
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    }

    FooterItems() {
        return new FooterItems(this.page);
    }

    async agbButtoClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.agbButtoClick.name;
        
        try {
            await this.agbButton.waitFor({ state: 'visible' });
            await this.agbButton.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.agbButton
            );
            
            StepLogger.testEnd();
            throw new Error(`Failed to click AGB button: ${errorMessage}`);
        }
    }

    async emailLinkClick(stepCount: number, testName: string): Promise<void> {

        const methodName = this.emailLinkClick.name;
        
        try {
            await this.emailLink.waitFor({ state: 'visible' });
            await this.emailLink.click({ timeout: 10000 });
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.emailLink
            );
            
            StepLogger.testEnd();
            throw new Error(`Failed to click email link: ${errorMessage}`);
        }
    }

    async getFooterText(stepCount: number, testName: string): Promise<string> {
        
        const methodName = this.getFooterText.name;
        
        try {
            await this.footerText.waitFor({ state: 'visible' });
            const text = await this.footerText.textContent();
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
            return text ? text.trim() : '';
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            await StepLogger.logStepFailed(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                this.footerText
            );
            
            StepLogger.testEnd();
            throw new Error(`Failed to get footer text: ${errorMessage}`);
        }
    }
}