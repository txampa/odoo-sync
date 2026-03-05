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
    // 1. Leer toda la columna A para encontrar la ÚLTIMA fila real (sin contar filtros)
    const allData = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: `${this.sheetName}!A:A`
    });

    // 2. Calcular la siguiente fila vacía (última real + 1)
    const values = allData.data.values || [];
    const lastRow = values.length; // Próxima fila donde escribir
    
    // 3. Escribir exactamente en esa posición, ignorando filtros
    const range = `${this.sheetName}!A${lastRow + 1}:F${lastRow + rows.length}`;
    
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: 'RAW',
      resource: {
        values: rows
      }
    });

    console.log(`✅ ${rows.length} filas escritas en Google Sheets (Fila ${lastRow + 1})`);
    return true;
  } catch (error) {
    console.error('❌ Error escribiendo en Google Sheets:', error.message);
    return false;
  }
}

  /**
   * Obtener el último pedido/grupo de abastecimiento registrado
   */
  async getLastPedido() {
    try {
      const range = `${this.sheetName}!B:B`;
      const data = await this.readData(range);
      
      if (data.length <= 1) {
        console.log('📅 La hoja está vacía, sincronizando desde el inicio');
        return null;
      }

      // Buscar la última fila con datos (ignorar celdas vacías)
      let lastPedido = null;
      for (let i = data.length - 1; i >= 1; i--) {
        if (data[i] && data[i][0]) {
          lastPedido = data[i][0].toString();
          break;
        }
      }

      if (lastPedido) {
        console.log(`📋 Último grupo registrado en Google Sheets: ${lastPedido}`);
      }
      
      return lastPedido;
    } catch (error) {
      console.error('❌ Error obteniendo último pedido:', error.message);
      return null;
    }
  }

  /**
   * Obtener todos los pedidos ya registrados (para evitar duplicados)
   */
  async getExistingPedidos() {
    try {
      const range = `${this.sheetName}!B:B`;
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
}

module.exports = SheetsClient;
