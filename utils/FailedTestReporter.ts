import { FullConfig, TestError, TestStep } from '@playwright/test/reporter';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

interface TestCase {
  title: string;
  parent: { title: string };
}

interface TestResult {
  status: 'passed' | 'failed' | 'skipped';
}

class FailedTestReporter {
  private failedTests: { specName: string; testName: string; result: string }[] = [];
  private readonly outputDir = join(process.cwd(), 'test-results');
  private readonly outputFile = join(this.outputDir, 'failed-tests.json');

  onTestEnd(test: TestCase, result: TestResult) {
    if (result.status === 'failed') {
      this.failedTests.push({
        specName: test.parent.title,
        testName: test.title,
        result: 'Failed',
      });
    }
  }

  onEnd() {
    if (!existsSync(this.outputDir)) {
      mkdirSync(this.outputDir, { recursive: true });
    }
    writeFileSync(this.outputFile, JSON.stringify(this.failedTests, null, 2));
    console.log(`✅ Failed test cases written to: ${this.outputFile}`);
  }
}

export default FailedTestReporter;