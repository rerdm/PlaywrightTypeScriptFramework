import BasePage from "./BasePage";
import { Page, Locator } from 'playwright';
import { StepLogger } from "../utils/StepLogger";

export class AboutPage extends BasePage {

    fileName: string;

    constructor(page: Page) {
        super(page);

        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';
    }

    // This Page has Only text but here can also some methods be implemented 
    // wich compare the text with the expected text

}
