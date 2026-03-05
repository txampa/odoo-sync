# 📅 Cambiar la Hoja del Google Sheet Cada Mes

Cuando crees una **nueva hoja cada mes**, necesitas actualizar el nombre en el código.

---

## 🔄 Pasos para Cambiar la Hoja

### 1️⃣ Crear la Nueva Hoja en Google Sheets

```
Google Sheet actual:
├─ Marzo 2026      (antigua)
└─ Abril 2026      (nueva) ← Creas esta
```

1. Ve a tu Google Sheet
2. Haz clic en **"+"** (abajo a la izquierda)
3. Crea una hoja nueva
4. **Ponle un nombre** (ej: "Abril 2026")
5. Agrega los encabezados:
   ```
   | FECHA | PEDIDO | PRODUCTO | CANTIDAD |
   ```

---

### 2️⃣ Actualizar el Archivo `.env`

Abre la carpeta `odoo-sync` en tu computadora y edita el archivo `.env`:

```env
ODOO_HOST=erp.santafixie.com
ODOO_DATABASE=santafixie_db
ODOO_LOGIN=txampaback@gmail.com
ODOO_PASSWORD==)rZipeCqY50Q19+h3
ODOO_PORT=443

GOOGLE_SHEETS_ID=1wDiEtax6KnNCFPrm6HVx103eeeOAt6yWFCUkMWgwy3E
GOOGLE_SHEET_NAME=Abril 2026          ← CAMBIA ESTO AL NOMBRE NUEVO
                   ^^^^^^^^^^^
                   Nombre exacto de la hoja

HOURS_START=6
HOURS_END=15
```

**Cambios:**
- ❌ `GOOGLE_SHEET_NAME=Marzo 2026` (vieja)
- ✅ `GOOGLE_SHEET_NAME=Abril 2026` (nueva)

---

### 3️⃣ Guarda y Listo

¡Eso es! Cuando se ejecute la sincronización, escribirá en la hoja nueva automáticamente.

---

## ⚠️ Importante

El nombre de la hoja debe ser **exactamente igual** al que ves en Google Sheets.

**Ejemplos válidos:**
- ✅ `Marzo 2026`
- ✅ `Abril 2026`
- ✅ `marzo`
- ✅ `Hoja1`
- ❌ `Marzo 2026 ` (con espacio al final - no funciona)
- ❌ `MARZO 2026` (si la escribiste diferente)

---

## 🔍 Verificar Que Funciona

Después de cambiar:

1. Ejecuta el test:
   ```bash
   node test-sync.js
   ```

2. Debería mostrar:
   ```
   📊 Usando hoja: "Abril 2026"
   ```

3. Si ves ese mensaje, **está escribiendo en la hoja correcta** ✅

---

## 📅 Resumen

| Acción | Cuándo | Qué Hacer |
|--------|--------|-----------|
| Fin del mes | Cada 30 días | Crear nueva hoja en Google Sheets |
| Actualizar código | Después de crear la hoja | Cambiar `GOOGLE_SHEET_NAME` en `.env` |
| Reiniciar | Para que aplique | `npm start` (o dejar corriendo) |

---

## 🎯 Ejemplo Real

**Mes 1 (Marzo):**
```env
GOOGLE_SHEET_NAME=Marzo 2026
```
✅ Escribe en "Marzo 2026"

**Mes 2 (Abril):**
1. Creas hoja nueva "Abril 2026" en Google Sheets
2. Cambias en `.env`:
```env
GOOGLE_SHEET_NAME=Abril 2026
```
✅ Escribe en "Abril 2026"

---

**¡Listo! Así no necesitas cambiar el código, solo el nombre en `.env`** 🚀
