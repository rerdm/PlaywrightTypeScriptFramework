import { el } from '@faker-js/faker/.';
import {Page,Locator} from '@playwright/test'
import { loadEnvironmentConfig } from '../utils/environment-config';


// eslint-disable-next-line @typescript-eslint/no-unused-vars


class Navigate{
    page:Page;
    loginButton: Locator;
    aboutMenuButton: Locator;
    shopMenuButton: Locator;
    contactMenuButton: Locator;
    cartMenuButton: Locator;
    profileMenuButton: Locator;

    
    

    constructor(page:Page){
        this.page = page;
        this.loginButton = page.locator('//a[text()="Login"]')
        this.aboutMenuButton = page.locator('//a[text()="About"]');
        this.shopMenuButton = page.locator('//a[text()="Shop"]');
        this.contactMenuButton = page.locator('//a[text()="Contact"]');
        this.cartMenuButton = page.locator('#cart');
        this.profileMenuButton = page.locator('//a[@href="userprofile.php"]');

    }
    navigate(){
        return new Navigate(this.page);
    }


    async navigateToStartPage() {
        // Get the baseURL directly from environment configuration
        // This ensures we get the exact URL including the full path
        const envConfig = loadEnvironmentConfig();
        await this.page.goto(envConfig.baseURL);
    }

   async navigateToAbout() {
         
      await this.navigateToStartPage();
      await this.aboutMenuButton.click();
       }

    async navigateToShop() {
      await this.navigateToStartPage();
      await this.shopMenuButton.click();
       }
    
    async navigateToContact() {
      await this.navigateToStartPage();
      await this.contactMenuButton.click();
     }

     async navigateToCart() {
      await this.navigateToStartPage();
      await this.cartMenuButton.click();
     }

    async navigateToLogin() {  
      await this.navigateToStartPage();
      // Wait for the login button to be visible and clickable
      await this.loginButton.waitFor({ state: 'visible', timeout: 10000 });
      await this.loginButton.click();
      }

    async navigateToProfile() {  
      await this.navigateToStartPage();
     
      //click Profile Btn
      await this.profileMenuButton.click();
      }

}

export default Navigate
 