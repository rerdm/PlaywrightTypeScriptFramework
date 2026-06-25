import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

// This interface models only the fields we need from every Allure result JSON file.
interface AllureResultFile {
  uuid?: string;
  historyId?: string;
  name?: string;
  fullName?: string;
  status?: string;
  start?: number;
  stop?: number;
  statusDetails?: {
    message?: string;
    trace?: string;
  };
  labels?: Array<{
    name?: string;
    value?: string;
  }>;
}

// This interface represents one final Excel row.
interface ExcelRow {
  suiteName: string;
  testCaseName: string;
  testIds: string;
  stackTrace: string;
  extractedError: string;
}

// This interface tracks one candidate attempt before retry de-duplication.
interface RetryCandidate {
  key: string;
  orderValue: number;
  row: ExcelRow;
}

// Resolve the repository root from the current execution directory.
const ROOT_DIRECTORY = process.cwd();
// Define the source folder where Allure writes raw result artifacts.
const ALLURE_RESULTS_DIRECTORY = path.join(ROOT_DIRECTORY, 'allure-results');
// Define the destination folder for generated Excel reports.
const EXCEL_REPORT_DIRECTORY = path.join(ROOT_DIRECTORY, 'allure-excel-reports');

// Define the TEST-ID extraction pattern here to make future customization easy.
const TEST_ID_EXTRACTION_PATTERN = /\bTEST-\d{4}\b/gi;

// Build a compact timestamp to keep report file names unique and sortable.
function buildTimestamp(): string {
  // Create the current date object once to avoid inconsistent timestamps.
  const now = new Date();
  // Format year as 4 digits.
  const year = now.getFullYear();
  // Format month as 2 digits.
  const month = String(now.getMonth() + 1).padStart(2, '0');
  // Format day as 2 digits.
  const day = String(now.getDate()).padStart(2, '0');
  // Format hours as 2 digits.
  const hours = String(now.getHours()).padStart(2, '0');
  // Format minutes as 2 digits.
  const minutes = String(now.getMinutes()).padStart(2, '0');
  // Format seconds as 2 digits.
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // Return a filename-safe timestamp string.
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

// Ensure the output directory exists before writing files.
function ensureDirectory(directoryPath: string): void {
  // Create the directory recursively only when it does not already exist.
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }
}

// Discover all files matching the requested Allure pattern: *-result.json.
function findAllureResultFiles(resultsDirectory: string): string[] {
  // Return an empty list when the input folder does not exist.
  if (!fs.existsSync(resultsDirectory)) {
    return [];
  }

  // Read only first-level files because Allure stores result files in this directory root.
  return fs
    .readdirSync(resultsDirectory)
    // Keep only files with the exact suffix expected by the user requirement.
    .filter((fileName) => fileName.endsWith('-result.json'))
    // Convert every filename to an absolute path for robust downstream processing.
    .map((fileName) => path.join(resultsDirectory, fileName));
}

// Read a JSON file safely and return null when parsing fails.
function readResultFileSafely(filePath: string): AllureResultFile | null {
  try {
    // Load file content as UTF-8 text.
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    // Parse text into an object using JSON parser.
    const parsedContent = JSON.parse(fileContent) as AllureResultFile;
    // Return parsed data when successful.
    return parsedContent;
  } catch (error) {
    // Print a warning and continue without stopping the entire report generation.
    console.warn(`Skipping invalid JSON file: ${filePath}`);
    console.warn(error);
    // Signal the caller that this file was not usable.
    return null;
  }
}

// Build a readable test case name from available Allure fields.
function buildTestCaseName(result: AllureResultFile, fallbackFileName: string): string {
  // Prefer the short test title when present.
  if (result.name && result.name.trim().length > 0) {
    return result.name;
  }

  // Fallback to fullName when the short title is missing.
  if (result.fullName && result.fullName.trim().length > 0) {
    return result.fullName;
  }

  // Last fallback keeps traceability to the source file.
  return `Unknown test case (${fallbackFileName})`;
}

