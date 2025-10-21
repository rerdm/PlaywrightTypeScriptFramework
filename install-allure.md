# Allure CLI Installation für Jenkins

## Option A: Automatic Installation (Empfohlen)
1. Jenkins Dashboard → Manage Jenkins → Tools
2. Scrollen zu "Allure Commandline"
3. Add Allure Commandline:
   - Name: `allure`
   - Install automatically: ✅
   - Version: 2.24.0 (oder neueste)

## Option B: Manual Installation
1. Download Allure von: https://github.com/allure-framework/allure2/releases
2. Entpacken nach: `C:\allure\allure-2.24.0`
3. Jenkins → Manage Jenkins → Tools → Allure Commandline
4. Add Allure Commandline:
   - Name: `allure`
   - Install automatically: ❌
   - ALLURE_HOME: `C:\allure\allure-2.24.0`

## Jenkins Pipeline Update (für später)
```groovy
allure([
    includeProperties: false,
    jdk: '',
    properties: [],
    reportBuildPolicy: 'ALWAYS',
    results: [[path: 'allure-results']],
    commandline: 'allure'  // Name aus Tools Konfiguration
])
```