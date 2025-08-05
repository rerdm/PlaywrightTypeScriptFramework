import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

export interface TestStep {
    stepNumber: number;
    status: 'PASSED' | 'FAILED';
    fileName: string;
    methodName: string;
    timestamp: string;
    details?: string;
    locator?: string;
    url?: string;
    responseStatus?: number;
}

export interface TestReport {
    testName: string;
    testSpec: string;
    environment: string;
    startTime: string;
    endTime: string;
    status: 'PASSED' | 'FAILED';
    passedSteps: number;
    failedSteps: number;
    totalSteps: number;
    steps: TestStep[];
}

export class HtmlReportGenerator {
    private static reports: TestReport[] = [];
    
    static addReport(report: TestReport): void {
        this.reports.push(report);
    }
    
    static generateHtmlReport(outputPath: string = './test-reports'): void {
        // Ensure output directory exists
        if (!existsSync(outputPath)) {
            mkdirSync(outputPath, { recursive: true });
        }
        
        const htmlContent = this.generateHtmlContent();
        
        // Generate timestamp in format: YYYY-MM-DD_HH-MM-SS
        const now = new Date();
        const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
        
        // Get environment from the first report (if available)
        const environment = this.reports.length > 0 ? this.reports[0].environment : 'unknown';
        
        // Create filename: Zeitstempel_Environment.html
        const fileName = `${timestamp}_${environment}.html`;
        const filePath = join(outputPath, fileName);
        
        writeFileSync(filePath, htmlContent, 'utf8');
        console.log(`📊 HTML Report generated: ${filePath}`);
    }
    
    /**
     * Generates HTML report with a fixed filename for CI/CD compatibility
     * @param outputPath Output directory path
     * @param filename Custom filename (default: consolidated-report.html)
     * 
     * CURRENTLY DISABLED - Use generateHtmlReport() instead for timestamped reports
     */
    /*
    static generateConsolidatedHtmlReport(outputPath: string = './test-reports', filename: string = 'consolidated-report.html'): void {
        // Ensure output directory exists
        if (!existsSync(outputPath)) {
            mkdirSync(outputPath, { recursive: true });
        }
        
        const htmlContent = this.generateHtmlContent();
        const filePath = join(outputPath, filename);
        
        writeFileSync(filePath, htmlContent, 'utf8');
        console.log(`📊 Consolidated HTML Report generated: ${filePath}`);
        
        // Also generate the timestamped version
        this.generateHtmlReport(outputPath);
    }
    */
    
