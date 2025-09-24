const { sendTestReportEmail } = require('./sendTestReportEmail');

(async () => {
  try {
    await sendTestReportEmail();
  } catch (err) {
    console.error('[ERROR] Fehler beim Senden des Test-Reports:', err);
    process.exit(1);
  }
})();
