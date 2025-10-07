import { FullConfig } from '@playwright/test';
import { StepLogger } from './StepLogger';

async function globalTeardown(config: FullConfig) {
}

export default globalTeardown;