// Resolve a suite name like "tests/login/" from available Allure metadata.
function buildSuiteName(result: AllureResultFile): string {
  // Prefer the package label because it usually points to the spec file.
  const packageLabelValue = result.labels?.find((label) => label.name === 'package')?.value;
  // Fallback to suite label when package is missing.
  const suiteLabelValue = result.labels?.find((label) => label.name === 'suite')?.value;
  // Last fallback to fullName which contains file and line information.
  const sourceValue = packageLabelValue || suiteLabelValue || result.fullName || '';

  // Normalize to forward slashes and remove trailing line/column suffix.
  const normalizedSource = sourceValue.replace(/\\/g, '/').replace(/:\d+:\d+$/, '').trim();

  // Return a stable fallback when no source data is available.
  if (normalizedSource.length === 0) {
    return 'tests/unknown/';
  }

  // Derive the file segment regardless of whether a full path or filename is provided.
  const fileName = path.basename(normalizedSource);
  // Remove common TypeScript test suffixes to keep suite names compact.
  const baseSuiteName = fileName
    .replace(/\.spec\.(ts|js)$/i, '')
    .replace(/\.(ts|js)$/i, '')
    .trim();

  // Build the final suite path in the requested style.
  if (baseSuiteName.length > 0) {
    return `tests/${baseSuiteName}/`;
  }

  // Fallback keeps the source for debugging if no clean base name was derived.
  return `tests/${fileName || 'unknown'}/`;
}

// Return the complete stack trace text from statusDetails.
function buildCompleteStackTrace(result: AllureResultFile): string {
  // Prefer the full trace field because it usually contains the deepest details.
  if (result.statusDetails?.trace && result.statusDetails.trace.trim().length > 0) {
    return result.statusDetails.trace;
  }

  // Fallback to message when trace is missing in the result file.
  if (result.statusDetails?.message && result.statusDetails.message.trim().length > 0) {
    return result.statusDetails.message;
  }

  // Return a neutral placeholder when no diagnostics are available.
  return 'No stack trace available.';
}

// Extract the first line that starts with "Error:" (case-insensitive).
function extractErrorLine(stackTrace: string): string {
  // Split the trace into individual lines for precise matching.
  const lines = stackTrace.split(/\r?\n/);
  // Search the first matching line requested by the user.
  const matchingLine = lines.find((line) => /^\s*Error:/i.test(line));

  // Return the exact extracted line when found.
  if (matchingLine && matchingLine.trim().length > 0) {
    return matchingLine.trim();
  }

  // Return a stable fallback when no matching error line exists.
  return 'No "Error:" line found.';
}

// Build a fresh RegExp instance so each extraction call starts with a clean state.
function buildTestIdExtractionPattern(): RegExp {
  // Force global matching so all IDs in one text are captured.
  const flags = TEST_ID_EXTRACTION_PATTERN.flags.includes('g')
    ? TEST_ID_EXTRACTION_PATTERN.flags
    : `${TEST_ID_EXTRACTION_PATTERN.flags}g`;

  return new RegExp(TEST_ID_EXTRACTION_PATTERN.source, flags);
}

// Extract all TEST-ID values linked to one test case and return them as a comma-separated list.
function extractTestIds(result: AllureResultFile, testCaseName: string): string {
  // Collect multiple candidate sources because IDs may appear in title, full name, labels, or trace.
  const candidateSources: string[] = [
    testCaseName,
    result.name || '',
    result.fullName || '',
    result.statusDetails?.message || '',
    result.statusDetails?.trace || '',
    ...(result.labels || []).map((label) => label.value || ''),
  ];

  // Keep IDs unique while preserving their discovery order.
  const discoveredTestIds = new Set<string>();

  for (const source of candidateSources) {
    if (!source) {
      continue;
    }

    const matches = source.match(buildTestIdExtractionPattern());
    if (!matches) {
      continue;
    }

    for (const match of matches) {
      discoveredTestIds.add(match.toUpperCase());
    }
  }

  // Return a stable fallback when no matching TEST-ID was found.
  if (discoveredTestIds.size === 0) {
    return 'No TEST-ID found.';
  }

  return Array.from(discoveredTestIds).join(', ');
}

