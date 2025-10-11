import * as fs from 'fs';
import * as path from 'path';

interface TestInfo {
  name: string;
  line: number;
  tags: string[];
}

interface TestSuite {
  fileName: string;
  filePath: string;
  suiteName: string;
  totalTests: number;
  tests: TestInfo[];
  beforeEach: boolean;
  afterEach: boolean;
  beforeAll: boolean;
  afterAll: boolean;
}

interface TestReport {
  generatedAt: string;
  totalFiles: number;
  totalTests: number;
  testSuites: TestSuite[];
}

class PlaywrightTestParser {
  private testsDirectory: string;
  private outputDirectory: string;
  private excludedTestFiles: string[];

  constructor(testsDir: string = './tests', outputDir: string = './utils/test-documentation', excludedFiles: string[] = []) {
    this.testsDirectory = path.resolve(testsDir);
    this.outputDirectory = path.resolve(outputDir);
    this.excludedTestFiles = excludedFiles;
    
    // Erstelle output directory falls es nicht existiert
    if (!fs.existsSync(this.outputDirectory)) {
      fs.mkdirSync(this.outputDirectory, { recursive: true });
    }
  }

  /**
   * Parsed alle .spec.ts Dateien im tests Verzeichnis
   */
  public parseAllTests(): TestReport {
    console.log(`🔍 Parsing tests in directory: ${this.testsDirectory}`);
    
    const testFiles = this.getTestFiles();
    const testSuites: TestSuite[] = [];
    let totalTests = 0;

    for (const file of testFiles) {
      const suite = this.parseTestFile(file);
      testSuites.push(suite);
      totalTests += suite.totalTests;
      console.log(`✅ Parsed ${suite.fileName}: ${suite.totalTests} tests`);
    }

    const report: TestReport = {
      generatedAt: new Date().toISOString(),
      totalFiles: testFiles.length,
      totalTests,
      testSuites
    };

    return report;
  }

