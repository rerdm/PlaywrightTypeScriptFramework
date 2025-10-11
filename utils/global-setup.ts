import { chromium, FullConfig } from '@playwright/test';
import { loadEnvironmentConfig } from './environment-config';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  // Clear any existing reports at the start
  // Get environment configuration
  const envConfig = loadEnvironmentConfig();

  const retries = config.projects[0]?.retries ?? 0;
  const environment = envConfig.environment;
  const baseURL = envConfig.baseURL;
  
  const logMessage = `Test Configuration:\nRetries: ${retries}\nEnvironment: ${environment}\nBase URL: ${baseURL}\n`;

  const boxTop = '╔' + '═'.repeat(50) + '╗';
  const boxBottom = '╚' + '═'.repeat(50) + '╝';
  const boxContent = logMessage
    .split('\n')
    .map(line => `║ ${line.padEnd(48)} ║`)
    .join('\n');

  const boxedLogMessage = `${boxTop}\n${boxContent}\n${boxBottom}`;

  const logFilePath = path.join(process.cwd(), 'test-configuration-log.txt');
  fs.writeFileSync(logFilePath, boxedLogMessage);

  console.log(boxedLogMessage);
}

export default globalSetup;
