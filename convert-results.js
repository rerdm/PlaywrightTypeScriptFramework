const fs = require('fs');
const path = require('path');

// Pfad zur JSON-Datei
const filePath = path.join(__dirname, 'test-results', 'failed-tests.json');

// JSON-Datei lesen
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Header für die Ausgabe
let output = 'Result    Testcase                                      Testspec\n';

// Daten formatieren
data.forEach(test => {
  const result = test.result.padEnd(10); // "Result" Spalte
  const testName = test.testName.padEnd(50); // "Testcase" Spalte
  const specName = test.specName; // "Testspec" Spalte
  output += `${result}${testName}${specName}\n`;
});

// Ausgabe in eine Datei schreiben
const outputFilePath = path.join(__dirname, 'test-results', 'formatted-results.txt');
fs.writeFileSync(outputFilePath, output);

console.log('Die Ergebnisse wurden erfolgreich formatiert und gespeichert:', outputFilePath);