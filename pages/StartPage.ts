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

    async clickGotoCoffeeButton(stepCount: number, testName: string): Promise<void> {
        const methodName = this.clickGotoCoffeeButton.name;

        try {
            await this.GotoCoffeButton.click();
            // Wait for URL to contain 'coffeeshop/shop.php'
            await this.page.waitForURL(url => url.toString().includes('coffeeshop/shop.php'), { timeout: 5000 });

            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);

        } catch (error) {

            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                this.GotoCoffeButton
            );

            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

}
