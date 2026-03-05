/**
 * 📊 Cliente Google Sheets
 * Lee y escribe en Google Sheets usando la API v4
 */
const { google } = require('googleapis');

class SheetsClient {
  constructor() {
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    this.sheetName = process.env.GOOGLE_SHEET_NAME || 'Hoja1';
    this.auth = null;
    this.sheets = null;
    
    console.log(`📊 Configurado para hoja: "${this.sheetName}"`);
  }

  /**
   * Autenticar con Google Sheets API usando credenciales de variable de entorno
   */
  async authenticate() {
    try {
      if (!process.env.GOOGLE_CREDENTIALS) {
        throw new Error('❌ Variable GOOGLE_CREDENTIALS no definida en Railway');
      }

      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);

      this.auth = new google.auth.GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
      });

      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
      console.log('✅ Google Sheets autenticado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error autenticando Google Sheets:', error.message);
      throw error;
    }
  }

  /**
   * Leer datos del sheet
   */
  async readData(range = null) {
    try {
      if (!range) {
        range = `${this.sheetName}!A:F`;
      }

      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range
      });

      return response.data.values || [];
    } catch (error) {
      console.error('❌ Error leyendo Google Sheets:', error.message);
      return [];
    }
  }

  /**
   * Escribir múltiples filas
   */
async appendRows(rows) {
  try {
    // Construir el rango sin comillas adicionales si la hoja tiene espacios
    const range = `${this.sheetName}!A:F`;
    
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: 'RAW',
      resource: {
        values: rows
      }
    });

    console.log(`✅ ${rows.length} filas escritas en Google Sheets`);
    return true;
  } catch (error) {
    console.error('❌ Error escribiendo en Google Sheets:', error.message);
    return false;
  }
}

  /**
   * Obtener la última fecha de picking registrada
   */
  async getLastPickingDate() {
    try {
      const range = `${this.sheetName}!A:A`;
      const data = await this.readData(range);
      
      if (data.length <= 1) {
        console.log('📅 La hoja está vacía, sincronizando desde el inicio');
        return null;
      }

      // Buscar la última fila con datos (ignorar celdas vacías)
      let lastDate = null;
      for (let i = data.length - 1; i >= 1; i--) {
        if (data[i] && data[i][0]) {
          lastDate = data[i][0];
          break;
        }
      }

      if (lastDate) {
        console.log(`📅 Última fecha registrada en Google Sheets: ${lastDate}`);
      }
      
      return lastDate;
    } catch (error) {
      console.error('❌ Error obteniendo última fecha:', error.message);
      return null;
    }
  }

  /**
   * Obtener todos los pedidos ya registrados (para evitar duplicados)
   */
  async getExistingPedidos() {
    try {
      const range = `'${this.sheetName}'!B:B`;
      const data = await this.readData(range);
      
      if (data.length <= 1) {
        return new Set();
      }

      const pedidos = new Set();
      data.slice(1).forEach(row => {
        if (row && row[0]) {
          pedidos.add(row[0].toString());
        }
      });

      return pedidos;
    } catch (error) {
      console.error('❌ Error leyendo pedidos existentes:', error.message);
      return new Set();
    }
  }
}

module.exports = SheetsClient;
