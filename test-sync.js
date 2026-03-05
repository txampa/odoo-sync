#!/usr/bin/env node

/**
 * 🧪 TEST DE SINCRONIZACIÓN COMPLETA
 * Prueba Odoo + Google Sheets
 */

require('dotenv').config();
const SyncManager = require('./utils/sync');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║   🧪 TEST DE SINCRONIZACIÓN ODOO → GOOGLE SHEETS              ║
╚════════════════════════════════════════════════════════════════╝
`);

async function testSync() {
  const syncManager = new SyncManager();
  
  try {
    const result = await syncManager.sync();
    
    if (result.success) {
      console.log(`\n✅ TEST EXITOSO`);
      console.log(`   Registros sincronizados: ${result.rowsAdded}`);
      console.log(`   Timestamp: ${result.timestamp}`);
    } else {
      console.log(`\n❌ TEST FALLIDO`);
      console.log(`   Error: ${result.error}`);
    }
    
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Error en el test:', error.message);
    process.exit(1);
  }
}

testSync();