// Keep only result entries that are useful for failure analysis.
function isIncludedInReport(result: AllureResultFile): boolean {
  // Exclude passed tests explicitly as requested.
  if (typeof result.status === 'string' && result.status.trim().toLowerCase() === 'passed') {
    return false;
  }

  // Include everything else (failed, broken, skipped, unknown) for diagnostics.
  return true;
}

// Build a stable grouping key so all retries of the same test are grouped together.
function buildRetryGroupingKey(result: AllureResultFile, testCaseName: string): string {
  // Prefer Allure historyId because it is designed to identify the same test across retries.
  if (result.historyId && result.historyId.trim().length > 0) {
    return `historyId:${result.historyId}`;
  }

  // Fallback to fullName when historyId is not available.
  if (result.fullName && result.fullName.trim().length > 0) {
    return `fullName:${result.fullName}`;
  }

  // Last fallback groups by visible test case name.
  return `name:${testCaseName}`;
}

// Calculate an order number to keep only the latest attempt per test case.
function buildAttemptOrderValue(result: AllureResultFile, filePath: string, index: number): number {
  // Prefer stop time from Allure because it reflects the end of one attempt.
  if (typeof result.stop === 'number' && Number.isFinite(result.stop)) {
    return result.stop;
  }

  // Fallback to start time when stop is missing.
  if (typeof result.start === 'number' && Number.isFinite(result.start)) {
    return result.start;
  }

  // Fallback to filesystem modification time.
  try {
    const fileStat = fs.statSync(filePath);
    return fileStat.mtimeMs;
  } catch {
    // Final fallback keeps deterministic ordering when metadata is unavailable.
    return index;
  }
}

// Convert result files into normalized rows for Excel.
function buildExcelRows(resultFiles: string[]): ExcelRow[] {
  // Track one candidate per retry group and keep only the latest attempt.
  const latestCandidateByKey = new Map<string, RetryCandidate>();

  // Iterate through every discovered result file.
  for (const [index, resultFilePath] of resultFiles.entries()) {
    // Parse one JSON file safely.
    const parsedResult = readResultFileSafely(resultFilePath);

    // Skip invalid files while continuing the report generation.
    if (!parsedResult) {
      continue;
    }

    // Ignore passed test cases because they are not relevant for error analysis.
    if (!isIncludedInReport(parsedResult)) {
      continue;
    }

    // Extract a meaningful fallback filename for diagnostics.
    const fallbackFileName = path.basename(resultFilePath);
    // Build the final test case name.
    const testCaseName = buildTestCaseName(parsedResult, fallbackFileName);
    // Extract one or multiple TEST-ID values for the dedicated Excel column.
    const testIds = extractTestIds(parsedResult, testCaseName);
    // Build suite name for the first column.
    const suiteName = buildSuiteName(parsedResult);
    // Build complete stack trace text.
    const stackTrace = buildCompleteStackTrace(parsedResult);
    // Extract the requested error line that starts with "Error:".
    const extractedError = extractErrorLine(stackTrace);
    // Build grouping key for retry handling.
    const retryGroupingKey = buildRetryGroupingKey(parsedResult, testCaseName);
    // Build order value to identify the latest attempt.
    const orderValue = buildAttemptOrderValue(parsedResult, resultFilePath, index);

    // Keep only the newest candidate for this test case.
    const existingCandidate = latestCandidateByKey.get(retryGroupingKey);
    if (!existingCandidate || orderValue >= existingCandidate.orderValue) {
      latestCandidateByKey.set(retryGroupingKey, {
        key: retryGroupingKey,
        orderValue,
        row: {
          suiteName,
          testCaseName,
          testIds,
          stackTrace,
          extractedError,
        },
      });
    }
  }

  // Convert latest candidates to rows and sort for stable output in Excel.
  const rows = Array.from(latestCandidateByKey.values())
    .sort((left, right) => {
      const suiteCompare = left.row.suiteName.localeCompare(right.row.suiteName);
      if (suiteCompare !== 0) {
        return suiteCompare;
      }

      return left.row.testCaseName.localeCompare(right.row.testCaseName);
    })
    .map((candidate) => candidate.row);

  // Return one final result row per test case.
  return rows;
}

