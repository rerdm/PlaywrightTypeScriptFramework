import { expect, Locator, Page } from "@playwright/test";


class Profiledata{
    page:Page;
    firstName: Locator;
    lastName: Locator;
    email: Locator;
    adress: Locator;
    city: Locator;
    zipCode: Locator;
    country: Locator;
    saveBtn: Locator;
    cancelBtn: Locator;
    genderMaleRbtn: Locator;
    genderMaleLabel: Locator;
    genderFemaleRbtn: Locator;
    genderFemaleLabel: Locator;
    genderDiversRbtn: Locator;
    genderDiversLabel: Locator;
    genderNoDataRbtn: Locator;
    genderNoDataLabel: Locator;
    ageSlider: Locator;
    firstNameErrMsg: Locator;
    lastNameErrMsg: Locator;
    emailErrMsg: Locator;
    adressErrMsg: Locator;
    zipCodeErrMsg: Locator;
    cityErrMsg: Locator;


    constructor(page:Page){
        //Field for Firstname,Lastname and E-Mailadress
        this.firstName = page.locator('//input[@id="udinput-vorname"]');
        this.lastName = page.locator('//input[@id="udinput-nachname"]');
        this.email = page.locator('//input[@id="udinput-email"]');

        //ErrMsg for Firstname,Lastname and E-Mailadress
        this.firstNameErrMsg = page.locator('//span[@id="udmsg-vorname"]');
        this.lastNameErrMsg = page.locator('//span[@id="udmsg-nachname"]');
        this.emailErrMsg = page.locator('//span[@id="udmsg-email"]');

        //Gender selection Radiobuttons and visible labels
        this.genderMaleRbtn = page.locator('//input[@id="udradio-1"]');
        this.genderMaleLabel = page.locator('//label[@for="udradio-1"]');

        this.genderFemaleRbtn = page.locator('//input[@id="udradio-2"]');
        this.genderFemaleLabel = page.locator('//label[@for="udradio-2"]');

        this.genderDiversRbtn = page.locator('//input[@id="udradio-3"]');
        this.genderDiversLabel = page.locator('//label[@for="udradio-3"]');

        this.genderNoDataRbtn = page.locator('//input[@id="udradio-4"]');
        this.genderNoDataLabel = page.locator('//label[@for="udradio-4"]');

        //Slider for age
        this.ageSlider = page.locator('//input[@id="udinput-age"]');
        
        //Formular for the adress data
        this.adress = page.locator('//input[@id="udinput-adress"]');
        this.zipCode = page.locator('//input[@id="udinput-plz"]');
        this.city = page.locator('//input[@id="udinput-city"]');
        this.country = page.locator('//select[@id="udinput-land"]');

        //ErrMsg for the adress data
        this.adressErrMsg = page.locator('//span[@id="udmsg-adress"]');
        this.zipCodeErrMsg = page.locator('//span[@id="udmsg-plz"]');
        this.cityErrMsg = page.locator('//span[@id="udmsg-city"]');

        //Speichern and Abbrechen buttons
        this.saveBtn = page.locator('//input[@id="udsavebtn"]');
        this.cancelBtn = page.locator('//input[@id="udcancelbtn"]');
    }

    //Data input functions---------------------------------------------------------------------------

    //Enter value for firstname-field 
    async enterFirstName(parFirstName:string){
        console.log('Profilpage: Entering the firstname: ',parFirstName);
        await this.firstName.fill(parFirstName);
        }
    
    //Enter value for lastname-field 
    async enterLastName(parLastName:string){
        console.log('Profilpage: Entering the lastname: ',parLastName);
        await this.lastName.fill(parLastName);
        }
    
    //Enter value for email-field 
    async enterEmail(parEmail:string){
        console.log('Profilpage: Entering the email: ',parEmail);
        await this.email.fill(parEmail);
        }

