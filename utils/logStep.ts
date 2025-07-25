/**
 * Utility function for structured logging of test steps
 * Creates consistent and readable step logs for test execution
 */

import { Locator } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Interface für Test-Daten
interface TestStep {
  stepNumber: number;
  type: 'STEP' | 'RESULT' | 'ERROR';
  description: string;
  locator?: string;
  timestamp: string;
  icon: string;
}

interface TestCase {
  name: string;
  status: 'PASSED' | 'FAILED' | 'TIMEDOUT' | 'SKIPPED';
  startTime: string;
  endTime?: string;
  duration?: number;
  environment?: string;
  steps: TestStep[];
}

// Globale Variable zum Sammeln der Test-Daten
let currentTestData: TestCase[] = [];
let currentTest: TestCase | null = null;

/**
 * Logs a test step with step number, description and optional locator information
 * @param stepNumber - The current step number (automatically incremented)
 * @param actionText - Description of what the step is doing
 * @param locator - Optional Playwright Locator object to extract selector information
 * @param status - Optional status indicator ('INFO', 'SUCCESS', 'ERROR', 'WARNING')
 * @param additionalInfo - Optional additional information to log
 */
export function logStep(
  stepNumber: number, 
  actionText: string, 
  locator?: Locator | string,
  status: 'INFO' | 'SUCCESS' | 'ERROR' | 'WARNING' = 'INFO',
  additionalInfo?: string
): void {
  const timestamp = new Date().toLocaleString('de-DE');
  
  // Status icons
  const statusIcons = {
    INFO: '📋',
    SUCCESS: '✅',
    ERROR: '❌',
    WARNING: '⚠️'
  };

  // Status colors (for potential HTML output)
  const statusColors = {
    INFO: '#2196F3',
    SUCCESS: '#4CAF50',
    ERROR: '#F44336',
    WARNING: '#FF9800'
  };

  const icon = statusIcons[status];
  
  // Build the log message with consistent formatting
  let logMessage = `STEP ${stepNumber.toString().padStart(2, '0')}               : ${actionText}`;
  
  // Add locator information if provided
  let selectorValue = '';
  if (locator) {
    if (typeof locator === 'string') {
      selectorValue = locator;
    } else {
      // Extract selector from Playwright Locator
      // This gets the internal selector string from the locator
      try {
        selectorValue = locator.toString();
      } catch (error) {
        selectorValue = 'Unknown selector';
      }
    }
    
    logMessage += ` value=${selectorValue}`;
  }
  
  // Add timestamp and additional info
  if (additionalInfo) {
    console.log(`${icon} ${logMessage} | ${additionalInfo} | 🕐 ${timestamp}`);
  } else {
    console.log(`${icon} ${logMessage} | 🕐 ${timestamp}`);
  }

  // Sammle Daten für HTML Report
  if (currentTest) {
    currentTest.steps.push({
      stepNumber,
      type: status === 'ERROR' ? 'ERROR' : 'STEP',
      description: actionText,
      locator: selectorValue,
      timestamp,
      icon
    });
  }
}

/**
 * Logs a step with SUCCESS status
 * @param stepNumber - The current step number
 * @param description - Description of the successful step
 * @param locator - Optional locator information
 * @param additionalInfo - Optional additional information
 */
export function logStepSuccess(stepNumber: number, description: string, locator?: Locator | string, additionalInfo?: string): void {
  const timestamp = new Date().toLocaleString('de-DE');
  
  // Build the log message with RESULT formatting to match STEP alignment
  let logMessage = `STEP RESULT ${stepNumber.toString().padStart(2, '0')}  : ${description}`;
  
  // Add locator information if provided
  let selectorValue = '';
  if (locator) {
    if (typeof locator === 'string') {
      selectorValue = locator;
    } else {
      // Extract selector from Playwright Locator
      try {
        selectorValue = locator.toString();
      } catch (error) {
        selectorValue = 'Unknown selector';
      }
    }
    
    logMessage += ` value=${selectorValue}`;
  }
  
  // Add timestamp and additional info
  if (additionalInfo) {
    console.log(`✅ ${logMessage} | ${additionalInfo} | 🕐 ${timestamp}`);
  } else {
    console.log(`✅ ${logMessage} | 🕐 ${timestamp}`);
  }

  // Sammle Daten für HTML Report
  if (currentTest) {
    currentTest.steps.push({
      stepNumber,
      type: 'RESULT',
      description,
      locator: selectorValue,
      timestamp,
      icon: '✅'
    });
  }
}

