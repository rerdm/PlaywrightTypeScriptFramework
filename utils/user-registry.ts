import * as fs from 'fs';
import * as path from 'path';

interface UserData {
  creationDate: string;
  username: string;
  password: string;
  environment: string;
}

class UserRegistry {
  private registryDirectory: string;
  private filePath: string;

  constructor() {
    this.registryDirectory = path.join(__dirname, 'registered-users');
    this.filePath = path.join(this.registryDirectory, 'registered-users.csv');
    
    // Erstelle Verzeichnis falls es nicht existiert
    if (!fs.existsSync(this.registryDirectory)) {
      fs.mkdirSync(this.registryDirectory, { recursive: true });
    }
    
    // Erstelle CSV-Datei mit Header falls sie nicht existiert
    this.initializeCsvFile();
  }

  /**
   * Initialisiert die CSV-Datei mit Header-Zeile
   */
  private initializeCsvFile(): void {
    if (!fs.existsSync(this.filePath)) {
      const header = 'Erstellungsdatum,Username,Passwort,Environment\n';
      fs.writeFileSync(this.filePath, header, 'utf8');
      console.log(`📄 CSV file created: ${this.filePath}`);
    }
  }

  /**
   * Generiert aktuelles Datum im Format YYYY-MM-DD
   */
  private getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Extrahiert Environment aus BASE_URL
   */
  private getEnvironmentFromBaseUrl(baseUrl: string): string {
    if (!baseUrl) {
      return 'unknown';
    }
    
    // Verschiedene URL-Patterns erkennen
    if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1') || baseUrl.includes('10.40.226.38')) {
      return 'local';
    } else if (baseUrl.includes('.github.io')) {
      return 'staging';
    } else {
      return 'other';
    }
  }

  /**
   * Escapes CSV-Werte für sichere Speicherung
   */
  private escapeCsvValue(value: string): string {
    // Wenn der Wert Kommas, Anführungszeichen oder Zeilenwechsel enthält, in Anführungszeichen setzen
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
      // Anführungszeichen im Wert verdoppeln
      const escapedValue = value.replace(/"/g, '""');
      return `"${escapedValue}"`;
    }
    return value;
  }

  /**
   * Fügt einen neuen Benutzer zur Registry hinzu
   */
  public addUser(username: string, password: string, baseUrl?: string): void {
    try {
      const userData: UserData = {
        creationDate: this.getCurrentDate(),
        username: username,
        password: password,
        environment: this.getEnvironmentFromBaseUrl(baseUrl || process.env.BASE_URL || '')
      };

      // CSV-Zeile erstellen
      const csvLine = [
        this.escapeCsvValue(userData.creationDate),
        this.escapeCsvValue(userData.username),
        this.escapeCsvValue(userData.password),
        this.escapeCsvValue(userData.environment)
      ].join(',') + '\n';

      // An CSV-Datei anhängen
      fs.appendFileSync(this.filePath, csvLine, 'utf8');

      console.log(`✅ User registered successfully:`);
      console.log(`   📅 Date: ${userData.creationDate}`);
      console.log(`   👤 Username: ${userData.username}`);
      console.log(`   🔒 Password: ${userData.password}`);
      console.log(`   🌍 Environment: ${userData.environment}`);
      console.log(`   📂 File: ${this.filePath}`);

    } catch (error) {
      console.error('❌ Error registering user:', error instanceof Error ? error.message : String(error));
      throw new Error(`Failed to register user: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Liest alle registrierten Benutzer
   */
  public getAllUsers(): UserData[] {
    try {
      if (!fs.existsSync(this.filePath)) {
        return [];
      }

      const csvContent = fs.readFileSync(this.filePath, 'utf8');
      const lines = csvContent.split('\n').filter(line => line.trim() !== '');
      
      // Skip header line
      const dataLines = lines.slice(1);
      
      const users: UserData[] = [];
      for (const line of dataLines) {
        const [creationDate, username, password, environment] = line.split(',');
        users.push({
          creationDate: creationDate.replace(/"/g, ''),
          username: username.replace(/"/g, ''),
          password: password.replace(/"/g, ''),
          environment: environment.replace(/"/g, '')
        });
      }

      return users;
    } catch (error) {
      console.error('❌ Error reading users:', error instanceof Error ? error.message : String(error));
      return [];
    }
  }

  /**
   * Zeigt Statistiken der registrierten Benutzer
   */
  public showStatistics(): void {
    const users = this.getAllUsers();
    
    console.log('\n📊 User Registry Statistics:');
    console.log(`📁 File: ${this.filePath}`);
    console.log(`👥 Total Users: ${users.length}`);
    
    // Environment-Statistiken
    const envStats: Record<string, number> = {};
    users.forEach(user => {
      envStats[user.environment] = (envStats[user.environment] || 0) + 1;
    });
    
    console.log('🌍 Users by Environment:');
    Object.entries(envStats).forEach(([env, count]) => {
      console.log(`   ${env}: ${count} users`);
    });
    
    // Letzte Registrierungen
    const recentUsers = users.slice(-3);
    if (recentUsers.length > 0) {
      console.log('📅 Recent Registrations:');
      recentUsers.forEach(user => {
        console.log(`   ${user.creationDate} - ${user.username} (${user.environment})`);
      });
    }
  }

  /**
   * Konvertiert CSV zu Excel (falls xlsx Bibliothek verfügbar ist)
   */
  public async convertToExcel(): Promise<void> {
    try {
      // Versuche xlsx zu importieren
      const xlsx = await import('xlsx');
      
      const users = this.getAllUsers();
      
      // Workbook erstellen
      const workbook = xlsx.utils.book_new();
      
      // Daten für Excel vorbereiten
      const excelData = [
        ['Erstellungsdatum', 'Username', 'Passwort', 'Environment'], // Header
        ...users.map(user => [user.creationDate, user.username, user.password, user.environment])
      ];
      
      // Worksheet erstellen
      const worksheet = xlsx.utils.aoa_to_sheet(excelData);
      
      // Worksheet zum Workbook hinzufügen
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Registered Users');
      
      // Excel-Datei speichern
      const excelPath = path.join(this.registryDirectory, 'registered-users.xlsx');
      xlsx.writeFile(workbook, excelPath);
      
      console.log(`📊 Excel file created: ${excelPath}`);
      
    } catch (error) {
      console.warn('⚠️ Excel conversion not available. Install xlsx package for Excel support.');
      console.log('   Run: npm install xlsx @types/node');
    }
  }
}

// Singleton-Export für einfache Verwendung
export const userRegistry = new UserRegistry();
export default UserRegistry;