// Create a workbook with visual structure that is useful for analysis.
function buildWorkbook(rows: ExcelRow[]): XLSX.WorkBook {
  // Start from a two-dimensional array to keep full control over header order.
  const tableData: Array<[string, string, string, string, string]> = [
    // Header row required by the user.
    ['Suite Name', 'Test Case Name', 'Test IDs', 'Complete Stack Trace', 'Extracted Error (Error: ...)'],
  ];

  // Append all data rows in the same fixed column order.
  for (const row of rows) {
    tableData.push([row.suiteName, row.testCaseName, row.testIds, row.stackTrace, row.extractedError]);
  }

  // Create worksheet from the table data.
  const worksheet = XLSX.utils.aoa_to_sheet(tableData);

  // Tune column widths for readability in Excel.
  worksheet['!cols'] = [
    { wch: 28 },
    { wch: 55 },
    { wch: 35 },
    { wch: 140 },
    { wch: 80 },
  ];

  // Add an auto-filter on all columns to support quick categorization.
  worksheet['!autofilter'] = { ref: 'A1:E1' };

  // Build a workbook container.
  const workbook = XLSX.utils.book_new();
  // Attach the worksheet with a clear tab name.
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Allure Failure Analysis');

  // Return the final workbook object.
  return workbook;
}

// Recursively delete every file and subfolder in a directory, while keeping the directory itself.
function clearDirectoryContents(directoryPath: string): void {
  // Skip cleanup when the directory does not exist.
  if (!fs.existsSync(directoryPath)) {
    return;
  }

  // Iterate over all directory entries.
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    // Resolve absolute path for the entry.
    const entryPath = path.join(directoryPath, entry.name);

    // Recursively clean nested directories before removing them.
    if (entry.isDirectory()) {
      clearDirectoryContents(entryPath);
      fs.rmdirSync(entryPath);
      continue;
    }

    // Delete regular files directly.
    fs.unlinkSync(entryPath);
  }
}

// Main execution function for CLI usage.
function run(): void {
  // Ensure output directory exists so report writing never fails due to missing folders.
  ensureDirectory(EXCEL_REPORT_DIRECTORY);

  // Discover all target result JSON files.
  const resultFiles = findAllureResultFiles(ALLURE_RESULTS_DIRECTORY);

  // Build report rows from parsed files.
  const rows = buildExcelRows(resultFiles);

  // Skip report creation completely when no relevant failed entries were found.
  if (rows.length === 0) {
    console.log('No failed test cases found. Skipping Excel report generation.');
    return;
  }

  // Build workbook from final rows.
  const workbook = buildWorkbook(rows);

  // Build output filename with timestamp.
  const outputFileName = `Faild-Testcase-Excel-Report-${buildTimestamp()}.xlsx`;
  // Resolve absolute output path.
  const outputFilePath = path.join(EXCEL_REPORT_DIRECTORY, outputFileName);

  // Write workbook to disk.
  XLSX.writeFile(workbook, outputFilePath);

  // Print completion summary for terminal users.
  console.log('Excel report generated successfully.');
  console.log(`Output: ${outputFilePath}`);
  console.log(`Rows written: ${rows.length}`);
  console.log('allure-results files were kept. No cleanup was performed.');
}

// Execute and surface fatal errors with non-zero exit code.
try {
  run();
} catch (error) {
  console.error('Failed to generate Allure Excel report.');
  console.error(error);
  process.exit(1);
}
