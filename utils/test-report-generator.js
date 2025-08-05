/**
 * Test script to demonstrate the new HTML report naming convention
 * Run this with: node utils/test-report-generator.js
 */

const { HtmlReportGenerator } = require('./HtmlReportGenerator');

// Create some sample test reports
const sampleReports = [
    {
        testName: "Login Test Example @TC-10001",
        testSpec: "login.spec.ts",
        environment: "local",
        startTime: new Date().toLocaleString('de-DE'),
        endTime: new Date().toLocaleString('de-DE'),
        status: "PASSED",
        passedSteps: 4,
        failedSteps: 0,
        totalSteps: 4,
        steps: [
            {
                stepNumber: 1,
                status: "PASSED",
                fileName: "LoginPage.ts",
                methodName: "navigateToLogin",
                timestamp: new Date().toLocaleString('de-DE'),
                details: "Successfully navigated to login page"
            },
            {
                stepNumber: 2,
                status: "PASSED", 
                fileName: "LoginPage.ts",
                methodName: "enterCredentials",
                timestamp: new Date().toLocaleString('de-DE'),
                details: "Successfully entered username and password"
            }
        ]
    },
    {
        testName: "Registration Test Example @TC-20001",
        testSpec: "registration.spec.ts", 
        environment: "staging",
        startTime: new Date().toLocaleString('de-DE'),
        endTime: new Date().toLocaleString('de-DE'),
        status: "FAILED",
        passedSteps: 2,
        failedSteps: 1,
        totalSteps: 3,
        steps: [
            {
                stepNumber: 1,
                status: "PASSED",
                fileName: "RegistrationPage.ts",
                methodName: "fillForm",
                timestamp: new Date().toLocaleString('de-DE'),
                details: "Successfully filled registration form"
            },
            {
                stepNumber: 2,
                status: "FAILED",
                fileName: "RegistrationPage.ts", 
                methodName: "submitForm",
                timestamp: new Date().toLocaleString('de-DE'),
                details: "Failed to submit form - validation error"
            }
        ]
    }
];

// Add reports to generator
sampleReports.forEach(report => {
    HtmlReportGenerator.addReport(report);
});

// Generate reports
console.log('🎭 Generating sample HTML reports...');
console.log('');

// Generate timestamped report
HtmlReportGenerator.generateHtmlReport('./test-reports');

console.log('');

// Generate consolidated report  
HtmlReportGenerator.generateConsolidatedHtmlReport('./test-reports');

console.log('');
console.log('✅ Reports successfully generated!');
console.log('📁 Check the test-reports/ folder for:');
console.log('   • YYYY-MM-DD_HH-MM-SS_Environment.html (timestamped)');
console.log('   • consolidated-report.html (CI/CD compatible)');
