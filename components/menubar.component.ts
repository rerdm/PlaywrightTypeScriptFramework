import { Page,Locator } from "playwright/test";
import { StepLogger } from "../utils/StepLogger";
import test from "node:test";

export default class MenubarItems {
    // create a new instance of the Menubar class
    private page: Page;
    private homeMenuButton: Locator;
    private aboutMenuButton: Locator;
    private shopMenuButton: Locator;
    private contactMenuButton: Locator;
    private loginMenuButton: Locator;
    private cartMenuButton: Locator;

    private fileName: string;


    // Constructor to initialize the page and menu buttons
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

    // Method to navigate to the home page
    MenubarItems() {
        return new MenubarItems(this.page);
    }

    async HomeButtonClick(stepCount: number, testName: string) {
        try {
            await this.homeMenuButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.HomeButtonClick.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.HomeButtonClick.name, testName, stepCount, this.homeMenuButton);
            throw new Error();
        }
    }
    async AboutbuttonClick(stepCount: number, testName: string) {
        try {
            await this.aboutMenuButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.AboutbuttonClick.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.AboutbuttonClick.name, testName, stepCount, this.aboutMenuButton);
            throw new Error();
        }
    }

    async ShopButtonClick(stepCount: number, testName: string) {
        try {
            await this.shopMenuButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.ShopButtonClick.name,testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.ShopButtonClick.name, testName, stepCount, this.shopMenuButton);
            throw new Error();
        }
    }   

    async ContactButtonClick(stepCount: number, testName: string) {
        try {
            await this.contactMenuButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.ContactButtonClick.name, testName, stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.ContactButtonClick.name, testName, stepCount, this.contactMenuButton);
            throw new Error();
        }
    }

    async LoginButtonClick(stepCount: number, testName: string) {   

        try {
            await this.loginMenuButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.LoginButtonClick.name,testName, stepCount);

        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.LoginButtonClick.name, testName, stepCount, this.loginMenuButton);
            throw new Error();
        }
    }
    async CartButtonClick(stepCount: number, testName: string) {
        try {
            await this.cartMenuButton.click();
            await StepLogger.logStepSuccess(this.fileName, this.CartButtonClick.name,testName,  stepCount);
        } catch (error) {
            StepLogger.logStepFailed(this.fileName, this.CartButtonClick.name, testName, stepCount, this.cartMenuButton);
            throw new Error();
        }
    }


}