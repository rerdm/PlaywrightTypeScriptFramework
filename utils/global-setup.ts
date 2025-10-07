import { chromium, FullConfig } from '@playwright/test';
import { loadEnvironmentConfig } from './environment-config';

async function globalSetup(config: FullConfig) {

  // Clear any existing reports at the start
  // Get environment configuration
  const envConfig = loadEnvironmentConfig();

}

export default globalSetup;
