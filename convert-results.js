const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'test-results', 'failed-tests.json');

const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let output = '';

data.forEach(test => {
  const result = test.result.padEnd(10);
  const testName = test.testName.padEnd(50);
  const specName = test.specName; 
  output += `      ${result} - ${testName} - ${specName}\n`;
});

const outputFilePath = path.join(__dirname, 'test-results', 'formatted-results.txt');
fs.writeFileSync(outputFilePath, output);

console.log('Results formated successfully', outputFilePath);