    private static generateHtmlContent(): string {
        const totalTests = this.reports.length;
        const passedTests = this.reports.filter(r => r.status === 'PASSED').length;
        const failedTests = totalTests - passedTests;
        
        return `
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playwright Test Report</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'success': '#10b981',
                        'error': '#ef4444',
                        'warning': '#f59e0b'
                    }
                }
            }
        }
    </script>
    <style>
        .collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .collapsible-content.expanded {
            max-height: 2000px;
            transition: max-height 0.5s ease-in;
        }
        
        /* Ring Chart Animations */
        @keyframes ringGrow {
            from {
                stroke-dasharray: 0 502.4;
            }
        }
        
        .ring-chart circle {
            animation: ringGrow 2s ease-out;
        }
        
        /* Pulse Animation for Icons */
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.1);
            }
        }
        
        .pulse-icon {
            animation: pulse 2s infinite;
        }
        
        /* Counter Animation */
        @keyframes countUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .count-up {
            animation: countUp 1s ease-out;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div class="flex items-center justify-between mb-4">
                <h1 class="text-3xl font-bold text-gray-800">🎭 Playwright Test Report</h1>
                <div class="text-sm text-gray-500">
                    Generated: ${new Date().toLocaleString('de-DE')}
                </div>
            </div>
            
            <!-- Test Summary Dashboard -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <!-- Ring Diagram -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-800 mb-4 text-center">Test Results Overview</h3>
                    <div class="flex items-center justify-center">
                        <div class="relative">
                            <!-- SVG Ring Chart -->
                            <svg width="200" height="200" viewBox="0 0 200 200" class="transform -rotate-90 ring-chart">
                                <!-- Background Circle -->
                                <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" stroke-width="20"/>
                                <!-- Passed Tests Arc -->
                                <circle cx="100" cy="100" r="80" fill="none" stroke="#10b981" stroke-width="20"
                                        stroke-dasharray="${(passedTests / totalTests * 502.4) || 0} 502.4"
                                        stroke-linecap="round"/>
                                <!-- Failed Tests Arc -->
                                <circle cx="100" cy="100" r="80" fill="none" stroke="#ef4444" stroke-width="20"
                                        stroke-dasharray="${(failedTests / totalTests * 502.4) || 0} 502.4"
                                        stroke-dashoffset="${-(passedTests / totalTests * 502.4) || 0}"
                                        stroke-linecap="round"/>
                            </svg>
                            <!-- Center Content -->
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <div class="text-3xl font-bold text-gray-800 count-up">${totalTests}</div>
                                <div class="text-sm text-gray-600">Total Tests</div>
                                <div class="text-2xl mt-2 pulse-icon">${failedTests === 0 ? '🎉' : totalTests === failedTests ? '😞' : '⚡'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ring Chart Legend -->
                    <div class="mt-4 flex justify-center space-x-6">
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-green-500 rounded-full"></div>
                            <span class="text-sm text-gray-600">Passed (${passedTests})</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <div class="w-4 h-4 bg-red-500 rounded-full"></div>
                            <span class="text-sm text-gray-600">Failed (${failedTests})</span>
                        </div>
                    </div>
                </div>
                
                <!-- Statistics Cards -->
                <div class="space-y-4">
                    <!-- Success Rate Card -->
                    <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <h4 class="text-lg font-semibold text-gray-800">Success Rate</h4>
                                <div class="text-3xl font-bold text-purple-600">${Math.round((passedTests / totalTests * 100) || 0)}%</div>
                            </div>
                            <div class="text-4xl">⚡</div>
                        </div>
                        <!-- Mini Progress Bar -->
                        <div class="mt-4 bg-purple-200 rounded-full h-2">
                            <div class="bg-purple-600 h-2 rounded-full transition-all duration-1000" 
                                 style="width: ${Math.round((passedTests / totalTests * 100) || 0)}%"></div>
                        </div>
                    </div>
                    
                    <!-- Test Results Grid -->
                    <div class="grid grid-cols-2 gap-4">
                        <!-- Passed Tests -->
                        <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-2xl font-bold text-green-600">${passedTests}</div>
                                    <div class="text-sm text-green-700">Passed</div>
                                </div>
                                <div class="text-2xl">✅</div>
                            </div>
                        </div>
                        
                        <!-- Failed Tests -->
                        <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                            <div class="flex items-center justify-between">
                                <div>
                                    <div class="text-2xl font-bold text-red-600">${failedTests}</div>
                                    <div class="text-sm text-red-700">Failed</div>
                                </div>
                                <div class="text-2xl">❌</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Status Message -->
                    <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
                        <div class="flex items-center space-x-3">
                            <div class="text-2xl">
                                ${failedTests === 0 ? '🎯' : '⚠️'}
                            </div>
                            <div>
                                <div class="font-semibold text-gray-800">
                                    ${totalTests === 0 ? 'No Tests Executed' : 
                                      failedTests === 0 ? 'All Tests Passed!' :
                                      `${passedTests}/${totalTests} Tests Passed`}
                                </div>
                                <div class="text-sm text-gray-600">
                                    ${failedTests === 0 && totalTests > 0 ? 'Perfect test run! 🎉' :
                                      failedTests > 0 ? `${failedTests} test${failedTests > 1 ? 's' : ''} need${failedTests === 1 ? 's' : ''} attention` :
                                      'Run your tests to see results'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Test Results -->
        <div class="space-y-4">
            ${this.reports.map((report, index) => this.generateTestReportCard(report, index)).join('')}
        </div>
    </div>

    


    <script>
        function toggleCollapse(id) {
            const content = document.getElementById('content-' + id);
            const icon = document.getElementById('icon-' + id);
            
            if (content.classList.contains('expanded')) {
                content.classList.remove('expanded');
                icon.style.transform = 'rotate(0deg)';
            } else {
                content.classList.add('expanded');
                icon.style.transform = 'rotate(90deg)';
            }
        }
        
        // Alle Test-Cards sind standardmäßig zusammengeklappt
        // Kein automatisches Erweitern von fehlgeschlagenen Tests
    </script>
</body>
</html>`;
    }
    