  /**
   * Findet alle .spec.ts Dateien
   */
  private getTestFiles(): string[] {
    const files: string[] = [];
    
    const scanDirectory = (dir: string) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Überspringe node_modules und andere unwichtige Verzeichnisse
          if (!['node_modules', 'allure-results', 'test-results', 'playwright-report'].includes(item)) {
            scanDirectory(fullPath);
          }
        } else if (item.endsWith('.spec.ts') && !this.excludedTestFiles.includes(item)) {
          files.push(fullPath);
        }
      }
    };

    scanDirectory(this.testsDirectory);
    return files;
  }
  /**
   * Parsed eine einzelne Test-Datei
   */
  private parseTestFile(filePath: string): TestSuite {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const fileName = path.basename(filePath);
    
    const tests: TestInfo[] = [];
    let suiteName = '';
    let beforeEach = false;
    let afterEach = false;
    let beforeAll = false;
    let afterAll = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const lineNumber = i + 1;

      // Finde test.describe (Test Suite Namen)
      if (line.includes('test.describe(')) {
        const match = line.match(/test\.describe\(['"`]([^'"`]+)['"`]/);
        if (match) {
          suiteName = match[1];
        }
      }

      // Finde einzelne Tests
      if (line.includes('test(')) {
        const testInfo = this.parseTestLine(line, lineNumber);
        if (testInfo) {
          tests.push(testInfo);
        }
      }

      // Finde Setup/Teardown Hooks
      if (line.includes('test.beforeEach')) beforeEach = true;
      if (line.includes('test.afterEach')) afterEach = true;
      if (line.includes('test.beforeAll')) beforeAll = true;
      if (line.includes('test.afterAll')) afterAll = true;
    }

    return {
      fileName,
      filePath,
      suiteName: suiteName || 'Unknown Suite',
      totalTests: tests.length,
      tests,
      beforeEach,
      afterEach,
      beforeAll,
      afterAll
    };
  }

  /**
   * Parsed eine Test-Zeile und extrahiert Name und Tags
   */
  private parseTestLine(line: string, lineNumber: number): TestInfo | null {
    // Verschiedene Test-Patterns matchen
    const patterns = [
      /test\(['"`]([^'"`]+)['"`]/,  // test('test name')
      /test\.only\(['"`]([^'"`]+)['"`]/,  // test.only('test name')
      /test\.skip\(['"`]([^'"`]+)['"`]/,  // test.skip('test name')
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const testName = match[1];
        const tags = this.extractTags(testName);
        
        return {
          name: testName,
          line: lineNumber,
          tags
        };
      }
    }

    return null;
  }

  /**
   * Extrahiert Tags aus dem Test-Namen (z.B. @login, @smoke, @TC-10001)
   */
  private extractTags(testName: string): string[] {
    // Updated pattern to include TEST-0003 without requiring @
    const tagPattern = /(?:@|\b)(TEST-\d+)/g; // Match @TEST-0003 or TEST-0003
    const matches = testName.match(tagPattern);
    return matches || [];
  }

  /**
   * Speichert den Report als JSON
   */
  public saveReport(report: TestReport, filename: string = 'test-analysis.json'): void {
    const filePath = path.join(this.outputDirectory, filename);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved to: ${filePath}`);
  }

  /**
   * Speichert den Report als Markdown
   */
  public saveMarkdownReport(report: TestReport, filename: string = 'test-analysis.md'): void {
    const filePath = path.join(this.outputDirectory, filename);
    const markdown = this.generateMarkdownReport(report);
    fs.writeFileSync(filePath, markdown);
    console.log(`📄 Markdown report saved to: ${filePath}`);
  }

  /**
   * Generiert einen Timestamp im Format YYYY-MM-DD_HH_MM
   */
  private generateTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}_${hour}_${minute}`;
  }

  /**
   * Speichert eine kompakte Tabellen-Version als Markdown
   */
  public saveTableReport(report: TestReport, filename?: string): void {
    if (!filename) {
      const timestamp = this.generateTimestamp();
      filename = `${timestamp}_test-table.md`;
    }
    const filePath = path.join(this.outputDirectory, filename);
    const markdown = this.generateTableOnlyReport(report);
    fs.writeFileSync(filePath, markdown);
    console.log(`📊 Table report saved to: ${filePath}`);
  }

  /**
   * Generiert einen reinen Tabellen-Report
   */
  private generateTableOnlyReport(report: TestReport): string {
    let markdown = `# Playwright Test Cases Overview\n\n`;
    markdown += `**Generated:** ${new Date(report.generatedAt).toLocaleString()}\n\n`;
    markdown += `**Markdown generated with command**: npm run test-table\n\n`;
    
    // Zeige ausgeschlossene Dateien an
    if (this.excludedTestFiles.length > 0) {
      markdown += `**Excluded test spec files:** ${this.excludedTestFiles.join(', ')}\n\n`;
    }
    
    markdown += `**Summary:** ${report.totalFiles} files, ${report.totalTests} tests\n\n`;

    markdown += `| # | Test Suite | File | Test Case | Line | Tags |\n`;
    markdown += `|---|------------|------|-----------|------|------|\n`;

    let testCounter = 1;
    for (const suite of report.testSuites) {
      for (const test of suite.tests) {
        const tagsStr = test.tags.length > 0 ? test.tags.join(' ') : '-';
        
        markdown += `| ${testCounter} | ${suite.suiteName} | \`${suite.fileName}\` | ${test.name} | ${test.line} | ${tagsStr} |\n`;
        testCounter++;
      }
    }

    markdown += `\n## Test Statistics by Suite\n\n`;
    markdown += `| Test Suite | File | Test Count | Hooks |\n`;
    markdown += `|------------|------|------------|-------|\n`;

    for (const suite of report.testSuites) {
      const hooks = [];
      if (suite.beforeEach) hooks.push('beforeEach');
      if (suite.afterEach) hooks.push('afterEach');
      if (suite.beforeAll) hooks.push('beforeAll');
      if (suite.afterAll) hooks.push('afterAll');
      const hooksStr = hooks.length > 0 ? hooks.join(', ') : '-';

      markdown += `| ${suite.suiteName} | \`${suite.fileName}\` | ${suite.totalTests} | ${hooksStr} |\n`;
    }

    return markdown;
  }

  /**
   * Generiert einen Markdown-Report
   */
  private generateMarkdownReport(report: TestReport): string {
    let markdown = `# Playwright Test Analysis Report\n\n`;
    markdown += `**Generated:** ${new Date(report.generatedAt).toLocaleString()}\n\n`;
    markdown += `**Markdown generated with command**: npm run test-table\n\n`;
    
    // Zeige ausgeschlossene Dateien an
    if (this.excludedTestFiles.length > 0) {
      markdown += `**Excluded files:** ${this.excludedTestFiles.join(', ')}\n\n`;
    }
    
    markdown += `- **Total Test Files:** ${report.totalFiles}\n`;
    markdown += `- **Total Tests:** ${report.totalTests}\n\n`;

    markdown += `## Test Overview Table\n\n`;
    markdown += `| Test Suite | File | Test Case | Line | Tags | Hooks |\n`;
    markdown += `|------------|------|-----------|------|------|-------|\n`;

    for (const suite of report.testSuites) {
      // Setup/Teardown Information
      const hooks = [];
      if (suite.beforeEach) hooks.push('beforeEach');
      if (suite.afterEach) hooks.push('afterEach');
      if (suite.beforeAll) hooks.push('beforeAll');
      if (suite.afterAll) hooks.push('afterAll');
      const hooksStr = hooks.length > 0 ? hooks.join(', ') : '';

      for (let i = 0; i < suite.tests.length; i++) {
        const test = suite.tests[i];
        const suiteName = i === 0 ? suite.suiteName : '';
        const fileName = i === 0 ? `\`${suite.fileName}\`` : '';
        const hooksDisplay = i === 0 ? hooksStr : '';
        const tagsStr = test.tags.length > 0 ? test.tags.join(' ') : '-';
        
        markdown += `| ${suiteName} | ${fileName} | ${test.name} | ${test.line} | ${tagsStr} | ${hooksDisplay} |\n`;
      }
    }

    markdown += `\n## Detailed Test Suites\n\n`;

    for (const suite of report.testSuites) {
      markdown += `### ${suite.suiteName}\n\n`;
      markdown += `**File:** \`${suite.fileName}\`\n\n`;
      markdown += `**Total Tests:** ${suite.totalTests}\n\n`;

      // Setup/Teardown Information
      const hooks = [];
      if (suite.beforeEach) hooks.push('beforeEach');
      if (suite.afterEach) hooks.push('afterEach');
      if (suite.beforeAll) hooks.push('beforeAll');
      if (suite.afterAll) hooks.push('afterAll');
      
      if (hooks.length > 0) {
        markdown += `**Hooks:** ${hooks.join(', ')}\n\n`;
      }

      markdown += `**Tests:**\n\n`;
      for (const test of suite.tests) {
        markdown += `- **${test.name}** (Line ${test.line})`;
        if (test.tags.length > 0) {
          markdown += ` ${test.tags.join(' ')}`;
        }
        markdown += `\n`;
      }
      markdown += `\n`;
    }

    return markdown;
  }

  /**
   * Speichert eine CSV-Datei für Excel-Import
   */
  public saveCsvReport(report: TestReport, filename: string = 'test-analysis.csv'): void {
    const filePath = path.join(this.outputDirectory, filename);
    let csv = 'File,Suite,Test Name,Line,Tags\n';

    for (const suite of report.testSuites) {
      for (const test of suite.tests) {
        const tags = test.tags.join(';');
        csv += `"${suite.fileName}","${suite.suiteName}","${test.name}",${test.line},"${tags}"\n`;
      }
    }

    fs.writeFileSync(filePath, csv);
    console.log(`📄 CSV report saved to: ${filePath}`);
  }
}

// CLI Ausführung
if (require.main === module) {
  const parser = new PlaywrightTestParser();
  
  console.log('🚀 Starting Playwright Test Analysis...\n');
  
  try {
    const report = parser.parseAllTests();
    
    console.log('\n📊 Analysis Results:');
    console.log(`- Found ${report.totalFiles} test files`);
    console.log(`- Found ${report.totalTests} total tests`);
    
    // Speichere verschiedene Report-Formate
    parser.saveReport(report);
    parser.saveMarkdownReport(report);
    parser.saveTableReport(report);
    parser.saveCsvReport(report);
    
    console.log('\n✅ Test analysis completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during test analysis:', error);
    process.exit(1);
  }
}

export default PlaywrightTestParser;
