import dotenv from 'dotenv';
import path from 'path';

export interface EnvironmentConfig {
  environment: string;
  baseURL: string;
  headless: boolean;
  Username?: string;
  Password?: string;
  timeout?: number;
  retryCount?: number;
}

/**
 * Loads environment configuration based on the specified environment
 * @param env Environment name (local, staging, etc.)
 * @returns Environment configuration object
 */
export function loadEnvironmentConfig(env?: string): EnvironmentConfig {
    
  // Determine environment from parameter, environment variable, or default to 'local'
  const environment = env || process.env.ENV || process.env.ENVIRONMENT || 'local';
  
  // Load environment file
  const envFile = `.env.${environment}`;
  const envPath = path.resolve(process.cwd(), envFile);
  const envConfig = dotenv.config({ path: envPath });

  if (envConfig.error) {
    console.warn(`Warning: Could not load ${envFile}. Using default values.`);
  } else {
    //console.log(`Environment configuration loaded from ${envFile}`);
  }

  // Get environment variables with defaults
  const config: EnvironmentConfig = {
    environment,
    baseURL: process.env.BASE_URL || getDefaultBaseURL(environment),
    headless: process.env.HEADLESS === 'true',
    Username: process.env.APP_USERNAME || 'defaultUser',
    Password: process.env.PASSWORD || 'defaultPassword',
  };

  //console.log(`Environment: ${config.environment}`);
  //console.log(`Base URL: ${config.baseURL}`);
  //console.log(`Headless: ${config.headless}`);

  return config;
}

/**
 * Get Fallback base URL for environment if not specified in env file
 */
function getDefaultBaseURL(environment: string): string {
    switch (environment) {
        case 'local':
            return 'http://10.40.226.38/coffeeshop/index.php';
        case 'staging':
            return 'https://marina-abr.github.io/StaticCoffee/index.html';
        default:
            return 'http://10.40.226.38/coffeeshop/index.php';
    }
}

