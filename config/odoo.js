/**
 * 🔌 Cliente Odoo XML-RPC
 * Maneja la conexión y operaciones con Odoo
 */
const xmlrpc = require('xmlrpc');

class OdooClient {
  constructor(config = {}) {
    this.host = config.host || process.env.ODOO_HOST;
    this.database = config.database || process.env.ODOO_DATABASE;
    this.login = config.login || process.env.ODOO_LOGIN;
    this.password = config.password || process.env.ODOO_PASSWORD;
    this.port = config.port || 443;
    this.uid = null;
    this.authenticated = false;
    
    this.commonClient = xmlrpc.createSecureClient({
      host: this.host,
      port: this.port,
      path: '/xmlrpc/2/common'
    });
    this.objectClient = xmlrpc.createSecureClient({
      host: this.host,
      port: this.port,
      path: '/xmlrpc/2/object'
    });
  }

  async authenticate() {
    return new Promise((resolve, reject) => {
      this.commonClient.methodCall('authenticate',
        [this.database, this.login, this.password, {}],
        (error, uid) => {
          if (error || !uid) {
            reject(error || new Error('Autenticación fallida'));
            return;
          }
          this.uid = uid;
          this.authenticated = true;
          resolve(uid);
        }
      );
    });
  }

  async searchRead(model, domain = [], fields = [], options = {}) {
    if (!this.authenticated) throw new Error('No autenticado');
    return new Promise((resolve, reject) => {
      this.objectClient.methodCall('execute_kw', [
        this.database,
        this.uid,
        this.password,
        model,
        'search_read',
        [domain],
        {
          fields: fields.length > 0 ? fields : ['id', 'name'],
          limit: options.limit || 100,
          order: options.order || 'id desc',
          ...options
        }
      ], (error, result) => {
        if (error) reject(error);
        else resolve(result || []);
      });
    });
  }

  async read(model, id, fields = []) {
    if (!this.authenticated) throw new Error('No autenticado');
    return new Promise((resolve, reject) => {
      this.objectClient.methodCall('execute_kw',
        [this.database, this.uid, this.password, model, 'read', [[id]], 
          { fields: fields.length > 0 ? fields : [] }],
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(result && result.length > 0 ? result[0] : null);
        }
      );
    });
  }
}

module.exports = OdooClient;
