import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Change this to your email address
const recipientEmail = 'reneerdmann@web.de';

// Helper to parse Playwright test results (allure or playwright-report)
function parseTestResults(): {
  summary: string;
  details: string;
  status: 'PASSED' | 'FAILED';
} {
  // Example: parse allure-results/*.json for summary
  const resultsDir = path.join(__dirname, '../allure-results');
  const files = fs.readdirSync(resultsDir).filter(f => f.endsWith('-result.json'));
  let passed = 0, failed = 0, skipped = 0, flaky = 0;
  let details = '';
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf-8'));
    const status = data.status;
    if (status === 'passed') passed++;
    else if (status === 'failed') failed++;
    else if (status === 'skipped') skipped++;
    else if (status === 'flaky') flaky++;
    details += `Test: ${data.name} | Status: ${status}\n`;
  }
  const summary = `Passed: ${passed}, Failed: ${failed}, Skipped: ${skipped}, Flaky: ${flaky}`;
  return {
    summary,
    details,
    status: failed > 0 ? 'FAILED' : 'PASSED',
  };
}

export async function sendTestReportEmail() {
  try {
    const { summary, details, status } = parseTestResults();
    const subject = `E2E Test ${status}`;
    const body = `Test Summary:\n${summary}\n\nDetails:\n${details}`;

    // Configure nodemailer (use SMTP, e.g. Gmail, Outlook, etc.)
    const transporter = nodemailer.createTransport({
      host: 'smtp.web.de', // e.g. smtp.gmail.com
      port: 587,
      secure: false,
      auth: {
        user: 'reneerdmann87@web.de',
        pass: 'F*biTTer54-',
      },
    });

    await transporter.sendMail({
      from: 'Test Automation <DEIN_SMTP_USER>',
      to: recipientEmail,
      subject,
      text: body,
    });
    console.log('Test report email sent.');
  } catch (err) {
    console.error('[ERROR] Fehler beim Senden des Test-Reports:', err);
    throw err;
  }
}

// For CLI usage
if (require.main === module) {
  sendTestReportEmail().catch((err) => {
    console.error('[ERROR] Fehler beim Ausführen von sendTestReportEmail:', err);
    process.exit(1);
  });
}
