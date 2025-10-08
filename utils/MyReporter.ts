import { FullConfig, FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

class MyReporter implements Reporter {
  private resultsFile: string;

constructor(config: FullConfig) {

    this.resultsFile = path.join(__dirname, '../test-results/results.txt');
    fs.mkdirSync(path.dirname(this.resultsFile), { recursive: true });
    // Remove the results file if it exists, so each test run starts fresh
    if (fs.existsSync(this.resultsFile)) {
        fs.unlinkSync(this.resultsFile);
    }
    fs.writeFileSync(this.resultsFile, 'Test Results:\n', 'utf-8');
}


  onTestEnd(test: TestCase, result: TestResult): void {
    const status = result.status;
    const specFile = test.location ? path.basename(test.location.file) : 'unknown';
    const testName = test.title;
    const logMessage = `${status} | ${testName} > ${specFile}`;

    // Log to console
    console.log(logMessage);

    // Append to results file only for the final attempt
    const isFinalAttempt = result.retry === test.results.length - 1;
    if (isFinalAttempt && status !== 'passed') {
      fs.appendFileSync(this.resultsFile, `${logMessage}\n`, 'utf-8');

      // Save trace for failed tests
      if (status === 'failed' && result.attachments) {
        const traceDir = path.join(__dirname, '../test-results/traces');
        fs.mkdirSync(traceDir, { recursive: true });
        result.attachments.forEach(attachment => {
          if (attachment.name === 'trace' && attachment.path) {
            const tracePath = path.join(traceDir, `${testName.replace(/\s+/g, '_')}-trace.zip`);
            fs.copyFileSync(attachment.path, tracePath);
          }
        });
      }
    }
  }

  onEnd(result: FullResult): void {
    console.log('All tests finished. Results written to:', this.resultsFile);
  }
}

export default MyReporter;