# 📧 CONFIGURACIÓN SENDGRID PARA MORDIPETS

## 🚨 PROBLEMA CON GMAIL

Gmail está bloqueando las conexiones desde Railway. SendGrid es más confiable para producción.

## ✅ CONFIGURACIÓN SENDGRID

### **PASO 1: Crear cuenta en SendGrid**

1. Ve a [sendgrid.com](https://sendgrid.com)
2. **Regístrate** con tu email
3. **Verifica** tu cuenta de email
4. **Completa** el perfil de la cuenta

### **PASO 2: Generar API Key**

1. En SendGrid → **"Settings"** → **"API Keys"**
2. Haz clic en **"Create API Key"**
3. **Nombre**: "Mordipets App"
4. **Permisos**: "Full Access" (o "Restricted Access" con permisos de email)
5. **Copia** la API Key (empieza con `SG.`)

### **PASO 3: Configurar en Railway**

1. Ve a [railway.app](https://railway.app)
2. Tu proyecto → **"Variables"**
3. **Agrega**:
   ```
   SENDGRID_API_KEY = SG.tu-api-key-aqui
   EMAIL_USER = mordipetss@gmail.com
   FRONTEND_URL = https://tu-app.vercel.app
   ```

### **PASO 4: Actualizar el servidor**

1. **Cambia** `src/server.js` para usar SendGrid:
   ```javascript
   const { sendVerificationCode, sendPasswordChangedConfirmation } = require('./emailServiceSendGrid');
   ```

2. **Haz deploy** de los cambios

## 🧪 PRUEBA

1. **Reinicia** el servidor en Railway
2. **Prueba** "¿Olvidaste tu contraseña?"
3. **Verifica** que llegue el email

## 📊 VENTAJAS DE SENDGRID

- ✅ **Más confiable** que Gmail
- ✅ **Mejor deliverability** (menos spam)
- ✅ **Funciona** con Railway
- ✅ **10,000 emails gratis** por mes
- ✅ **Logs detallados** de envío

## 🔧 CONFIGURACIÓN ALTERNATIVA

Si no quieres usar SendGrid, puedes probar:

### **Mailgun**
```
MAILGUN_USER = tu-usuario
MAILGUN_PASS = tu-password
```

### **Amazon SES**
```
AWS_ACCESS_KEY_ID = tu-access-key
AWS_SECRET_ACCESS_KEY = tu-secret-key
```

## 🎯 RESULTADO

Con SendGrid configurado, los emails funcionarán perfectamente sin problemas de timeout.
