#!/usr/bin/env node

/**
 * 🧪 DEBUG - Ver todos los estados de albaranes
 */

require('dotenv').config();
const OdooClient = require('./config/odoo');

async function debugStates() {
  const odoo = new OdooClient();

  try {
    console.log('🔐 Autenticando...');
    await odoo.authenticate();
    console.log('✅ Autenticado\n');

    console.log('⏳ Leyendo TODOS los albaranes (sin filtro)...');
    const pickings = await odoo.searchRead(
      'stock.picking',
      [],  // SIN FILTRO - TODOS
      ['id', 'name', 'state', 'date'],
      { limit: 50, order: 'date desc' }
    );

    console.log(`✅ Albaranes encontrados: ${pickings.length}\n`);

    // Contar estados únicos
    const states = {};
    pickings.forEach(picking => {
      const state = picking.state;
      if (!states[state]) {
        states[state] = [];
      }
      states[state].push({
        name: picking.name,
        date: picking.date,
        state: picking.state
      });
    });

    console.log('📊 ESTADOS ENCONTRADOS:\n');
    Object.keys(states).forEach(state => {
      console.log(`\n${state} (${states[state].length} albaranes):`);
      states[state].slice(0, 3).forEach(p => {
        console.log(`  - ${p.name} (${p.date})`);
      });
      if (states[state].length > 3) {
        console.log(`  ... y ${states[state].length - 3} más`);
      }
    });

    console.log('\n\n🎯 CONCLUSIÓN:');
    console.log('Los estados que encontré son:');
    Object.keys(states).forEach(state => {
      console.log(`  ✅ '${state}'`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

debugStates();
