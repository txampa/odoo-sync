#!/usr/bin/env node

require('dotenv').config();
const xmlrpc = require('xmlrpc');

const ODOO_HOST = process.env.ODOO_HOST || 'erp.santafixie.com';
const DATABASE = process.env.ODOO_DATABASE || 'santafixie';
const LOGIN = process.env.ODOO_LOGIN;
const PASSWORD = process.env.ODOO_PASSWORD;
const PORT = process.env.ODOO_PORT || 443;

console.log('\n🔐 Conectando a Odoo v8...\n');
console.log('Host:', ODOO_HOST);
console.log('Base de datos:', DATABASE);
console.log('Usuario:', LOGIN);
console.log('');

// Cliente para autenticación
const commonClient = xmlrpc.createSecureClient({
  host: ODOO_HOST,
  port: PORT,
  path: '/xmlrpc/2/common'
});

// Cliente para operaciones con datos
const objectClient = xmlrpc.createSecureClient({
  host: ODOO_HOST,
  port: PORT,
  path: '/xmlrpc/2/object'
});

// PASO 1: Autenticar
console.log('⏳ PASO 1: Autenticando...');

commonClient.methodCall('authenticate', [DATABASE, LOGIN, PASSWORD, {}], (error, uid) => {
  if (error) {
    console.error('\n❌ Error de autenticación:', error.message);
    process.exit(1);
  }

  if (!uid) {
    console.error('\n❌ Credenciales inválidas');
    process.exit(1);
  }

  console.log('✅ ¡Autenticado!\n');
  console.log('UID (ID de usuario):', uid);
  console.log('');

  // PASO 2: Leer albaranes
  console.log('⏳ PASO 2: Leyendo albaranes (stock.picking)...\n');

  objectClient.methodCall('execute_kw', [
    DATABASE,
    uid,
    PASSWORD,
    'stock.picking',
    'search_read',
    [[]],  // Sin filtros = todos
    {
      'fields': ['id', 'name', 'state', 'date', 'partner_id'],
      'limit': 10,
      'order': 'date desc'
    }
  ], (error, pickings) => {
    if (error) {
      console.error('❌ Error al leer albaranes:', error.message);
      process.exit(1);
    }

    console.log(`✅ Albaranes encontrados: ${pickings.length}\n`);

    if (pickings.length > 0) {
      console.log('📋 Primeros 3 albaranes:\n');
      pickings.slice(0, 3).forEach((picking, index) => {
        console.log(`${index + 1}. ID: ${picking.id}`);
        console.log(`   Nombre: ${picking.name}`);
        console.log(`   Estado: ${picking.state}`);
        console.log(`   Fecha: ${picking.date}`);
        console.log(`   Cliente: ${picking.partner_id[1] || 'N/A'}`);
        console.log('');
      });
    }

    console.log('🎉 ¡CONEXIÓN EXITOSA!\n');
    console.log('Próximos pasos:');
    console.log('  1. Configura Google Sheets API');
    console.log('  2. Crea la lógica de sincronización');
    console.log('  3. Deploy en Railway.app\n');

    process.exit(0);
  });
});