/**
 * Logs a step with ERROR status
 * @param stepNumber - The current step number
 * @param description - Description of the failed step
 * @param locator - Optional locator information
 * @param errorMessage - Error message or additional error info
 */
export function logStepError(stepNumber: number, description: string, locator?: Locator | string, errorMessage?: string): void {
  logStep(stepNumber, description, locator, 'ERROR', errorMessage);
}

/**
 * Logs a failed step with ERROR STEP formatting
 * @param stepNumber - The current step number
 * @param description - Description of what failed
 * @param locator - Optional locator information
 * @param errorMessage - Error message or additional error info
 */
export function logStepFailed(stepNumber: number, description: string, locator?: Locator | string, errorMessage?: string): void {
  const timestamp = new Date().toLocaleString('de-DE');
  
  // Build the log message with ERROR STEP formatting
  let logMessage = `ERROR STEP ${stepNumber.toString().padStart(2, '0')} : FAILED: ${description}`;
  
  // Add locator information if provided
  let selectorValue = '';
  if (locator) {
    if (typeof locator === 'string') {
      selectorValue = locator;
    } else {
      // Extract selector from Playwright Locator
      try {
        selectorValue = locator.toString();
      } catch (error) {
        selectorValue = 'Unknown selector';
      }
    }
    
    logMessage += ` value=${selectorValue}`;
  }
  
  // Add timestamp and error message
  if (errorMessage) {
    console.log(`❌ ${logMessage} | ${errorMessage} | 🕐 ${timestamp}`);
  } else {
    console.log(`❌ ${logMessage} | 🕐 ${timestamp}`);
  }

  // Sammle Daten für HTML Report
  if (currentTest) {
    currentTest.steps.push({
      stepNumber,
      type: 'ERROR',
      description: `FAILED: ${description}`,
      locator: selectorValue,
      timestamp,
      icon: '❌'
    });
  }
}

/**
 * Logs a step with WARNING status
 * @param stepNumber - The current step number
 * @param description - Description of the warning step
 * @param locator - Optional locator information
 * @param warningMessage - Warning message or additional warning info
 */
export function logStepWarning(stepNumber: number, description: string, locator?: Locator | string, warningMessage?: string): void {
  logStep(stepNumber, description, locator, 'WARNING', warningMessage);
}

/**
 * Creates a separator line for better log readability
 * @param title - Optional title for the separator
 * @param length - Length of the separator line (default: 80)
 */
export function logSeparator(title?: string, length: number = 80): void {
  if (title) {
    const titlePadding = Math.max(0, Math.floor((length - title.length - 2) / 2));
    const separator = '═'.repeat(titlePadding) + ` ${title} ` + '═'.repeat(titlePadding);
    console.log(separator.slice(0, length));
  } else {
    console.log('═'.repeat(length));
  }
}

/**
 * Logs test start information
 * @param testName - Name of the test that is starting
 * @param environment - Optional environment information
 */
export function logTestStart(testName: string, environment?: string): void {
  logSeparator(`TEST START: ${testName}`, 100);
  console.log(`🚀 Test gestartet: ${testName}`);
  if (environment) {
    console.log(`🌍 Umgebung: ${environment}`);
  }
  console.log(`🕐 Startzeit: ${new Date().toLocaleString('de-DE')}`);
  logSeparator('', 100);

  // Neuen Test für HTML Report erstellen
  currentTest = {
    name: testName,
    status: 'PASSED', // Wird später aktualisiert
    startTime: new Date().toLocaleString('de-DE'),
    environment,
    steps: []
  };
}

/**
 * Logs test end information
 * @param testName - Name of the test that ended
 * @param status - Test result status
 * @param duration - Test duration in milliseconds
 */
export function logTestEnd(testName: string, status: 'PASSED' | 'FAILED' | 'SKIPPED', duration?: number): void {
  logSeparator(`TEST END: ${testName}`, 100);
  
  const statusIcons = {
    PASSED: '✅',
    FAILED: '❌',
    SKIPPED: '⏭️'
  };

  console.log(`${statusIcons[status]} Test beendet: ${testName}`);
  console.log(`📊 Status: ${status}`);
  if (duration !== undefined) {
    console.log(`⏱️ Dauer: ${duration}ms`);
  }
  console.log(`🕐 Endzeit: ${new Date().toLocaleString('de-DE')}`);
  logSeparator('', 100);
}

