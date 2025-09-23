const { sendTestReportEmail } = require('./sendTestReportEmail');

(async () => {
  await sendTestReportEmail();
})();
