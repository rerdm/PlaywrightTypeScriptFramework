import test, { Locator } from '@playwright/test';
import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';
import { HtmlReportGenerator, TestReport, TestStep } from './HtmlReportGenerator';
import { ReportManager } from './ReportManager';

/**
 * StepLogger utility class for logging test steps with step counting
 * Provides methods to log method execution steps in a consistent format
 */
export class StepLogger {
    // Counter für verschiedene Step-Typen
    private static passedStepsCount: number = 0;
    private static failedStepsCount: number = 0;
    private static urlPassedStepsCount: number = 0;
    private static urlFailedStepsCount: number = 0;
    
    // Report-Daten
    private static currentTestReport: TestReport | null = null;
    private static testSteps: TestStep[] = [];


    static async startTest(testName: string , environment: string, testSpec: string ): Promise<void> {
        // Counter zurücksetzen bei Test-Start
        this.passedStepsCount = 0;
        this.failedStepsCount = 0;
        this.testSteps = [];
        
        // Test-Report initialisieren
        this.currentTestReport = {
            testName,
            testSpec,
            environment,
            startTime: new Date().toLocaleString('de-DE'),
            endTime: '',
            status: 'PASSED',
            passedSteps: 0,
            failedSteps: 0,
            totalSteps: 0,
            steps: []
        };
        
        const timestamp = new Date().toLocaleString();
        console.log('═'.repeat(100));
        console.log(` Test START               :    [${timestamp}]`);
        console.log(` Environment              :    ${environment}`);
        console.log(` Test Spec                :    ${testSpec}`);
        console.log(` Test Name                :    ${testName}`);
        console.log('═'.repeat(100));
    }

    
    static async logStepSuccess(fileName: string, methodName: string, testName: string, stepCount: number): Promise<void> {
        this.passedStepsCount++; // Counter erhöhen
        const timestamp = new Date().toLocaleString();
        
        // Step zu Report hinzufügen
        const step: TestStep = {
            stepNumber: stepCount,
            status: 'PASSED',
            fileName,
            methodName,
            timestamp,
            details: `Successfully executed ${methodName} in ${fileName}`
        };
        this.testSteps.push(step);
        
        console.log(`[${timestamp}] STEP ${stepCount} - PASSED - Filename: {${fileName}} Methodname: {${methodName}} Testname: {${testName}}`);
    }

    static async logStepFailed(fileName: string ,methodName: string, testName: string, stepCount: number, locator: Locator): Promise<void> {
        this.failedStepsCount++; // Counter erhöhen
        const timestamp = new Date().toLocaleString();
        
        // Step zu Report hinzufügen
        const step: TestStep = {
            stepNumber: stepCount,
            status: 'FAILED',
            fileName,
            methodName,
            timestamp,
            details: `Failed to execute ${methodName} in ${fileName}`,
            locator: locator.toString()
        };
        this.testSteps.push(step);
        
        console.log(`[${timestamp}] STEP ${stepCount} - FAILED - Filename: {${fileName}} Methodname: {${methodName}} Testname: {${testName}} - locator not Found or not available: {${locator}}`);
    }

    static async logStepFailedToOpenUrl(fileName: string, methodName: string, testName: string, stepCount: number, URL: String, responseStatus: number): Promise<void> {
        this.failedStepsCount++; // Counter erhöhen
        const timestamp = new Date().toLocaleString();
        
        // Step zu Report hinzufügen
        const step: TestStep = {
            stepNumber: stepCount,
            status: 'FAILED',
            fileName,
            methodName,
            timestamp,
            details: `Failed to open URL in ${methodName}`,
            url: URL.toString(),
            responseStatus
        };
        this.testSteps.push(step);
        
        console.log(`[${timestamp}] STEP ${stepCount} - FAILED - Filename: {${fileName}} Methodname: {${methodName}} Testname: {${testName}} URL: {${URL}} not reachable - Response Code: {${responseStatus}}`);
    }

    static async logStepPassedToOpenUrl(fileName: string, methodName: string, testName: string, stepCount: number, URL: String): Promise<void> {
        this.passedStepsCount++; // Counter erhöhen
        const timestamp = new Date().toLocaleString();
        
        // Step zu Report hinzufügen
        const step: TestStep = {
            stepNumber: stepCount,
            status: 'PASSED',
            fileName,
            methodName,
            timestamp,
            details: `Successfully opened URL in ${methodName}`,
            url: URL.toString()
        };
        this.testSteps.push(step);
        
        console.log(`[${timestamp}] STEP ${stepCount} - PASSED - Filename: {${fileName}} Methodname: {${methodName}} Testname: {${testName}} URL: {${URL}}`);
    }

    static async testEnd(): Promise<void> {
        const timestamp = new Date().toLocaleString();
        const totalSteps = this.passedStepsCount + this.failedStepsCount;
        const testPassed: boolean = this.failedStepsCount === 0;

        // Test-Report finalisieren
        if (this.currentTestReport) {
            this.currentTestReport.endTime = timestamp;
            this.currentTestReport.status = testPassed ? 'PASSED' : 'FAILED';
            this.currentTestReport.passedSteps = this.passedStepsCount;
            this.currentTestReport.failedSteps = this.failedStepsCount;
            this.currentTestReport.totalSteps = totalSteps;
            this.currentTestReport.steps = [...this.testSteps];
            
            // Report zur Collection hinzufügen
            ReportManager.addReport(this.currentTestReport);
        }

        console.log('═'.repeat(100));
        if (!testPassed) {
            console.log(`Result                    :    ❌ Test Failed`);
        }
        else {
            console.log(`Result                    :    ✅ Test Passed`);
        }
        
        console.log(`Test END                  :    [${timestamp}]`);
        console.log('─'.repeat(100));
        console.log('📊 STEP STATISTICS:');
        console.log(`✅ Passed Steps           :    ${this.passedStepsCount}`);
        console.log(`❌ Failed Steps           :    ${this.failedStepsCount}`);
        console.log(`📈 Total Steps            :    ${totalSteps}`);
        console.log('═'.repeat(100));
    }

    /**
     * Generiert den HTML Report für alle gesammelten Tests
     */
    static generateHtmlReport(): void {
        const reports = ReportManager.getReports();
        
        // Reports an HtmlReportGenerator übertragen
        HtmlReportGenerator.clearReports();
        reports.forEach(report => HtmlReportGenerator.addReport(report));
        
        // Generate only timestamped report (consolidated report commented out)
        HtmlReportGenerator.generateHtmlReport('./test-reports');
        // HtmlReportGenerator.generateConsolidatedHtmlReport('./test-reports'); // Temporarily disabled
        console.log('🎨 HTML Report wurde generiert! (Zeitstempel_Environment.html)');
    }

    /**
     * Löscht alle gesammelten Report-Daten
     */
    static clearReports(): void {
        ReportManager.clearReports();
        console.log('🗑️ Report-Daten wurden gelöscht');
    }

}
