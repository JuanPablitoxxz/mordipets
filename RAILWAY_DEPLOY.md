# 🚂 Deploy en Railway - Mordipets

## Configuración para Railway

### 1. Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecciona tu repositorio `mordipets`

### 2. Configurar Base de Datos PostgreSQL

1. En tu proyecto de Railway, haz clic en "New"
2. Selecciona "Database" → "PostgreSQL"
3. Railway creará automáticamente la variable `DATABASE_URL`

### 3. Configurar Variables de Entorno

En el dashboard de Railway, ve a tu servicio y configura estas variables:

```
NODE_ENV=production
PORT=3000
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-app-password-de-gmail
FRONTEND_URL=https://tu-app.railway.app
```

### 4. Configurar Gmail para Emails

1. Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Genera una "App Password" para "Mordipets"
3. Usa esa contraseña en `EMAIL_PASS`

### 5. Usuarios de Prueba

La aplicación creará automáticamente estos usuarios:

**Admin:**
- Email: `admin@mordipets.com`
- Contraseña: `admin123`

**Usuarios de Prueba:**
- Email: `test1@gmail.com` / Contraseña: `test123`
- Email: `test2@hotmail.com` / Contraseña: `test123`
- Email: `cliente@outlook.com` / Contraseña: `cliente123`

### 6. Probar la Aplicación

1. Ve a la URL de tu aplicación en Railway
2. Haz clic en "Iniciar Sesión"
3. Usa cualquiera de los emails de prueba
4. Prueba la funcionalidad de "¿Olvidaste tu contraseña?"

### 7. Verificar Logs

En Railway Dashboard → "Deployments" → "View Logs" para ver:
- ✅ Base de datos inicializada
- ✅ Usuario admin creado
- ✅ Usuarios de prueba creados
- ✅ Productos de ejemplo insertados

## Troubleshooting

### Error de Base de Datos
- Verifica que `DATABASE_URL` esté configurada
- Asegúrate de que PostgreSQL esté desplegado

### Error de Email
- Verifica `EMAIL_USER` y `EMAIL_PASS`
- Asegúrate de usar App Password de Gmail

### Error de CORS
- Railway maneja CORS automáticamente
- No necesitas configuración adicional

## Estructura del Proyecto

```
mordipets/
├── src/
│   ├── server.js          # Servidor principal
│   ├── database.js        # Configuración PostgreSQL
│   └── emailService.js    # Servicio de emails
├── public/                # Frontend estático
├── railway.json          # Configuración Railway
└── package.json          # Dependencias Node.js
```

## URLs Importantes

- **Aplicación**: `https://tu-app.railway.app`
- **Dashboard Railway**: `https://railway.app/dashboard`
- **Logs**: Railway Dashboard → Deployments → View Logs
