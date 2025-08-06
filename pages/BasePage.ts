
import MenubarItems from "../components/menubar.component";
import FooterItems from "../components/footer.components";
import { StepLogger } from "../utils/StepLogger";
import { loadEnvironmentConfig } from "../utils/environment-config";
import { Page } from 'playwright';


// in the Base Page class, we define common methods and properties that can be used by all pages
// This allows us to avoid code duplication and maintain a clean structure
// implemented pages MenubarItems and FooterItems as properties of BasePage

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

    async openUrl(stepCount: number, expectedUrl: string, testName: string): Promise<void> {
        
        const methodName = this.openUrl.name;

        try {
            const envConfig = await loadEnvironmentConfig();
            const response = await this.page.goto(envConfig.baseURL);
         
            if (response && response.status() === 200) {

                if (this.page.url().includes(expectedUrl)) {
                    await StepLogger.logStepPassedToOpenUrl(this.fileName, methodName, testName, stepCount, envConfig.baseURL);
                } else {
                    throw new Error(`Expected URL '${expectedUrl}' not found in current URL '${this.page.url()}'`);
                }
            } else {
                const statusCode = response ? response.status() : 0;
                throw new Error(`WRONG Statuscode : ${statusCode}`);
        }
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            const envConfig = await loadEnvironmentConfig();
            const statusCode = 0; // Default value for error cases
            
            await StepLogger.logStepFailedToOpenUrl(
                this.fileName, 
                methodName, 
                testName, 
                stepCount, 
                envConfig.baseURL, 
                statusCode
            );
            
            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }
}