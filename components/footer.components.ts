import { Page,Locator } from "playwright/test";
import { StepLogger } from "../utils/StepLogger";
import test from "node:test";


export default class FooterItems {
    // create a new instance of the Menubar class
    page: Page;
    agbButton: Locator;
    emailLink: Locator;
    footerText: Locator;
    fileName: string;


    // Constructor to initialize the page and menu buttons
    constructor(page: Page) {
        this.page = page;
        this.agbButton = this.page.locator("//a[normalize-space()='AGB']");
        this.emailLink = this.page.locator("//a[normalize-space()='finetest@coffee.inc']");
        this.footerText = this.page.locator("#footer");
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

    }

    // Method to navigate to the home page
    FooterItems() {
        return new FooterItems(this.page);
    }

    async agbButtoClick(stepCount: number, testName: string) {
        try {
            await this.agbButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.agbButtoClick.name,testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.agbButtoClick.name, testName, stepCount, this.agbButton);
            StepLogger.testEnd();
            throw new Error();
        }
    }
    async emailLinkClick(stepCount: number, testName: string) {
        try {
            await this.emailLink.click();
            await StepLogger.logStepSuccess(this.fileName, this.emailLinkClick.name,testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.emailLinkClick.name, testName, stepCount, this.emailLink);
            StepLogger.testEnd();
            throw new Error();
        }
    }

    async getFooterText(stepCount: number, testName: string) {
        try {
            const text = await this.footerText.textContent();
            await StepLogger.logStepSuccess(this.fileName, this.getFooterText.name, testName, stepCount);
            return text ? text.trim() : '';
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.getFooterText.name,testName, stepCount, this.footerText);
            StepLogger.testEnd();
            throw new Error();
        }
    }
    

}