/**
 * Logs the end time of a test with a formatted timestamp
 * Uses setTimeout to ensure it's logged after all other logs
 * @param testName - Name of the test
 * @param status - Optional test status
 * @param duration - Optional test duration in milliseconds
 */
export function logTestEndTime(testName: string, status?: string, duration?: number): void {
    // Verwende setTimeout um sicherzustellen, dass dieser Log nach allen anderen kommt
    setTimeout(() => {
        const endTime = new Date().toLocaleString('de-DE');
        
        // Verwende das gleiche Format wie logTestStart
        logSeparator(`TEST END: ${testName}`, 100);
        
        console.log(`🏁 Test beendet: ${testName}`);
        
        if (status) {
            const statusIcon = status === 'passed' ? '✅' : 
                             status === 'failed' ? '❌' : 
                             status === 'timedout' ? '⏰' : '❓';
            console.log(`📊 Endstatus: ${statusIcon} ${status.toUpperCase()}`);
        }
        
        if (duration !== undefined) {
            console.log(`⏱️ Gesamtdauer: ${duration}ms`);
        }
        
        console.log(`🕐 Beendet um: ${endTime}`);
        logSeparator('', 100);
        console.log(''); // Leerzeile am Ende für bessere Lesbarkeit

        // Test-Daten für HTML Report aktualisieren
        if (currentTest) {
            currentTest.endTime = endTime;
            currentTest.duration = duration;
            
            // Prüfe, ob es ERROR-Steps gibt, dann ist der Test FAILED
            const hasErrors = currentTest.steps.some(step => step.type === 'ERROR');
            
            // Debug-Logging
            console.log(`🔍 Debug: Test "${testName}" - Status Parameter: "${status}", Hat Errors: ${hasErrors}`);
            
            // Priorität: ERROR > TIMEOUT > FAILED > PASSED
            if (hasErrors) {
                currentTest.status = 'FAILED';
                console.log(`🔍 Debug: Test als FAILED markiert (wegen ERROR-Steps)`);
            } else if (status === 'timedout') {
                currentTest.status = 'TIMEDOUT';
                console.log(`🔍 Debug: Test als TIMEDOUT markiert`);
            } else if (status === 'failed') {
                currentTest.status = 'FAILED';
                console.log(`🔍 Debug: Test als FAILED markiert (status parameter)`);
            } else if (status === 'passed') {
                currentTest.status = 'PASSED';
                console.log(`🔍 Debug: Test als PASSED markiert`);
            } else {
                currentTest.status = 'SKIPPED';
                console.log(`🔍 Debug: Test als SKIPPED markiert (Fallback)`);
            }
            
            currentTestData.push(currentTest);
            currentTest = null;
            
            // HTML Report generieren nach jedem Test
            generateHtmlReport();
        }
    }, 1000); // 1 Sekunde Verzögerung um sicherzustellen, dass alle anderen Logs fertig sind
}

/**
 * Generiert einen HTML Report mit allen Test-Ergebnissen
 */
