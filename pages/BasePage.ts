// pages/BasePage.ts
import MenubarItems from "../components/menubar.component";
import FooterItems from "../components/footer.components";
import { StepLogger } from "../utils/StepLogger";
import { loadEnvironmentConfig } from "../utils/environment-config";
import { Page } from 'playwright';
import { expect } from 'playwright/test';


export default class BasePage {
    page: Page;
    MenubarItems: MenubarItems;
    FooterItems: FooterItems;
    fileName: string;


    constructor(page: Page) {
        this.page = page;
        this.MenubarItems = new MenubarItems(page);
        this.FooterItems = new FooterItems(page);
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    }

    async openUrl(stepCount: number, expectedUrl: string, testName: string) {


        const envConfig = await loadEnvironmentConfig();
        //await this.page.goto(envConfig.baseURL);

        const response = await this.page.goto(envConfig.baseURL);
     
        if (response && response.status() === 200) {
            const statusCode = response.status();
            // Beispiel: Statuscode ausgeben oder weiterverarbeiten
            //console.log(`Statuscode: ${statusCode}`);
            //StepLogger.logStepPassedToOpenUrl(this.openUrl.name, stepCount, envConfig.baseURL);

            if (this.page.url().includes(expectedUrl)) {
                StepLogger.logStepPassedToOpenUrl(this.fileName, this.openUrl.name, testName, stepCount, envConfig.baseURL);
            }

        } else {
            const statusCode = response ? response.status() : 0;
            StepLogger.logStepFailedToOpenUrl(this.fileName, this.openUrl.name, testName, stepCount, envConfig.baseURL, statusCode);
            StepLogger.testEnd();
            throw new Error();
        }


        //TODO - Log the successful URL opening
    }
}

