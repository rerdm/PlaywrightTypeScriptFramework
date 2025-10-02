const fs = require('fs');
const path = require('path');

// Pfad zur JSON-Datei mit den Testergebnissen
const inputFilePath = path.join(__dirname, 'test-results', 'failed-tests.json');

// Pfad zur Ausgabedatei
const outputFilePath = path.join(__dirname, 'test-results', 'formatted-results.txt');

// Überprüfen, ob die JSON-Datei existiert
if (!fs.existsSync(inputFilePath)) {
    console.error(`Die Datei ${inputFilePath} wurde nicht gefunden.`);
    process.exit(1);
}

// JSON-Datei lesen und parsen
const data = JSON.parse(fs.readFileSync(inputFilePath, 'utf-8'));

// Header für die Ausgabe
let output = 'Result';

// Daten formatieren
data.forEach(test => {
    const result = test.result.padEnd(10); // "Result" Spalte
    const testName = test.testName.padEnd(50); // "Testcase" Spalte
    const specName = test.specName; // "Testspec" Spalte
    output += `${result}     -     ${testName}     -     ${specName}\n`;
});

// Die Datei `formatted-results.txt` überschreiben
fs.writeFileSync(outputFilePath, output);

console.log(`Die Ergebnisse wurden erfolgreich formatiert und in ${outputFilePath} gespeichert.`);