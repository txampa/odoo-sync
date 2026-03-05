#!/usr/bin/env node

/**
 * 🧪 DEBUG - Ver estados de líneas de movimiento (move_lines)
 */

require('dotenv').config();
const OdooClient = require('./config/odoo');

async function debugMoveLines() {
  const odoo = new OdooClient();

  try {
    console.log('🔐 Autenticando...');
    await odoo.authenticate();
    console.log('✅ Autenticado\n');

    // Leer un albarán específico que tiene múltiples estados
    console.log('⏳ Leyendo albarán WH/PICK/134618...');
    const picking = await odoo.read(
      'stock.picking',
      1341658,  // Este es el ID del albarán de tu captura
      ['id', 'name', 'move_lines', 'origin']
    );

    if (!picking) {
      console.log('❌ Albarán no encontrado');
      process.exit(1);
    }

    console.log(`✅ Albarán: ${picking.name}\n`);

    // Leer las líneas de movimiento
    if (picking.move_lines && picking.move_lines.length > 0) {
      console.log(`⏳ Leyendo ${picking.move_lines.length} líneas de movimiento...\n`);
      
      const moveLines = await odoo.searchRead(
        'stock.move',
        [['id', 'in', picking.move_lines]],
        ['id', 'product_id', 'state', 'product_uom_qty', 'name'],
        { limit: 100 }
      );

      console.log('📊 LÍNEAS DE MOVIMIENTO (PRODUCTOS):\n');
      
      const states = {};
      moveLines.forEach((line, index) => {
        const state = line.state;
        const product = line.product_id[1] || line.name || 'Desconocido';
        const qty = line.product_uom_qty;

        if (!states[state]) {
          states[state] = [];
        }
        states[state].push({
          product: product,
          qty: qty,
          state: state
        });

        console.log(`${index + 1}. ${product}`);
        console.log(`   Cantidad: ${qty}`);
        console.log(`   Estado: ${state}`);
        console.log('');
      });

      console.log('\n🎯 ESTADOS ENCONTRADOS EN LAS LÍNEAS:\n');
      Object.keys(states).forEach(state => {
        console.log(`${state}: ${states[state].length} producto(s)`);
        states[state].forEach(p => {
          console.log(`  - ${p.product} (${p.qty})`);
        });
      });

    } else {
      console.log('No hay líneas de movimiento en este albarán');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugMoveLines();
