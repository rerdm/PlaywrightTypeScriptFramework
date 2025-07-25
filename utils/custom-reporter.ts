import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

class CustomReporter implements Reporter {
  onBegin(config: FullConfig, suite: Suite) {
    console.log(`Starting the run with ${suite.allTests().length} tests`);
  }

  onTestBegin(test: TestCase, result: TestResult) {
    console.log(`🚀 Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // Kurz warten um sicherzustellen, dass alle anderen Logs fertig sind
    setTimeout(() => {
      const status = result.status === 'passed' ? '✅ BESTANDEN' : 
                    result.status === 'failed' ? '❌ FEHLGESCHLAGEN' : 
                    result.status === 'skipped' ? '⏭️ ÜBERSPRUNGEN' : '❓ UNBEKANNT';
      
      console.log('═'.repeat(100));
      console.log(`🏁 TEST BEENDET: ${test.title}`);
      console.log(`📊 Status: ${status}`);
      console.log(`⏱️ Dauer: ${result.duration}ms`);
      console.log(`🕐 Endzeit: ${new Date().toLocaleString('de-DE')}`);
      console.log('═'.repeat(100));
    }, 500); // 500ms Verzögerung um sicherzustellen, dass alle anderen Logs fertig sind
  }

  onEnd(result: FullResult) {
    console.log(`🎯 Finished the run: ${result.status}`);
  }
}

export default CustomReporter;
