import { FullConfig } from '@playwright/test';
import { StepLogger } from './StepLogger';

async function globalTeardown(config: FullConfig) {
  // Generate the consolidated HTML report with all collected test data
  StepLogger.generateHtmlReport();
  console.log('🎯 Generated consolidated HTML report for all test specs');
}

export default globalTeardown;