    private static generateTestReportCard(report: TestReport, index: number): string {
        const statusIcon = report.status === 'PASSED' ? '✅' : '❌';
        const statusClass = report.status === 'PASSED' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50';
        const headerClass = report.status === 'PASSED' ? 'bg-green-100' : 'bg-red-100';
        
        return `
        <!-- Test Card ${index + 1} -->
        <div class="bg-white rounded-lg shadow-lg border-2 ${statusClass}" data-status="${report.status}" data-test-id="${index}">
            <!-- Test Header (Clickable) -->
            <div class="p-4 cursor-pointer hover:bg-gray-50 transition-colors ${headerClass}" onclick="toggleCollapse(${index})">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div class="text-2xl">${statusIcon}</div>
                        <div>
                            <h3 class="text-lg font-semibold text-gray-800">${report.testName}</h3>
                            <div class="text-sm text-gray-600">
                                <span class="inline-flex items-center mr-4">
                                    <span class="w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
                                    ${report.testSpec}
                                </span>
                                <span class="inline-flex items-center mr-4">
                                    <span class="w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
                                    ${report.environment}
                                </span>
                                <span class="inline-flex items-center">
                                    <span class="w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                                    ${report.totalSteps} Steps
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex items-center space-x-4">
                        <!-- Step Statistics -->
                        <div class="text-right text-sm">
                            <div class="text-green-600 font-semibold">✅ ${report.passedSteps}</div>
                            <div class="text-red-600 font-semibold">❌ ${report.failedSteps}</div>
                        </div>
                        
                        <!-- Collapse Icon -->
                        <div id="icon-${index}" class="text-gray-400 transition-transform duration-200">
                            ▶
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Collapsible Content -->
            <div id="content-${index}" class="collapsible-content">
                <div class="px-4 pb-4">
                    <!-- Test Timeline -->
                    <div class="bg-gray-50 rounded-lg p-3 mb-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span class="font-semibold text-gray-600">Start:</span>
                                <span class="text-gray-800">${report.startTime}</span>
                            </div>
                            <div>
                                <span class="font-semibold text-gray-600">End:</span>
                                <span class="text-gray-800">${report.endTime}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Steps -->
                    <div class="space-y-2">
                        <h4 class="font-semibold text-gray-700 mb-3">📋 Test Steps</h4>
                        ${report.steps.map(step => this.generateStepCard(step)).join('')}
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    private static generateStepCard(step: TestStep): string {
        const statusIcon = step.status === 'PASSED' ? '✅' : '❌';
        const statusClass = step.status === 'PASSED' ? 'border-l-green-400 bg-green-50' : 'border-l-red-400 bg-red-50';
        
        return `
        <div class="border-l-4 ${statusClass} p-3 rounded-r-lg">
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-3">
                    <div class="text-lg">${statusIcon}</div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center space-x-2 mb-1">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Step ${step.stepNumber}
                            </span>
                            <span class="text-sm text-gray-500">${step.timestamp}</span>
                        </div>
                        
                        <div class="text-sm">
                            <span class="font-semibold text-gray-700">${step.fileName}</span>
                            <span class="text-gray-500"> → </span>
                            <span class="font-medium text-gray-600">${step.methodName}</span>
                        </div>
                        
                        ${step.details ? `<div class="text-sm text-gray-600 mt-1">${step.details}</div>` : ''}
                        ${step.locator ? `<div class="text-xs text-gray-500 mt-1 font-mono bg-gray-100 p-1 rounded">Locator: ${step.locator}</div>` : ''}
                        ${step.url ? `<div class="text-xs text-blue-600 mt-1">🌐 ${step.url}</div>` : ''}
                        ${step.responseStatus ? `<div class="text-xs text-orange-600 mt-1">Status: ${step.responseStatus}</div>` : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    static clearReports(): void {
        this.reports = [];
    }
    
    static getReportsCount(): number {
        return this.reports.length;
    }
    
    static getReports(): TestReport[] {
        return [...this.reports];
    }
}
