"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepLogger = void 0;
var HtmlReportGenerator_1 = require("./HtmlReportGenerator");
/**
 * StepLogger utility class for logging test steps with step counting
 * Provides methods to log method execution steps in a consistent format
 */
var StepLogger = /** @class */ (function () {
    function StepLogger() {
    }
    StepLogger.startTest = function (testName, environment, testSpec) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp;
            return __generator(this, function (_a) {
                // Counter zurücksetzen bei Test-Start
                this.passedStepsCount = 0;
                this.failedStepsCount = 0;
                this.testSteps = [];
                // Test-Report initialisieren
                this.currentTestReport = {
                    testName: testName,
                    testSpec: testSpec,
                    environment: environment,
                    startTime: new Date().toLocaleString('de-DE'),
                    endTime: '',
                    status: 'PASSED',
                    passedSteps: 0,
                    failedSteps: 0,
                    totalSteps: 0,
                    steps: []
                };
                timestamp = new Date().toLocaleString();
                console.log('═'.repeat(100));
                console.log(" Test START               :    [".concat(timestamp, "]"));
                console.log(" Environment              :    ".concat(environment));
                console.log(" Test Spec                :    ".concat(testSpec));
                console.log(" Test Name                :    ".concat(testName));
                console.log('═'.repeat(100));
                return [2 /*return*/];
            });
        });
    };
    StepLogger.logStepSuccess = function (fileName, methodName, testName, stepCount) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, step;
            return __generator(this, function (_a) {
                this.passedStepsCount++; // Counter erhöhen
                timestamp = new Date().toLocaleString();
                step = {
                    stepNumber: stepCount,
                    status: 'PASSED',
                    fileName: fileName,
                    methodName: methodName,
                    timestamp: timestamp,
                    details: "Successfully executed ".concat(methodName, " in ").concat(fileName)
                };
                this.testSteps.push(step);
                console.log("[".concat(timestamp, "] STEP ").concat(stepCount, " - PASSED - Filename: {").concat(fileName, "} Methodname: {").concat(methodName, "} Testname: {").concat(testName, "}"));
                return [2 /*return*/];
            });
        });
    };
    StepLogger.logStepFailed = function (fileName, methodName, testName, stepCount, locator) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, step;
            return __generator(this, function (_a) {
                this.failedStepsCount++; // Counter erhöhen
                timestamp = new Date().toLocaleString();
                step = {
                    stepNumber: stepCount,
                    status: 'FAILED',
                    fileName: fileName,
                    methodName: methodName,
                    timestamp: timestamp,
                    details: "Failed to execute ".concat(methodName, " in ").concat(fileName),
                    locator: locator.toString()
                };
                this.testSteps.push(step);
                console.log("[".concat(timestamp, "] STEP ").concat(stepCount, " - FAILED - Filename: {").concat(fileName, "} Methodname: {").concat(methodName, "} Testname: {").concat(testName, "} - locator not Found or not available: {").concat(locator, "}"));
                return [2 /*return*/];
            });
        });
    };
    StepLogger.logStepFailedToOpenUrl = function (fileName, methodName, testName, stepCount, URL, responseStatus) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, step;
            return __generator(this, function (_a) {
                this.failedStepsCount++; // Counter erhöhen
                timestamp = new Date().toLocaleString();
                step = {
                    stepNumber: stepCount,
                    status: 'FAILED',
                    fileName: fileName,
                    methodName: methodName,
                    timestamp: timestamp,
                    details: "Failed to open URL in ".concat(methodName),
                    url: URL.toString(),
                    responseStatus: responseStatus
                };
                this.testSteps.push(step);
                console.log("[".concat(timestamp, "] STEP ").concat(stepCount, " - FAILED - Filename: {").concat(fileName, "} Methodname: {").concat(methodName, "} Testname: {").concat(testName, "} URL: {").concat(URL, "} not reachable - Response Code: {").concat(responseStatus, "}"));
                return [2 /*return*/];
            });
        });
    };
    StepLogger.logStepPassedToOpenUrl = function (fileName, methodName, testName, stepCount, URL) {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, step;
            return __generator(this, function (_a) {
                this.passedStepsCount++; // Counter erhöhen
                timestamp = new Date().toLocaleString();
                step = {
                    stepNumber: stepCount,
                    status: 'PASSED',
                    fileName: fileName,
                    methodName: methodName,
                    timestamp: timestamp,
                    details: "Successfully opened URL in ".concat(methodName),
                    url: URL.toString()
                };
                this.testSteps.push(step);
                console.log("[".concat(timestamp, "] STEP ").concat(stepCount, " - PASSED - Filename: {").concat(fileName, "} Methodname: {").concat(methodName, "} Testname: {").concat(testName, "} URL: {").concat(URL, "}"));
                return [2 /*return*/];
            });
        });
    };
    StepLogger.testEnd = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timestamp, totalSteps, testPassed;
            return __generator(this, function (_a) {
                timestamp = new Date().toLocaleString();
                totalSteps = this.passedStepsCount + this.failedStepsCount;
                testPassed = this.failedStepsCount === 0;
                // Test-Report finalisieren
                if (this.currentTestReport) {
                    this.currentTestReport.endTime = timestamp;
                    this.currentTestReport.status = testPassed ? 'PASSED' : 'FAILED';
                    this.currentTestReport.passedSteps = this.passedStepsCount;
                    this.currentTestReport.failedSteps = this.failedStepsCount;
                    this.currentTestReport.totalSteps = totalSteps;
                    this.currentTestReport.steps = __spreadArray([], this.testSteps, true);
                    // Report zur Collection hinzufügen
                    HtmlReportGenerator_1.HtmlReportGenerator.addReport(this.currentTestReport);
                }
                console.log('═'.repeat(100));
                if (!testPassed) {
                    console.log("Result                    :    \u274C Test Failed");
                }
                else {
                    console.log("Result                    :    \u2705 Test Passed");
                }
                console.log("Test END                  :    [".concat(timestamp, "]"));
                console.log('─'.repeat(100));
                console.log('📊 STEP STATISTICS:');
                console.log("\u2705 Passed Steps           :    ".concat(this.passedStepsCount));
                console.log("\u274C Failed Steps           :    ".concat(this.failedStepsCount));
                console.log("\uD83D\uDCC8 Total Steps            :    ".concat(totalSteps));
                console.log('═'.repeat(100));
                return [2 /*return*/];
            });
        });
    };
    /**
     * Generiert den HTML Report für alle gesammelten Tests
     */
    StepLogger.generateHtmlReport = function () {
        HtmlReportGenerator_1.HtmlReportGenerator.generateHtmlReport('./test-reports');
        console.log('🎨 HTML Report wurde generiert!');
    };
    /**
     * Löscht alle gesammelten Report-Daten
     */
    StepLogger.clearReports = function () {
        HtmlReportGenerator_1.HtmlReportGenerator.clearReports();
        console.log('🗑️ Report-Daten wurden gelöscht');
    };
    // Counter für verschiedene Step-Typen
    StepLogger.passedStepsCount = 0;
    StepLogger.failedStepsCount = 0;
    StepLogger.urlPassedStepsCount = 0;
    StepLogger.urlFailedStepsCount = 0;
    // Report-Daten
    StepLogger.currentTestReport = null;
    StepLogger.testSteps = [];
    return StepLogger;
}());
exports.StepLogger = StepLogger;
