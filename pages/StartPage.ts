import BasePage from "./BasePage";
import { Page, Locator } from 'playwright';
import { StepLogger } from "../utils/StepLogger";

export class StartPage extends BasePage {

    GotoCoffeButton: Locator;
    fileName: string;

    constructor(page: Page) {
        super(page);

        this.GotoCoffeButton = page.locator("//a[normalize-space()='Auf zum Kaffee']");
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    }

    async clickGotoCoffeeButton(stepCount: number, testName: string) {

     try {
           await this.GotoCoffeButton.click();
           await StepLogger.logStepSuccess(this.fileName, this.clickGotoCoffeeButton.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.clickGotoCoffeeButton.name, testName, stepCount,this.GotoCoffeButton);
            throw new Error();
        }

    }

}
