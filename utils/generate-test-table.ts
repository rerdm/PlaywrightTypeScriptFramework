#!/usr/bin/env node

import PlaywrightTestParser from './test-parser';

// Hier können Sie die auszuschließenden Dateien konfigurieren zb example.spec.ts
// Beispiel nutzung mehrere files: 
// const excludedFiles = ['example.spec.ts', 'temp.spec.ts', 'draft.spec.ts'];
// Beispiel mit nur einer Datei
//const excludedFiles = ['notThere.spec.ts']; // fiktiver Dateiname, der nicht existiert
//const excludedFiles = ['example.spec.ts'];
// Beispiel ohne Dateien
const excludedFiles: string[] = [];

const parser = new PlaywrightTestParser('./tests', './utils/test-documentation', excludedFiles);

console.log('📊 Generating test table...\n');

try {
  const report = parser.parseAllTests();
  
  // Nur die Tabellen-Version generieren
  parser.saveTableReport(report);
  
  // Generiere Timestamp für die Ausgabe
  const now = new Date();
  const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}_${String(now.getMinutes()).padStart(2, '0')}`;
  
  console.log('\n✅ Test table generated successfully!');
  console.log(`📄 File: utils/test-documentation/${timestamp}_test-table.md`);
  
} catch (error) {
  console.error('❌ Error generating test table:', error);
  process.exit(1);
}
