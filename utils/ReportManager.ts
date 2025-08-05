import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { TestReport } from './HtmlReportGenerator';

/**
 * ReportManager - Verwaltet Test-Reports persistent zwischen verschiedenen Test-Runs
 */
export class ReportManager {
    private static readonly REPORT_FILE = join(process.cwd(), 'temp', 'test-reports.json');
    
    static addReport(report: TestReport): void {
        const reports = this.loadReports();
        reports.push(report);
        this.saveReports(reports);
    }
    
    static getReports(): TestReport[] {
        return this.loadReports();
    }
    
    static clearReports(): void {
        this.saveReports([]);
    }
    
    static getReportsCount(): number {
        return this.loadReports().length;
    }
    
    private static loadReports(): TestReport[] {
        try {
            if (!existsSync(this.REPORT_FILE)) {
                return [];
            }
            const data = readFileSync(this.REPORT_FILE, 'utf8');
            return JSON.parse(data) || [];
        } catch (error) {
            console.warn('⚠️ Could not load reports, starting with empty array');
            return [];
        }
    }
    
    private static saveReports(reports: TestReport[]): void {
        try {
            const dir = join(process.cwd(), 'temp');
            if (!existsSync(dir)) {
                mkdirSync(dir, { recursive: true });
            }
            writeFileSync(this.REPORT_FILE, JSON.stringify(reports, null, 2));
        } catch (error) {
            console.error('❌ Could not save reports:', error);
        }
    }
}
