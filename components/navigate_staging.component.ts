import { el } from '@faker-js/faker/.';
import {Page,Locator} from '@playwright/test'
import { loadEnvironmentConfig } from '../utils/environment-config';
import { logStep, logStepError, logStepSuccess } from '../utils/logStep';


// eslint-disable-next-line @typescript-eslint/no-unused-vars


class Navigate{
    page:Page;
    homeMenueButton: Locator;
    aboutMenuButton: Locator;
    checkBoxMenubutton: Locator;
    kontoWechselMenuButton: Locator;
    //shopMenuButton: Locator;
    contactMenuButton: Locator;
    //cartMenuButton: Locator;
    registrationButton: Locator;
    //profileMenuButton: Locator;
    loginMenuButton: Locator;
  

    constructor(page:Page){
        this.page = page;
        this.homeMenueButton = page.locator("//a[normalize-space()='Home']")
        this.loginMenuButton = page.locator("//a[normalize-space()='Login']")
        this.checkBoxMenubutton = page.locator("//a[normalize-space()='Checkbox']")
        this.kontoWechselMenuButton = page.locator("//a[normalize-space()='Kontextwechsel']")

        this.registrationButton = page.locator("//a[normalize-space()='Registrieren']") 
        this.aboutMenuButton = page.locator("//a[normalize-space()='About']");
        this.contactMenuButton = page.locator('//a[text()="Contact"]');

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

  async navigeteToHome() {
      await this.homeMenueButton.click();   
  }  

   async navigateToAbout() {
      console.log(`Action: Navigating to About Button and Clicking element: ${this.aboutMenuButton}`);
      await this.aboutMenuButton.click();
       }

   async navigateToContact() {
      await this.contactMenuButton.click();
     }

    async navigateToLogin(stepCount: number): Promise<number> {

      stepCount++;

      logStep(stepCount, 'Clicking Login button', this.loginMenuButton);

      try {
        await this.loginMenuButton.click();
        logStepSuccess(stepCount, 'Successfully clicked Login button', this.loginMenuButton);
      } catch (error) {
        logStepError(++stepCount, 'FAILED: The Login button cannot be found or is not available', this.loginMenuButton);
        throw error;
      }
      
      
      return stepCount;
    }

    async navigateToCheckbox() {
      await this.checkBoxMenubutton.click();
    }

    async navigateToKontextwechsel() {
      await this.kontoWechselMenuButton.click();
    }

    async navigateToRegistrieren() {
      await this.registrationButton.click();
    }


}

export default Navigate
 