    //Select value for gender-field 
    async enterGender(parGender:string){    //Select Male Gender
        if (parGender == 'Male') {
            console.log('Gender Male seleced');
            await this.genderMaleLabel.click();

        } else if (parGender == 'Female'){  //Select Female Gender
            console.log('Gender Female seleced');
            await this.genderFemaleLabel.click();

        } else if (parGender == 'Divers'){  //Select Divers Gender
            console.log('Gender Divers seleced');
            await this.genderDiversLabel.click();

        } else if (parGender == 'NoData'){  //Select NoData Gender
            console.log('Gender NoData seleced');
            await this.genderNoDataLabel.click();

        } else {                            //For case of wrong parameter given
            throw new Error('Funktion recieved invalide parameter');
        }
        }

    //Enter value for age via slider  
    async enterSliderAge(){
        console.log('Profilpage: Entering the adress: ');
        
        await this.ageSlider.evaluate(node =>{
            (node as HTMLInputElement).value = '40'
            node.dispatchEvent(new Event('input'))
        })
    }
    //Enter value for adress-field 
    async enterAdress(parAdress:string){
        console.log('Profilpage: Entering the adress: ',parAdress);
        await this.adress.fill(parAdress);
        }

    //Enter value for zipcode-field 
    async enterZipCode(parZipCode:string){
        console.log('Profilpage: Entering the zipcode: ',parZipCode);
        await this.zipCode.fill(parZipCode);
        }
            
    //Enter value for city-field 
    async enterCity(parCity:string){
        console.log('Profilpage: Entering the city: ',parCity);
        await this.city.fill(parCity);
        }
    
    //Enter value for country-field 
    async enterCountry(parCountry:string){
        console.log('Profilpage: Selecting the country: ',parCountry);
        await this.country.selectOption({label:parCountry},{timeout:500,force:true});
        }
    

    //Verify Data functions-----------------------------------------------------------------------------------------------------------------------

    //Verifys the status of the firstname-ErrMsg
    async verifyErrFirstName(parFirstNameVisible:boolean){
        
        //Verify that the correct ErrMsg for firstname is displayed
        if (parFirstNameVisible == true) {
            console.log('Verify that an valid ErrMsg for firstname is display');

            await expect(this.firstNameErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.firstNameErrMsg, 'Verify ErrMsg text.').toHaveText("2-20 Zeichen: a-z, A-Z, Umlaute, -");
        } 
        //Verify that no ErrMsg for firststname is displayed
        else {
            console.log('Verify that no ErrMsg for firstname is display');

            await expect(this.firstNameErrMsg, 'ErrMsg should not be visible.').not.toBeVisible({timeout:5000,});
        }
        }
        
     //Verifys the status of the lastname-ErrMsg
    async verifyErrLastName(parLastNameVisible:boolean){
        
        //Verify that the correct ErrMsg for lastname is displayed
        if (parLastNameVisible == true) {
            console.log('Verify that an valid ErrMsg for lastname is display');

            await expect(this.lastNameErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.lastNameErrMsg, 'Verify ErrMsg text.').toHaveText("2-20 Zeichen: a-z, A-Z, Umlaute, -");
        } 
        //Verify that no ErrMsg for laststname is displayed
        else {
            console.log('Verify that no ErrMsg for lastname is display');

            await expect(this.lastNameErrMsg, 'ErrMsg should not be visible.').not.toBeVisible({timeout:5000,});
        }
        }
    
