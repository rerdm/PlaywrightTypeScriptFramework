# Test Email Report Utility

## Setup
1. Install dependencies:
   ```sh
   npm install nodemailer
   ```
2. Configure your SMTP settings and recipient email in `utils/sendTestReportEmail.ts`.

## Usage
- After your test run, execute:
  ```sh
  node utils/generateTestEmailReport.js
  ```
- This will send a summary email with all test results.

## Jenkins Integration
- Add the following step to your Jenkinsfile after the test run:
  ```groovy
  bat 'node utils/generateTestEmailReport.js'
  ```
