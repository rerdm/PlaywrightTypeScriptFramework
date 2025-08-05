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
Object.defineProperty(exports, "__esModule", { value: true });
var StepLogger_1 = require("../utils/StepLogger");
/**
 * Beispiel für die Verwendung des HTML Report Generators
 * Dieses Script kann nach den Tests ausgeführt werden, um einen HTML Report zu generieren
 */
function generateSampleReport() {
    return __awaiter(this, void 0, void 0, function () {
        var mockLocator;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🎨 Generating Sample HTML Report...');
                    // Beispiel Test 1 - Erfolgreich
                    return [4 /*yield*/, StepLogger_1.StepLogger.startTest('Login Test - Valid Credentials', 'Production', 'login.spec.ts')];
                case 1:
                    // Beispiel Test 1 - Erfolgreich
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepPassedToOpenUrl('StartPage.ts', 'openUrl', 'Login Test', 1, 'http://example.com')];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepSuccess('LoginPage.ts', 'enterUsername', 'Login Test', 2)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepSuccess('LoginPage.ts', 'enterPassword', 'Login Test', 3)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepSuccess('LoginPage.ts', 'clickSubmit', 'Login Test', 4)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepSuccess('HomePage.ts', 'verifyWelcomeMessage', 'Login Test', 5)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.testEnd()];
                case 7:
                    _a.sent();
                    // Beispiel Test 2 - Fehlgeschlagen
                    return [4 /*yield*/, StepLogger_1.StepLogger.startTest('Login Test - Invalid Credentials', 'Production', 'login.spec.ts')];
                case 8:
                    // Beispiel Test 2 - Fehlgeschlagen
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepPassedToOpenUrl('StartPage.ts', 'openUrl', 'Login Test Invalid', 1, 'http://example.com')];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepSuccess('LoginPage.ts', 'enterUsername', 'Login Test Invalid', 2)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepSuccess('LoginPage.ts', 'enterPassword', 'Login Test Invalid', 3)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepSuccess('LoginPage.ts', 'clickSubmit', 'Login Test Invalid', 4)];
                case 12:
                    _a.sent();
                    mockLocator = { toString: function () { return "//div[@id='error-message']"; } };
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepFailed('HomePage.ts', 'verifyWelcomeMessage', 'Login Test Invalid', 5, mockLocator)];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.testEnd()];
                case 14:
                    _a.sent();
                    // Beispiel Test 3 - URL Fehler
                    return [4 /*yield*/, StepLogger_1.StepLogger.startTest('Navigation Test - Broken URL', 'Staging', 'navigation.spec.ts')];
                case 15:
                    // Beispiel Test 3 - URL Fehler
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.logStepFailedToOpenUrl('StartPage.ts', 'openUrl', 'Navigation Test', 1, 'http://broken-url.com', 404)];
                case 16:
                    _a.sent();
                    return [4 /*yield*/, StepLogger_1.StepLogger.testEnd()];
                case 17:
                    _a.sent();
                    // HTML Report generieren
                    StepLogger_1.StepLogger.generateHtmlReport();
                    console.log('✅ Sample HTML Report generated successfully!');
                    console.log('📁 Check the ./test-reports folder for the HTML file');
                    return [2 /*return*/];
            }
        });
    });
}
// Script ausführen
generateSampleReport().catch(console.error);