    //Verifys the status of the email-ErrMsg
    async verifyErrEmail(parEmailVisible:string){
        
        //Verify that the correct ErrMsg for a wrong email-format is displayed
        if (parEmailVisible == 'WrongFormat') {         
            console.log('Verify that an valid ErrMsg for wrong email-format displayed');

            await expect(this.emailErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
             await expect(this.emailErrMsg, 'Verify ErrMsg for wrong format.').toHaveText("Email-Format befolgen: Name@Domain.endung");      
        } 
        //Verify that the correct ErrMsg for a too long email is displayed
        else if (parEmailVisible == 'TooLong'){       
            console.log('Verify that an valid ErrMsg for a too long email displayed');

            await expect(this.emailErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.emailErrMsg, 'Verify ErrMsg for too long value.').toHaveText("Erlaubte Zeichen: 2-50 Zeichen: 0-9, a-z, A-Z, Umlaute, - _ .");
        } 
        //Verify that no ErrMsg is displayed
        else if (parEmailVisible == 'NoErrMsg'){  
            console.log('Verify that no ErrMsg for email is displayed');

            await expect(this.emailErrMsg, 'No ErrMsg should be visible.').not.toBeVisible({timeout:5000,});
        } 
        //Errorhandling: Invalide parameter
        else { 
            throw new Error('Funktion recieved invalide parameter');
        }
    }
    
    //Verifys the status of the adress-ErrMsg
    async verifyErrAdress(parAdressVisible:boolean){
        //Verify that the correct ErrMsg for adress is displayed
        if (parAdressVisible == true) {
            console.log('Verify that an valid ErrMsg for adress is display');

            await expect(this.adressErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.adressErrMsg, 'Verify ErrMsg text.').toHaveText("Bis 50 Zeichen: a-z, A-Z, Umlaute, 0-9, -");
        } 
        //Verify that no ErrMsg for adress is displayed
        else {
            console.log('Verify that no ErrMsg is display');
            await expect(this.adressErrMsg, 'ErrMsg should not be visible.').not.toBeVisible({timeout:5000,});
        }
        }

    //Verifys the status of the city-ErrMsg
    async verifyErrCity(parCityVisible:boolean){
        //Verify that the correct ErrMsg for city is displayed
        if (parCityVisible == true) {
            console.log('Verify that an valid ErrMsg for city is display');

            await expect(this.cityErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.cityErrMsg, 'Verify ErrMsg text.').toHaveText("2-20 Zeichen: a-z, A-Z, Umlaute, -");
        } 
        //Verify that no ErrMsg for adress is displayed
        else {
            console.log('Verify that no ErrMsg is display');
            await expect(this.cityErrMsg, 'ErrMsg should not be visible.').not.toBeVisible({timeout:5000,});
        }
        }

    //Verifys the status of the zipcode-ErrMsg
    async verifyErrZipCode(parZipVisible:string){

        //Verify that the correct ErrMsg for a zipcode from germany is displayed
        if (parZipVisible == 'WrongGermany') {         
            console.log('Verify that an valid ErrMsg for germany format is displayed');

            await expect(this.zipCodeErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.zipCodeErrMsg, 'Verify ErrMsg for germany zipcode.').toHaveText("Bitte gültiges PLZ Format für das ausgewählte Land befolgen. Bsp. 99999");      
        } 
        //Verify that the correct ErrMsg for a zipcode from netherlands is displayed
        else if (parZipVisible == 'WrongNetherlands'){       
            console.log('Verify that an valid ErrMsg for netherlands format is displayed');

            await expect(this.zipCodeErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.zipCodeErrMsg, 'Verify ErrMsg for netherlands zipcode.').toHaveText("Bitte gültiges PLZ Format für das ausgewählte Land befolgen. Bsp. 1000 AA");
        } 
        //Verify that the correct ErrMsg for a zipcode from Austria or Switzerland is displayed
        else if (parZipVisible == 'WrongSwiAus'){  
            console.log('Verify that an valid ErrMsg for austria or switzerland format is displayed');

            await expect(this.zipCodeErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.zipCodeErrMsg, 'Verify ErrMsg for austria or switzerland zipcode.').toHaveText("Bitte gültiges PLZ Format für das ausgewählte Land befolgen. Bsp. 1000");
        } 
        //Verify that the correct ErrMsg for a zipcode from Poland is displayed
        else if (parZipVisible == 'WrongPoland'){  
            console.log('Verify that an valid ErrMsg for poland format is displayed');

            await expect(this.zipCodeErrMsg, 'ErrMsg should be visible.').toBeVisible({timeout:1000,visible:true});
            await expect(this.zipCodeErrMsg, 'Verify ErrMsg for poland zipcode.').toHaveText("Bitte gültiges PLZ Format für das ausgewählte Land befolgen. Bsp. 99-999");
        } 
        //Verify that no ErrMsg is displayed
        else if (parZipVisible == 'NoErrMsg'){  
            console.log('Verify that no ErrMsg for zipcode is displayed');

            await expect(this.zipCodeErrMsg, 'No ErrMsg should be visible.').not.toBeVisible({timeout:5000,});
        } 
        //Errorhandling: Invalide parameter
        else { 
            throw new Error('Funktion recieved invalide parameter');
        }
    }

    //Funktion combines input and verification to che check the ErrMsg for firstname appear and disappear
    async verifyErrFirstNameAppearDisappear(parFirstNameFalse:string, parFirstNameCorrect:string){
        await this.enterFirstName(parFirstNameFalse);
        await this.verifyErrFirstName(true);
        await this.enterFirstName(parFirstNameCorrect);
        await this.verifyErrFirstName(false);
    }

    //Funktion combines input and verification to che check the ErrMsg for lastname appear and disappear
    async verifyErrLastNameAppearDisappear(parLastNameFalse:string, parLastNameCorrect:string){
        await this.enterLastName(parLastNameFalse);
        await this.verifyErrLastName(true);
        await this.enterLastName(parLastNameCorrect);
        await this.verifyErrLastName(false);
    }

    //Funktion combines input and verification to che check the ErrMsg for lastname appear and disappear
    async verifyErrEmailAppearDisappear(parEmailFalse:string, parEmailCorrect:string,parErrCode:string){
        await this.enterEmail(parEmailFalse);
        await this.verifyErrEmail(parErrCode);
        await this.enterEmail(parEmailCorrect);
        await this.verifyErrEmail('NoErrMsg');
    }
    
     //Funktion combines input and verification to che check the ErrMsg for zipcode appear and disappear
    async verifyErrZipCodeAppearDisappear(parZipFalse:string, parZipCorrect:string,parErrCode:string){
        await this.enterZipCode(parZipFalse);
        await this.verifyErrZipCode(parErrCode);
        await this.enterZipCode(parZipCorrect);
        await this.verifyErrZipCode('NoErrMsg');
    }

    //Funktion combines input and verification to che check the ErrMsg for zipcode appear and disappear
    async verifyGender(parGender:string){
        console.log('Verify Gender');

        //Verify that all 4 radiobuttons are visible
        await expect(this.genderMaleRbtn,'RadioBtn male should be visible.').toBeVisible();
        await expect(this.genderFemaleRbtn,'RadioBtn female should be visible.').toBeVisible();
        await expect(this.genderDiversRbtn,'RadioBtn divers should be visible.').toBeVisible();
        await expect(this.genderNoDataRbtn,'RadioBtn noData should be visible.').toBeVisible();

        //Verify that all 4 radiobuttons are enabled
        await expect(this.genderMaleRbtn,'RadioBtn male should be enabled.').toBeEnabled();
        await expect(this.genderFemaleRbtn,'RadioBtn female should be enabled.').toBeEnabled();
        await expect(this.genderDiversRbtn,'RadioBtn divers should be enabled.').toBeEnabled();
        await expect(this.genderNoDataRbtn,'RadioBtn noData should be enabled.').toBeEnabled();

        //Verify that all 4 labels are visible and correct
        await expect(this.genderMaleLabel,'Label male should be visible.').toBeVisible();
        await expect(this.genderFemaleLabel,'Label female should be visible.').toBeVisible();
        await expect(this.genderDiversLabel,'Label divers should be visible.').toBeVisible();
        await expect(this.genderNoDataLabel,'Label noData should be visible.').toBeVisible();

        await expect(this.genderMaleLabel,'Label male should have correct text.').toHaveText('Männlich');
        await expect(this.genderFemaleLabel,'Label female should have correct text.').toHaveText('Weiblich');
        await expect(this.genderDiversLabel,'Label divers should have correct text.').toHaveText('Divers');
        await expect(this.genderNoDataLabel,'Label noData should have correct text.').toHaveText('Keine Angabe');

        //Verify that the correct radiobutton is active
        //Male radioBtn is the only checked
        if(parGender == 'Male'){
            await expect(this.genderMaleRbtn,'RadioBtn male should be checked.').toBeChecked();
            await expect(this.genderFemaleLabel,'RadioBtn female should not be checked.').not.toBeChecked();
            await expect(this.genderDiversLabel,'RadioBtn divers should not be checked.').not.toBeChecked();
            await expect(this.genderNoDataLabel,'RadioBtn noData should not be checked.').not.toBeChecked();
        }
        //Female radioBtn is the only checked
        else if(parGender == 'Female'){
            await expect(this.genderMaleRbtn,'RadioBtn male should not be checked.').not.toBeChecked();
            await expect(this.genderFemaleLabel,'RadioBtn female should be checked.').toBeChecked();
            await expect(this.genderDiversLabel,'RadioBtn divers should not be checked.').not.toBeChecked();
            await expect(this.genderNoDataLabel,'RadioBtn noData should not be checked.').not.toBeChecked();        }
        //Divers radioBtn is the only checked
        else if(parGender == 'Divers'){
            await expect(this.genderMaleRbtn,'RadioBtn male should not be checked.').not.toBeChecked();
            await expect(this.genderFemaleLabel,'RadioBtn female should not be checked.').not.toBeChecked();
            await expect(this.genderDiversLabel,'RadioBtn divers should be checked.').toBeChecked();
            await expect(this.genderNoDataLabel,'RadioBtn noData should not be checked.').not.toBeChecked();
        }
        //NoData radioBtn is the only checked
        else if(parGender == 'NoData'){
            await expect(this.genderMaleRbtn,'RadioBtn male should not be checked.').not.toBeChecked();
            await expect(this.genderFemaleLabel,'RadioBtn female should not be checked.').not.toBeChecked();
            await expect(this.genderDiversLabel,'RadioBtn divers should not be checked.').not.toBeChecked();
            await expect(this.genderNoDataLabel,'RadioBtn noData should be checked.').toBeChecked();
        }
        //Wrong Parameter
        else{
            throw new Error('Funktion recieved invalide parameter');
        }
    }

    //Verify the data of the current user
    async VerifyUserData(parFirstName:string,parLastName:string,parEmail:string,parAge:string,parGender:string,parAdress:string,parZipCode:string,parCity:string,parCountry:string){
        console.log('Verification of profil data');
        
        //Verify firstname, lastname and adress
        await expect(this.firstName,'Wrong firstname').toHaveValue(parFirstName);
        await expect(this.lastName,'Wrong lastName').toHaveValue(parLastName);
        await expect(this.email,'Wrong email').toHaveValue(parEmail);

        //verify age
        await expect(this.ageSlider,'Wrong age').toHaveValue(parAge);
        //Verify gender
        await this.verifyGender(parGender);

        //Verify adress, zipcode, city and country
        await expect(this.adress,'Wrong adress').toHaveValue(parAdress);
        await expect(this.zipCode,'Wrong zipCode').toHaveValue(parZipCode);
        await expect(this.city,'Wrong city').toHaveValue(parCity);
        
        //Verify country. Use of locator.innerText to have option:checked
        expect(await this.country.locator('option:checked').innerText(),'Wrong country').toEqual(parCountry);
    }
}

export default Profiledata