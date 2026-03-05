# 🔄 Guía de Sincronización

## ✅ Lo que está hecho

- ✅ Conexión a Odoo v8 (test-odoo.js)
- ✅ Autenticación con Google Sheets API
- ✅ Lógica de lectura de albaranes
- ✅ Filtrado de productos en estado "waiting"
- ✅ Deduplicación de registros
- ✅ Escritura en Google Sheets

---

## 🚀 PASO 1: Instalar Dependencias Nuevas

La primera vez, instala todas las dependencias:

```bash
npm install
```

Esto incluye `googleapis` que es necesario para Google Sheets.

---

## 🧪 PASO 2: Probar la Sincronización

Ejecuta el test de sincronización completo:

```bash
node test-sync.js
```

**Resultado esperado:**

```
╔════════════════════════════════════════════════════════════════╗
║   🧪 TEST DE SINCRONIZACIÓN ODOO → GOOGLE SHEETS              ║
╚════════════════════════════════════════════════════════════════╝

⏳ Autenticando con servicios...
✅ Google Sheets autenticado
   📋 Pedidos ya registrados: 0

⏳ Leyendo albaranes de Odoo...
   📦 Albaranes encontrados: 10

⏳ Procesando albaranes...
   📍 Procesando albarán: WH/OUT/259023
      ✅ Agregado: 2026-03-04 | WH/OUT/259023 | Producto X | 5

✅ Sincronización completada: 1 nuevos registros

✅ TEST EXITOSO
   Registros sincronizados: 1
   Timestamp: 2026-03-04T...
```

---

## 🔄 PASO 3: Ejecutar en Modo Producción (Scheduler)

Para que se ejecute **automáticamente cada hora entre 6am-3pm**:

```bash
npm start
```

O:

```bash
node index.js
```

Esto mantendrá el proceso corriendo y se ejecutará:
- **6:00 AM** ✅
- **7:00 AM** ✅
- **8:00 AM** ✅
- ... cada hora ...
- **3:00 PM** ✅

---

## 🧪 Para Testing: Ejecutar Ahora

Si quieres que se ejecute INMEDIATAMENTE sin esperar a la siguiente hora:

1. Abre `index.js`
2. Al final, descomenta la línea:
   ```javascript
   // runSync();
   ```
   Cámbiala a:
   ```javascript
   runSync();
   ```
3. Ejecuta:
   ```bash
   node index.js
   ```
4. Se ejecutará una vez y luego seguirá con el scheduler

---

## 📊 ¿Qué Hace la Sincronización?

1. **Lee albaranes** de Odoo con estado = "waiting"
2. **Filtra productos** que estén en estado "waiting" (dentro del albarán)
3. **Extrae datos:**
   - Fecha
   - Número de pedido (WH/OUT/259023)
   - Producto
   - Cantidad
4. **Extrae "Grupo de abastecimiento"** del campo "Documento origen" (solo la primera parte antes de ":")
5. **Evita duplicados** - No repite pedidos que ya están en el Sheet
6. **Escribe en Google Sheets** - Las 4 columnas solicitadas

---

## 📋 Estructura del Google Sheet

Las filas se escriben así:

```
| FECHA | PEDIDO | PRODUCTO | CANTIDAD |
|-------|--------|----------|----------|
| 2026-03-04 | WH/OUT/259023 | Producto X | 5 |
| 2026-03-04 | WH/OUT/259022 | Producto Y | 10 |
```

---

## ❓ Troubleshooting

### Error: `credentials.json not found`
→ Asegúrate que el archivo esté en la carpeta `odoo-sync`

### Error: `Permission denied`
→ Comparte el Google Sheet con el email de la service account:
   `odoo-sync@hoja-pedidos-489219.iam.gserviceaccount.com`

### No se escriben datos
→ Ejecuta `node test-sync.js` para ver detalles del error

### Quiero cambiar el horario
→ Edita `index.js` línea del schedule:
```javascript
const task = cron.schedule('0 6-15 * * *', async () => {
```

Formatos cron:
- `'0 8-17 * * *'` = 8am a 5pm
- `'30 6-15 * * *'` = A las :30 de cada hora
- `'0,30 6-15 * * *'` = Cada 30 minutos entre 6am-3pm

---

## ✅ Checklist

- [ ] `npm install` ejecutado sin errores
- [ ] `node test-odoo.js` funciona ✅
- [ ] `node test-sync.js` escribe datos en Google Sheets
- [ ] El Google Sheet tiene datos nuevos
- [ ] `npm start` se ejecuta sin errores

---

**¿Todo funciona? ¡Listo para deploy en Railway!** 🚀
