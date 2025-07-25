/**
 * Utility function for structured logging of test steps
 * Creates consistent and readable step logs for test execution
 */

import { Locator } from '@playwright/test';

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
  let logMessage = `STEP ${stepNumber.toString().padStart(2, '0')}         : ${actionText}`;
  
  // Add locator information if provided
  if (locator) {
    let selectorValue = '';
    
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
  if (locator) {
    let selectorValue = '';
    
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
    }, 1000); // 1 Sekunde Verzögerung um sicherzustellen, dass alle anderen Logs fertig sind
}