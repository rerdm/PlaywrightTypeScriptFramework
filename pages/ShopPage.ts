import {Locator, Page} from '@playwright/test';
import BasePage from './BasePage';
import { StepLogger } from "../utils/StepLogger";


export class ShopPage extends BasePage {

    private searchInputFieldForProducts: Locator;
    private adTitemToCart: Locator;
    
    constructor(page: Page) {
        super(page);

        this.searchInputFieldForProducts = page.locator("//input[@id='search']");
        this.adTitemToCart = page.locator("//button[@id='dc-cartbtn']");

        // Initialize the fileName variable to the current file name
        this.fileName = __filename.split(/[\\/]/).pop() || 'PageNotFound';

    }

    async SearchInputFiledForPoducts(searchText: string, stepCount: number, testName: string): Promise<void> {

        const methodName = this.SearchInputFiledForPoducts.name;
        
        try {
            await this.searchInputFieldForProducts.waitFor({ state: 'visible' });
            await this.searchInputFieldForProducts.click();
            await this.searchInputFieldForProducts.fill(searchText);
            await this.page.keyboard.press('Enter', { delay: 1000 });

        
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                this.searchInputFieldForProducts
            );

            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async ScrollToCartProduct(product: string, stepCount: number, testName: string): Promise<void> {

        const methodName = this.ScrollToCartProduct.name;

        const productLocator = this.page.locator(`//a[normalize-space()='${product}']`);


        try {
            await productLocator.scrollIntoViewIfNeeded();
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                productLocator
            );

            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }

    async ClickShopProduct(product: string, stepCount: number, testName: string): Promise<void> {

        const methodName = this.ClickShopProduct.name;

        const productLocator = this.page.locator(`//a[normalize-space()='${product}']`);


        try {
            await productLocator.scrollIntoViewIfNeeded();
            await productLocator.click();
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                productLocator
            );

            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }
    async AdItemToCart(stepCount: number, testName: string): Promise<void> {

        const methodName = this.AdItemToCart.name;

        try {
            await this.adTitemToCart.scrollIntoViewIfNeeded();
            await this.adTitemToCart.click();
            await StepLogger.logStepSuccess(this.fileName, methodName, testName, stepCount);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';

            await StepLogger.logStepFailed(
                this.fileName,
                methodName,
                testName,
                stepCount,
                this.adTitemToCart
            );

            StepLogger.testEnd();
            throw new Error(`ERROR Details : ${errorMessage}`);
        }
    }


}