/**
 * 🚀 Sincronizador Odoo → Google Sheets
 * Ejecuta sincronización cada 10 minutos
 */

const cron = require('node-cron');
const SyncManager = require('./utils/sync');

console.log('🚀 Iniciando servidor de sincronización...\n');

const syncManager = new SyncManager();

// Ejecutar sincronización cada 10 minutos
const task = cron.schedule('*/15 6-22 * * *', async () => {
  console.log(`\n⏰ [${new Date().toLocaleString()}] Ejecutando sincronización...`);
  await syncManager.sync();
});

// También ejecutar al iniciar
(async () => {
  console.log('⏰ Ejecutando sincronización inicial...\n');
  await syncManager.sync();
})();

// Mantener el proceso activo
process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo servidor...');
  task.stop();
  process.exit(0);
});

console.log('✅ Servidor iniciado. Sincronización programada cada 10 minutos.\n');
