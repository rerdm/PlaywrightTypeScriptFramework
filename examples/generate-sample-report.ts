import { StepLogger } from '../utils/StepLogger';

/**
 * Beispiel für die Verwendung des HTML Report Generators
 * Dieses Script kann nach den Tests ausgeführt werden, um einen HTML Report zu generieren
 */

async function generateSampleReport() {
    console.log('🎨 Generating Sample HTML Report...');
    
    // Beispiel Test 1 - Erfolgreich
    await StepLogger.startTest(
        'Login Test - Valid Credentials', 
        'Production', 
        'login.spec.ts'
    );
    
    await StepLogger.logStepPassedToOpenUrl('StartPage.ts', 'openUrl', 'Login Test', 1, 'http://example.com');
    await StepLogger.logStepSuccess('LoginPage.ts', 'enterUsername', 'Login Test', 2);
    await StepLogger.logStepSuccess('LoginPage.ts', 'enterPassword', 'Login Test', 3);
    await StepLogger.logStepSuccess('LoginPage.ts', 'clickSubmit', 'Login Test', 4);
    await StepLogger.logStepSuccess('HomePage.ts', 'verifyWelcomeMessage', 'Login Test', 5);
    
    await StepLogger.testEnd();
    
    // Beispiel Test 2 - Fehlgeschlagen
    await StepLogger.startTest(
        'Login Test - Invalid Credentials', 
        'Production', 
        'login.spec.ts'
    );
    
    await StepLogger.logStepPassedToOpenUrl('StartPage.ts', 'openUrl', 'Login Test Invalid', 1, 'http://example.com');
    await StepLogger.logStepSuccess('LoginPage.ts', 'enterUsername', 'Login Test Invalid', 2);
    await StepLogger.logStepSuccess('LoginPage.ts', 'enterPassword', 'Login Test Invalid', 3);
    await StepLogger.logStepSuccess('LoginPage.ts', 'clickSubmit', 'Login Test Invalid', 4);
    
    // Simuliere einen failed Step
    const mockLocator = { toString: () => "//div[@id='error-message']" } as any;
    await StepLogger.logStepFailed('HomePage.ts', 'verifyWelcomeMessage', 'Login Test Invalid', 5, mockLocator);
    
    await StepLogger.testEnd();
    
    // Beispiel Test 3 - URL Fehler
    await StepLogger.startTest(
        'Navigation Test - Broken URL', 
        'Staging', 
        'navigation.spec.ts'
    );
    
    await StepLogger.logStepFailedToOpenUrl('StartPage.ts', 'openUrl', 'Navigation Test', 1, 'http://broken-url.com', 404);
    
    await StepLogger.testEnd();
    
    // HTML Report generieren
    StepLogger.generateHtmlReport();
    
    console.log('✅ Sample HTML Report generated successfully!');
    console.log('📁 Check the ./test-reports folder for the HTML file');
}

// Script ausführen
generateSampleReport().catch(console.error);
