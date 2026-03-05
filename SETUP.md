# 🚀 SETUP - Guía de Instalación

## 📋 Requisitos

- **Node.js 14+** - [Descargar aquí](https://nodejs.org/)
- **Conexión a Internet**
- **Acceso a Odoo v8** en `erp.santafixie.com`
- **Acceso a Google Sheets** (próximo paso)

---

## ⚡ Instalación Rápida (3 pasos)

### 1️⃣ Instalar Node.js

- Ve a https://nodejs.org/
- Descarga **LTS** (versión estable)
- Instálalo (siguiente, siguiente, siguiente)
- Abre una **terminal/PowerShell nueva** y verifica:

```bash
node --version
npm --version
```

### 2️⃣ Descargar Este Proyecto

- Descarga esta carpeta `odoo-sync`
- O clónalo si tienes Git:
  ```bash
  git clone <url>
  cd odoo-sync
  ```

### 3️⃣ Instalar Dependencias

Abre terminal en la carpeta y ejecuta:

```bash
npm install
```

Esto descarga automáticamente:
- `xmlrpc` - Para conectar a Odoo
- `dotenv` - Para variables de entorno
- `node-cron` - Para ejecutar cada hora
- `googleapis` - Para Google Sheets

---

## ✅ Probar Conexión a Odoo

```bash
npm test
```

**Resultado esperado:**

```
🔐 Conectando a Odoo v8...

Host: erp.santafixie.com
Base de datos: santafixie
Usuario: txampaback@gmail.com

⏳ PASO 1: Autenticando...
✅ ¡Autenticado!

UID (ID de usuario): 42

⏳ PASO 2: Leyendo albaranes (stock.picking)...

✅ Albaranes encontrados: 12

📋 Primeros 3 albaranes:

1. ID: 128
   Nombre: WH/OUT/00001
   Estado: done
   ...

🎉 ¡CONEXIÓN EXITOSA!
```

---

## 📁 Estructura del Proyecto

```
odoo-sync/
├── package.json          ← Dependencias (NO EDITAR)
├── .env                  ← Credenciales (NO SUBIR A GIT)
├── .env.example          ← Template (seguro para Git)
├── .gitignore            ← Archivos a ignorar
├── README.md             ← Información general
├── SETUP.md              ← Este archivo
├── test-odoo.js          ← Test de conexión
├── index.js              ← Script principal
├── config/
│   └── odoo.js           ← Cliente Odoo
├── utils/                ← Utilitarios (próximamente)
└── logs/                 ← Carpeta de logs
```

---

## 🔧 Configuración

El archivo `.env` ya contiene:

```env
ODOO_HOST=erp.santafixie.com
ODOO_DATABASE=santafixie
ODOO_LOGIN=txampaback@gmail.com
ODOO_PASSWORD==)rZipeCqY50Q19+h3
ODOO_PORT=443
```

✅ **Credenciales ya configuradas** - No necesitas cambiar nada

---

## 📝 Comandos Disponibles

```bash
# Probar conexión a Odoo
npm test

# Iniciar el script principal (cuando esté listo)
npm start
```

---

## ❌ Solución de Problemas

| Problema | Solución |
|----------|----------|
| `npm: command not found` | Instala Node.js desde nodejs.org |
| `Cannot find module 'xmlrpc'` | Ejecuta `npm install` |
| `Error de autenticación` | Verifica usuario/contraseña en `.env` |
| `getaddrinfo EAI_AGAIN` | Verifica tu conexión a internet |
| `Base de datos no encontrada` | Verifica `ODOO_DATABASE` en `.env` |

---

## 🎯 Próximos Pasos

1. ✅ **Probar conexión Odoo** (npm test)
2. ⏳ **Configurar Google Sheets API**
3. ⏳ **Crear lógica de sincronización**
4. ⏳ **Deploy en Railway.app**

---

## 🚀 Cuando Esté Listo

```bash
npm start
```

El script correrá automáticamente cada hora entre 6am-3pm, sincronizando albaranes a Google Sheets.

---

**¿Preguntas? Contacta al soporte** 📞
