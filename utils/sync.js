/**
 * 🔄 Sincronización Odoo → Google Sheets
 * Lógica principal de lectura, filtrado y escritura
 */

const OdooClient = require('../config/odoo');
const SheetsClient = require('./sheets');

class SyncManager {
  constructor() {
    this.odoo = new OdooClient();
    this.sheets = new SheetsClient();
  }

  /**
   * Ejecutar sincronización completa
   */
  async sync() {
    try {
      console.log('\n' + '='.repeat(60));
      console.log('🔄 INICIANDO SINCRONIZACIÓN');
      console.log('='.repeat(60) + '\n');

      // Paso 1: Autenticar con Odoo y Google Sheets
      console.log('⏳ Autenticando con servicios...');
      await this.odoo.authenticate();
      await this.sheets.authenticate();
      console.log('✅ Autenticación exitosa\n');

      // Paso 2: Obtener la última fecha registrada
      console.log('⏳ Obteniendo última fecha registrada...');
      const lastDate = await this.sheets.getLastPickingDate();
      console.log();

      // Paso 3: Construir dominio de búsqueda dinámicamente
      const domain = [['state', 'in', ['waiting', 'confirmed']]];
      if (lastDate) {
        domain.push(['date', '>=', lastDate]);
      }

      // Paso 4: Leer albaranes de Odoo
      console.log('⏳ Leyendo albaranes de Odoo con estado "Esperando Disponibilidad"...');
      const pickings = await this.odoo.searchRead(
        'stock.picking',
        domain,
        ['id', 'name', 'state', 'date', 'move_lines', 'origin'],
        { limit: 1000, order: 'date asc' }
      );
      console.log(`   📦 Albaranes encontrados: ${pickings.length}\n`);

      // Paso 5: Procesar albaranes
      console.log('⏳ Procesando albaranes...');
      const rowsToAdd = [];

      for (const picking of pickings) {
        const pedidoId = picking.name;
        
        console.log(`   📍 Procesando: ${pedidoId}`);
        
        try {
          // Obtener detalles del albarán
          const pickingDetails = await this.odoo.read(
            'stock.picking',
            picking.id,
            ['id', 'name', 'date', 'move_lines', 'origin']
          );

          if (!pickingDetails || !pickingDetails.move_lines) {
            continue;
          }

          // Leer las líneas de movimiento
          const moveLines = await this.odoo.searchRead(
            'stock.move',
            [['id', 'in', pickingDetails.move_lines]],
            ['id', 'product_id', 'state', 'product_uom_qty', 'name']
          );

          // Filtrar solo líneas en estado "confirmed" (Esperando disponibilidad)
          const waitingLines = moveLines.filter(line => line.state === 'confirmed');

          if (waitingLines.length === 0) {
            console.log(`      ⏭️  Sin líneas en estado 'waiting'`);
            continue;
          }

          // Extraer grupo de abastecimiento del origen
          let grupoAbastecimiento = '';
          if (pickingDetails.origin) {
            const parts = pickingDetails.origin.split(':');
            grupoAbastecimiento = parts[0].trim();
          }

          // Procesar cada línea
          for (const line of waitingLines) {
            const fecha = pickingDetails.date ? pickingDetails.date.split(' ')[0] : '';
            let producto = line.product_id[1] || line.name || 'Desconocido';
            
            // Limpiar nombre del producto (remover código entre corchetes)
            producto = producto.replace(/^\s*\[.*?\]\s*/, '').trim();
            
            const cantidad = line.product_uom_qty || 0;

            const row = [
              fecha,
              grupoAbastecimiento,
              producto,
              cantidad
            ];

            rowsToAdd.push(row);
            console.log(`      ✅ ${fecha} | ${grupoAbastecimiento} | ${producto} | ${cantidad}`);
          }

        } catch (error) {
          console.error(`   ❌ Error procesando ${pedidoId}:`, error.message);
          continue;
        }
      }

      // Paso 6: Escribir en Google Sheets
      if (rowsToAdd.length > 0) {
        console.log(`\n⏳ Escribiendo ${rowsToAdd.length} filas en Google Sheets...\n`);
        await this.sheets.appendRows(rowsToAdd);
        console.log(`✅ Sincronización completada: ${rowsToAdd.length} nuevos registros\n`);
      } else {
        console.log('\n✅ Sin registros nuevos para sincronizar\n');
      }

      console.log('='.repeat(60));
      console.log('✅ SINCRONIZACIÓN EXITOSA');
      console.log('='.repeat(60) + '\n');

      return {
        success: true,
        rowsAdded: rowsToAdd.length,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('\n❌ ERROR EN SINCRONIZACIÓN:', error.message);
      console.log('='.repeat(60) + '\n');
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = SyncManager;
