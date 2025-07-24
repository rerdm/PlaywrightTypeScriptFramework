import {test} from '@playwright/test'
import Profiledata from '../pages/profiledata.page'
import Navigate from '../components/navigate.component';
import UserDataArray from "../test-data/profiledata.testdata.json";


test.describe('Test for US 6: Stammdatenpflege Kunde', () => {
    let profiledata:Profiledata;
    let navigate:Navigate;

    //Verify ErrMsg appears if firstname is invalid and disappears if changed to a vaild value
    test('Profile Firstname validation @ProfileData @TC-30000', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();

        //Verify ErrMsg: firstname is too shoort (1 Char) = invalid
        console.log('Verify ErrMsg: firstname is too shoort');
        await profiledata.verifyErrFirstNameAppearDisappear('A','Abcde');
        
        //Verify ErrMsg: firstname is too long (21 Char) = invalid
        console.log('Verify ErrMsg: firstname is too long');
        await profiledata.verifyErrFirstNameAppearDisappear('ABCDEabcdeABCDEabcdeA','ABCDEabcdeABCDEabcde');

        //Verify ErrMsg: firstname contains number = invalid
        console.log('Verify ErrMsg: firstname contains number');
        await profiledata.verifyErrFirstNameAppearDisappear('ABCDE5','Abcde');

        //Verify ErrMsg: firstname contains question mark = invalid
        console.log('Verify ErrMsg: firstname contains question mark');
        await profiledata.verifyErrFirstNameAppearDisappear('ABCDE?','Abcde');

        //Verify ErrMsg: firstname contains umlaut = valid
        console.log('Verify ErrMsg: firstname contains umlaut');
        await profiledata.enterFirstName('ABCDEÜ');
        await profiledata.verifyErrFirstName(false);

        //Verify ErrMsg: firstname contains hyphen = valid
        console.log('Verify ErrMsg: firstname contains hyphen');
        await profiledata.enterFirstName('Abcde-');
        await profiledata.verifyErrFirstName(false);
    })
    
     //Verify ErrMsg appears if lastname is invalid and disappears if changed to a vaild value
    test('Profile Lastname validation  @ProfileData @TC-30001', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();

        //Verify ErrMsg: lastname is too shoort (1 Char) = invalid
        console.log('Verify ErrMsg: lastname is too shoort');
        await profiledata.verifyErrLastNameAppearDisappear('A','Abcde');
        
        //Verify ErrMsg: lastname is too long (21 Char) = invalid
        console.log('Verify ErrMsg: lastname is too long');
        await profiledata.verifyErrLastNameAppearDisappear('ABCDEabcdeABCDEabcdeA','ABCDEabcdeABCDEabcde');

        //Verify ErrMsg: lastname contains number = invalid
        console.log('Verify ErrMsg: lastname contains number');
        await profiledata.verifyErrLastNameAppearDisappear('ABCDE5','Abcde');

        //Verify ErrMsg: lastname contains question mark = invalid
        console.log('Verify ErrMsg: lastname contains question mark');
        await profiledata.verifyErrLastNameAppearDisappear('ABCDE?','Abcde');

        //Verify ErrMsg: lastname contains umlaut = valid
        console.log('Verify ErrMsg: lastname contains umlaut');
        await profiledata.enterLastName('ABCDEÜ');
        await profiledata.verifyErrLastName(false);

        //Verify ErrMsg: lastname contains hyphen = valid
        console.log('Verify ErrMsg: lastname contains hyphen');
        await profiledata.enterLastName('Abcde-');
        await profiledata.verifyErrLastName(false);
    })
    

    //Verify ErrMsg appears if email is invalid and disappears if changed to a vaild value
    test('Profile Email validation  @ProfileData @TC-30002', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();
        
        //Verify ErrMsg: email is too long (51 Char) = invalid
        console.log('Verify ErrMsg: email is too long');
        await profiledata.verifyErrEmailAppearDisappear('ABCDEabcdeABCDEabcdeABCDEabcdeABCDEabcdeABCDEabcdeA@test.com','ABCDEabcdeABCDEabcdeABCDEabcdeABCDEabcdeA@test.com','TooLong');

        //Verify ErrMsg: email contains no @ = invalid
        console.log('Verify ErrMsg: email contains no @');
        await profiledata.verifyErrEmailAppearDisappear('ABCDEabcdetest.com','ABCDEabcde@test.com','WrongFormat');

        //Verify ErrMsg: email contains no . = invalid
        console.log('Verify ErrMsg: email contains no .');
        await profiledata.verifyErrEmailAppearDisappear('ABCDEabcde@testcom','ABCDEabcde@test.com','WrongFormat');

        //Verify ErrMsg: email contains no TopLevelDomain = invalid
        /*console.log('Verify ErrMsg: email contains no TopLevelDomain');
        await profiledata.verifyErrEmailAppearDisappear('ABCDEabcde@test.','ABCDEabcde@test.com','WrongFormat');*/
    })

    //Verify ErrMsg appears if adress is invalid and disappears if changed to a vaild value
    test('Profile Adress validation @ProfileData @TC-30003', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();
        
        //Verify ErrMsg: adress is too long (51 Char) = invalid
        /*console.log('Verify ErrMsg: adress is too long');
        await profiledata.enterAdress('ABCDEabcdeABCDEabcdeABCDEabcdeABCDEabcdeABCDEabcdeA');
        await profiledata.verifyErrAdress(true);
        await profiledata.enterAdress('ABCDEabcdeABCDEabcdeABCDEabcdeABCDEabcdeABCDEabcde');
        await profiledata.verifyErrAdress(false);*/

        //Verify ErrMsg: adress contains . = valid
        console.log('Verify ErrMsg: adress contains ,');
        await profiledata.enterAdress('Tester Str. 5');
        await profiledata.verifyErrAdress(false);

        //Verify ErrMsg: adress contains ß = valid
       /* console.log('Verify ErrMsg: adress contains ß');
        await profiledata.enterAdress('Tester Straße 5');
        await profiledata.verifyErrAdress(false);*/
    })

    //Verify ErrMsg appears if city is invalid and disappears if changed to a vaild value
    test('Profile City validation  @ProfileData @TC-30004', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();
        
        //Verify ErrMsg: city is too short (1 Char) = invalid
        console.log('Verify ErrMsg: city is too short');
        await profiledata.enterCity('A');
        await profiledata.verifyErrCity(true);
        await profiledata.enterCity('AB');
        await profiledata.verifyErrCity(false);

        //Verify ErrMsg: city is too long (21 Char) = invalid
        console.log('Verify ErrMsg: city is too long');
        await profiledata.enterCity('ABCDEabcdeABCDEabcdeA');
        await profiledata.verifyErrCity(true);
        await profiledata.enterCity('ABCDEabcdeABCDEabcde');
        await profiledata.verifyErrCity(false);

        //Verify ErrMsg: city contains space = valid
        /*console.log('Verify ErrMsg: city contains space');
        await profiledata.enterCity('Frankfurt am Main');
        await profiledata.verifyErrCity(false);

        //Verify ErrMsg: city contains ß = valid
        console.log('Verify ErrMsg: city contains ß');
        await profiledata.enterCity('Heßdorf');
        await profiledata.verifyErrCity(false);*/
    })

    //Verify ErrMsg appears if german zipcode is invalid and disappears if changed to a vaild value
    test('Profile German Zipcode validation  @ProfileData @TC-30005', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();

        //Select Germany as country
        await profiledata.enterCountry('Deutschland');

        //Verify ErrMsg: zipcode is too short (4 Char) = invalid
        console.log('Verify ErrMsg: zipcode is too short');
        await profiledata.verifyErrZipCodeAppearDisappear('1234','12345','WrongGermany');

        //Verify ErrMsg: zipcode is too long (6 Char) = invalid
        console.log('Verify ErrMsg: zipcode is too long');
        await profiledata.verifyErrZipCodeAppearDisappear('123456','12345','WrongGermany');
        
        //Verify ErrMsg: zipcode contains a letter = invalid
        console.log('Verify ErrMsg: zipcode contains a lettert');
        await profiledata.verifyErrZipCodeAppearDisappear('1234F','12345','WrongGermany');

        //Verify ErrMsg: zipcode contains a question mark = invalid
        console.log('Verify ErrMsg: zipcode contains a question mark');
        await profiledata.verifyErrZipCodeAppearDisappear('1234?','12345','WrongGermany');

        //Verify ErrMsg: zipcode contains a space = invalid
        console.log('Verify ErrMsg: zipcode contains a space');
        await profiledata.verifyErrZipCodeAppearDisappear('12 34','12345','WrongGermany');
    })

    //Verify ErrMsg appears if austria or switzerland zipcode is invalid and disappears if changed to a vaild value
    const SwiAusarr:string[] = ['Österreich', 'Schweiz'];
    for (const SwiAus of SwiAusarr){ 
        test('Profile '+SwiAus+' Zipcode validation @ProfileData @TC-30006', async ({ page }) => {
            navigate = new Navigate(page);
            profiledata =new Profiledata(page);
            await navigate.navigateToProfile();

            //Select Germany as country
            await profiledata.enterCountry(SwiAus);

            //Verify ErrMsg: zipcode is too short (3 Char) = invalid
            console.log('Verify ErrMsg: zipcode is too short');
            await profiledata.verifyErrZipCodeAppearDisappear('123','1234','WrongSwiAus');

            //Verify ErrMsg: zipcode is too long (5 Char) = invalid
            /*console.log('Verify ErrMsg: zipcode is too long');
            await profiledata.verifyErrZipCodeAppearDisappear('12345','1234','WrongSwiAus');*/

            //Verify ErrMsg: zipcode contains a letter = invalid
            console.log('Verify ErrMsg: zipcode contains a letter');
            await profiledata.verifyErrZipCodeAppearDisappear('123F','1234','WrongSwiAus');

            //Verify ErrMsg: zipcode contains a question mark = invalid
            console.log('Verify ErrMsg: zipcode contains a question mark');
            await profiledata.verifyErrZipCodeAppearDisappear('123?','1234','WrongSwiAus');

            //Verify ErrMsg: zipcode contains a space = invalid
            console.log('Verify ErrMsg: zipcode contains a space');
            await profiledata.verifyErrZipCodeAppearDisappear('12 3','1234','WrongSwiAus');
        })
    }

    //Verify ErrMsg appears if netherlands zipcode is invalid and disappears if changed to a vaild value
    test('Profile Netherlands Zipcode validation @ProfileData @TC-30007', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();

        //Select Netherlands as country
        await profiledata.enterCountry('Niederlande');

        //Verify ErrMsg: zipcode has too little numbers (3 Char) = invalid
        console.log('Verify ErrMsg: zipcode has too little numbers');
        await profiledata.verifyErrZipCodeAppearDisappear('910 BR','9104 BR','WrongNetherlands');

        //Verify ErrMsg: zipcode has too many numbers (5 numbers) = invalid
        //console.log('Verify ErrMsg: zipcode has too many numbers');
        //await profiledata.verifyErrZipCodeAppearDisappear('91041 BR','9104 BR','WrongNetherlands');
        
        //Verify ErrMsg: zipcode has too little letters = invalid
        console.log('Verify ErrMsg: zipcode has too little letters');
        await profiledata.verifyErrZipCodeAppearDisappear('9104 B','9104 BR','WrongNetherlands');

        //Verify ErrMsg: zipcode has too many letters = invalid
        //console.log('Verify ErrMsg: zipcode has too many letters');
        //await profiledata.verifyErrZipCodeAppearDisappear('9104 BRA','9104 BR','WrongNetherlands');

        //Verify ErrMsg: zipcode has no space = invalid
        console.log('Verify ErrMsg: zipcode has no space');
        await profiledata.verifyErrZipCodeAppearDisappear('9104BR','9104 BR','WrongNetherlands');

        //Verify ErrMsg: zipcode has too many spaces = invalid
        //console.log('Verify ErrMsg: zipcode has too many spaces');
        //await profiledata.verifyErrZipCodeAppearDisappear('9104  BR','9104 BR','WrongNetherlands');

        //Verify ErrMsg: zipcode has letters at wrong position = invalid
        console.log('Verify ErrMsg: zipcode has letters at wrong position');
        await profiledata.verifyErrZipCodeAppearDisappear('BR 9204','9104 BR','WrongNetherlands');

        //Verify ErrMsg: zipcode has space at wrong position = invalid
        console.log('Verify ErrMsg: zipcode has space at wrong position');
        await profiledata.verifyErrZipCodeAppearDisappear('910 4BR','9104 BR','WrongNetherlands');

        //Verify ErrMsg: zipcode contains question mark = invalid
        console.log('Verify ErrMsg: zipcode contains question mark');
        await profiledata.verifyErrZipCodeAppearDisappear('9104 B?','9104 BR','WrongNetherlands');
    })

    //Verify ErrMsg appears if poland zipcode is invalid and disappears if changed to a vaild value
    test('Profile Poland Zipcode validation  @ProfileData @TC-30008', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();

        //Select Netherlands as country
        await profiledata.enterCountry('Polen');

        //Verify ErrMsg: hyphen in zipcode is too early = invalid
        console.log('Verify ErrMsg: hyphen in zipcode is too early');
        await profiledata.verifyErrZipCodeAppearDisappear('1-2345','12-345','WrongPoland');

        //Verify ErrMsg: hyphen in zipcode is too late = invalid
        console.log('Verify ErrMsg: hyphen in zipcode is too late');
        await profiledata.verifyErrZipCodeAppearDisappear('123-45','12-345','WrongPoland');

        //Verify ErrMsg: zipcode is too short (5 char) = invalid
        console.log('Verify ErrMsg: hyphen in zipcode is too late');
        await profiledata.verifyErrZipCodeAppearDisappear('12-34','12-345','WrongPoland');
        
        //Verify ErrMsg: zipcode is too long (7 char) = invalid
        console.log('Verify ErrMsg: hyphen in zipcode is too late');
        await profiledata.verifyErrZipCodeAppearDisappear('12-3456','12-345','WrongPoland');

        //Verify ErrMsg: zipcode contains letter = invalid
        console.log('Verify ErrMsg: zipcode contains letter');
        await profiledata.verifyErrZipCodeAppearDisappear('12-34F','12-345','WrongPoland');

        //Verify ErrMsg: zipcode contains question mark = invalid
        console.log('Verify ErrMsg: zipcode contains question mark');
        await profiledata.verifyErrZipCodeAppearDisappear('12-34?','12-345','WrongPoland');
        
        //Verify ErrMsg: zipcode contains space = invalid
        console.log('Verify ErrMsg: zipcode contains space');
        await profiledata.verifyErrZipCodeAppearDisappear('12-3 4','12-345','WrongPoland');
    })

    //Verify the gender radioboxes work as intended
    test('Profile Gender validation @ProfileData @TC-30009', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();

        //Verify start value
        await profiledata.verifyGender('Divers');

        //Change and verify gender
        await profiledata.enterGender('Female');
        await profiledata.verifyGender('Female');
    })

     //Verify 'Abbrechen'-Btn discards changes
     test('Profile Cancel positive @ProfileData @TC-30010', async ({ page }) => {
        navigate = new Navigate(page);
        profiledata =new Profiledata(page);
        await navigate.navigateToProfile();

        //Verify starting values
        await profiledata.VerifyUserData(
            UserDataArray[0].firstname,
            UserDataArray[0].lastname,
            UserDataArray[0].email,
            UserDataArray[0].age,
            UserDataArray[0].gender,
            UserDataArray[0].adress,
            UserDataArray[0].zipcode,
            UserDataArray[0].city,
            UserDataArray[0].country);

        //Enter new data

        
        //Use Cancel-Btn


        //Verify profile again
        await profiledata.VerifyUserData(
            UserDataArray[0].firstname,
            UserDataArray[0].lastname,
            UserDataArray[0].email,
            UserDataArray[0].age,
            UserDataArray[0].gender,
            UserDataArray[0].adress,
            UserDataArray[0].zipcode,
            UserDataArray[0].city,
            UserDataArray[0].country);
    })
})