function generateHtmlReport(): void {
    const reportPath = path.join(process.cwd(), 'test-reports');
    const reportFile = path.join(reportPath, 'test-report.html');
    
    // Erstelle Report-Ordner falls nicht vorhanden
    if (!fs.existsSync(reportPath)) {
        fs.mkdirSync(reportPath, { recursive: true });
    }

    // Berechne Statistiken
    const totalTests = currentTestData.length;
    const passedTests = currentTestData.filter(test => test.status === 'PASSED').length;
    const failedTests = currentTestData.filter(test => test.status === 'FAILED').length;
    const timedoutTests = currentTestData.filter(test => test.status === 'TIMEDOUT').length;
    const skippedTests = currentTestData.filter(test => test.status === 'SKIPPED').length;

    const passPercentage = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    const htmlContent = `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Report</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        .test-step { transition: all 0.3s ease; }
        .test-step:hover { background-color: #f3f4f6; }
        .collapsible-content { 
            max-height: 0; 
            overflow: hidden; 
            transition: max-height 0.3s ease;
        }
        .collapsible-content.expanded { 
            max-height: 1000px; 
        }
        .ring-chart {
            width: 200px;
            height: 200px;
            margin: 0 auto;
        }
    </style>
</head>
<body class="bg-gray-50 font-sans">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800 mb-2">Playwright Test Report</h1>
                    <p class="text-gray-600">Generiert am: ${new Date().toLocaleString('de-DE')}</p>
                </div>
                
                <!-- Ring Diagramm -->
                <div class="text-center">
                    <div class="ring-chart relative">
                        <canvas id="ringChart" width="200" height="200"></canvas>
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-2xl font-bold text-gray-800">${totalTests}</div>
                                <div class="text-sm text-gray-600">Tests</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Statistiken -->
            <div class="grid grid-cols-4 gap-4 mt-6">
                <div class="bg-green-100 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-green-600">${passedTests}</div>
                    <div class="text-sm text-green-700">Passed</div>
                </div>
                <div class="bg-red-100 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-red-600">${failedTests}</div>
                    <div class="text-sm text-red-700">Failed</div>
                </div>
                <div class="bg-yellow-100 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-yellow-600">${timedoutTests}</div>
                    <div class="text-sm text-yellow-700">Timeout</div>
                </div>
                <div class="bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-2xl font-bold text-gray-600">${skippedTests}</div>
                    <div class="text-sm text-gray-700">Skipped</div>
                </div>
            </div>
        </div>

        <!-- Test Cases -->
        <div class="space-y-4">
            ${currentTestData.map((test, index) => `
                <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div class="p-6 cursor-pointer hover:bg-gray-50 transition-colors" onclick="toggleTest(${index})">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center space-x-4">
                                <div class="text-2xl">
                                    ${test.status === 'PASSED' ? '✅' : 
                                      test.status === 'FAILED' ? '❌' : 
                                      test.status === 'TIMEDOUT' ? '⏰' : '⏭️'}
                                </div>
                                <div>
                                    <h3 class="text-lg font-semibold text-gray-800">${test.name}</h3>
                                    <div class="flex space-x-4 text-sm text-gray-600 mt-1">
                                        <span>Start: ${test.startTime}</span>
                                        ${test.endTime ? `<span>Ende: ${test.endTime}</span>` : ''}
                                        ${test.duration ? `<span>Dauer: ${test.duration}ms</span>` : ''}
                                        ${test.environment ? `<span>Umgebung: ${test.environment}</span>` : ''}
                                    </div>
                                </div>
                            </div>
                            <div class="text-2xl transform transition-transform" id="arrow-${index}">
                                ▼
                            </div>
                        </div>
                    </div>
                    
                    <!-- Aufklappbarer Bereich für Steps -->
                    <div class="collapsible-content" id="content-${index}">
                        <div class="px-6 pb-6 border-t bg-gray-50">
                            <h4 class="font-semibold text-gray-700 mb-3 mt-4">Test Steps:</h4>
                            <div class="space-y-2">
                                ${test.steps.map(step => `
                                    <div class="flex items-start space-x-3 p-3 bg-white rounded border">
                                        <span class="text-lg">${step.icon}</span>
                                        <div class="flex-1">
                                            <div class="font-mono text-sm">
                                                <span class="font-bold">
                                                    ${step.type === 'ERROR' ? 'ERROR STEP' : step.type} ${step.stepNumber.toString().padStart(2, '0')}
                                                </span>
                                                : ${step.description}
                                            </div>
                                            ${step.locator ? `
                                                <div class="text-xs text-gray-600 mt-1 font-mono">
                                                    Locator: ${step.locator}
                                                </div>
                                            ` : ''}
                                            <div class="text-xs text-gray-500 mt-1">
                                                ${step.timestamp}
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    </div>

    <script>
        // Ring Diagramm erstellen
        const ctx = document.getElementById('ringChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Passed', 'Failed', 'Timeout', 'Skipped'],
                datasets: [{
                    data: [${passedTests}, ${failedTests}, ${timedoutTests}, ${skippedTests}],
                    backgroundColor: [
                        '#10B981', // Grün für Passed
                        '#EF4444', // Rot für Failed  
                        '#F59E0B', // Gelb für Timeout
                        '#6B7280'  // Grau für Skipped
                    ],
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = ${totalTests};
                                const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                return label + ': ' + value + ' (' + percentage + '%)';
                            }
                        }
                    }
                }
            }
        });

        // Aufklapp-Funktionalität
        function toggleTest(index) {
            const content = document.getElementById('content-' + index);
            const arrow = document.getElementById('arrow-' + index);
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                arrow.style.transform = 'rotate(0deg)';
            } else {
                content.classList.add('expanded');
                arrow.style.transform = 'rotate(180deg)';
            }
        }
    </script>
</body>
</html>`;

    // HTML-Datei schreiben
    fs.writeFileSync(reportFile, htmlContent, 'utf8');
    console.log(`📊 HTML Report erstellt: ${reportFile}`);
}