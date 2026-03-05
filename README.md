# 🚀 Sincronizador Odoo → Google Sheets

Sincroniza automáticamente pedidos de Odoo en estado **"Esperando Disponibilidad"** a una hoja de Google Sheets cada 10 minutos.

## ✨ Características

- ✅ **Sincronización automática** cada 10 minutos
- ✅ **Filtrado por fecha** - Solo sincroniza desde la última fecha registrada
- ✅ **Deduplicación automática** - Evita registros duplicados
- ✅ **Variable de entorno para nombre de hoja** - Cambia dinámicamente el mes/nombre
- ✅ **Logging detallado** de cada operación

## 📋 Requisitos

- Node.js 18+
- Cuenta de Google Cloud con Service Account
- Acceso a Odoo con credenciales XML-RPC
- Spreadsheet en Google Sheets

## 🔧 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/txampa/odoo-sync.git
cd odoo-sync

# Instalar dependencias
npm install

# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales
nano .env

# Ejecutar
npm start
```

## 🚀 Deployment en Railway

1. Conecta tu GitHub a Railway
2. Selecciona el repositorio `odoo-sync`
3. En **Variables**, añade:
   - `ODOO_HOST`
   - `ODOO_DATABASE`
   - `ODOO_LOGIN`
   - `ODOO_PASSWORD`
   - `GOOGLE_SHEETS_ID`
   - `GOOGLE_SHEET_NAME` (ej: "Pedidos Marzo 2026")
   - `GOOGLE_CREDENTIALS` (JSON completo como una línea)

## 📊 Estructura de Google Sheets

La hoja debe tener estas columnas:

| A | B | C | D |
|---|---|---|---|
| FECHA | PEDIDO | PRODUCTO | CANTIDAD |
| 2026-03-04 | 3000115640 | Plato Origi8... | 1 |

## 🔐 Variables de Entorno

```env
# Odoo
ODOO_HOST=erp.ejemplo.com
ODOO_DATABASE=nombre_bd
ODOO_LOGIN=usuario@email.com
ODOO_PASSWORD=contraseña

# Google Sheets
GOOGLE_SHEETS_ID=id_del_spreadsheet
GOOGLE_SHEET_NAME=Nombre de la Hoja
GOOGLE_CREDENTIALS={"type":"service_account",...}
```

## 📝 Logs

Los logs se muestran en consola cada 10 minutos:

```
⏰ [03/05/2026, 09:30:00] Ejecutando sincronización...
============================================================
🔄 INICIANDO SINCRONIZACIÓN
============================================================
✅ Autenticación exitosa
📋 Última fecha: 2026-03-04
📦 Albaranes encontrados: 5
✅ 12 filas escritas en Google Sheets
```

## 🐛 Troubleshooting

**Error: "Unable to parse range"**
- Verifica que el nombre de la hoja en `GOOGLE_SHEET_NAME` es exacto
- Si tiene espacios, se maneja automáticamente con comillas simples

**Error: "Autenticación fallida"**
- Verifica las credenciales de Odoo
- Asegúrate de que el host es accesible

**Google Sheets no se actualiza**
- Verifica que `GOOGLE_SHEETS_ID` es correcto
- Comprueba que la Service Account tiene permisos en el Spreadsheet

## 📧 Contacto

Para reportar problemas o sugerencias, abre un issue en GitHub.
