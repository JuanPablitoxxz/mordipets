# 🔧 SOLUCIÓN: Emails de Verificación y Recuperación

## 🚨 PROBLEMA IDENTIFICADO

Los emails de verificación y recuperación de contraseña no están llegando. Esto se debe a que **las variables de entorno de email no están configuradas correctamente en Railway**.

## ✅ SOLUCIÓN PASO A PASO

### **PASO 1: Configurar Gmail (OBLIGATORIO)**

#### 1.1 Activar Verificación en 2 Pasos
1. Ve a [myaccount.google.com](https://myaccount.google.com)
2. **Seguridad** → **Verificación en 2 pasos**
3. **Actívala** si no está activada

#### 1.2 Generar App Password
1. Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Selecciona **"Correo"** y **"Otro (nombre personalizado)"**
3. Escribe **"Mordipets"** como nombre
4. **Copia la contraseña de 16 caracteres** que te genera (ej: `abcd efgh ijkl mnop`)

### **PASO 2: Configurar Variables en Railway**

#### 2.1 Acceder a Railway
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con tu cuenta
3. Selecciona tu proyecto **"mordipets"**

#### 2.2 Agregar Variables de Entorno
1. Ve a **"Variables"** en el menú lateral
2. Haz clic en **"+ New Variable"**
3. Agrega estas variables:

```
EMAIL_USER = tu-email@gmail.com
EMAIL_PASS = tu-app-password-de-16-caracteres
FRONTEND_URL = https://tu-app.vercel.app
```

**⚠️ IMPORTANTE:**
- `EMAIL_USER`: Tu email de Gmail completo
- `EMAIL_PASS`: La App Password de 16 caracteres (sin espacios)
- `FRONTEND_URL`: La URL de tu aplicación en Vercel

### **PASO 3: Verificar Configuración**

#### 3.1 Reiniciar el Servidor
1. En Railway, ve a **"Deployments"**
2. Haz clic en **"Redeploy"** para reiniciar el servidor
3. Espera a que termine el deploy

#### 3.2 Probar el Envío
1. Ve a tu aplicación web
2. Haz clic en **"¿Olvidaste tu contraseña?"**
3. Ingresa un email válido
4. Revisa los logs en Railway para ver si hay errores

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### **Error: "Variables de entorno no configuradas"**
- **Solución**: Verifica que `EMAIL_USER` y `EMAIL_PASS` estén configuradas en Railway

### **Error: "Error de autenticación"**
- **Solución**: Verifica que la App Password sea correcta (16 caracteres, sin espacios)

### **Error: "Error de conexión"**
- **Solución**: Verifica que la verificación en 2 pasos esté activada en Gmail

### **Emails van a Spam**
- **Solución**: Revisa la carpeta de spam en tu email

## 📧 CONFIGURACIÓN ALTERNATIVA

Si Gmail no funciona, puedes usar otros servicios:

### **SendGrid (Recomendado)**
1. Crea cuenta en [sendgrid.com](https://sendgrid.com)
2. Genera una API Key
3. Configura en Railway:
   ```
   EMAIL_SERVICE = sendgrid
   SENDGRID_API_KEY = tu-api-key
   ```

### **Mailgun**
1. Crea cuenta en [mailgun.com](https://mailgun.com)
2. Obtén credenciales SMTP
3. Configura en Railway:
   ```
   EMAIL_SERVICE = mailgun
   MAILGUN_USER = tu-usuario
   MAILGUN_PASS = tu-password
   ```

## 🧪 PRUEBA LOCAL

Para probar localmente:

1. **Crea archivo `.env`**:
   ```
   EMAIL_USER=tu-email@gmail.com
   EMAIL_PASS=tu-app-password
   FRONTEND_URL=http://localhost:3000
   ```

2. **Ejecuta script de prueba**:
   ```bash
   node scripts/test-email.js
   ```

## 📊 LOGS DE VERIFICACIÓN

En Railway, revisa los logs para ver:

### **✅ Logs Exitosos:**
```
📧 Intentando enviar código de verificación a: usuario@email.com
🔌 Verificando conexión con Gmail...
✅ Conexión con Gmail verificada
📤 Enviando email...
✅ Email enviado exitosamente: <message-id>
```

### **❌ Logs de Error:**
```
❌ Variables de entorno de email no configuradas
❌ Error de autenticación. Verifica la App Password de Gmail.
```

## 🚀 DESPUÉS DE CONFIGURAR

Una vez configurado correctamente:

1. **Los emails de verificación** llegarán al destinatario
2. **Los emails de confirmación** se enviarán al cambiar contraseña
3. **Los logs mostrarán** el estado del envío
4. **El sistema funcionará** completamente

## 📞 SOPORTE

Si sigues teniendo problemas:

1. **Revisa los logs** en Railway
2. **Verifica las variables** de entorno
3. **Prueba con otro email** de Gmail
4. **Contacta soporte** con los logs de error

---

**🎯 RESULTADO ESPERADO:** Los emails de verificación y recuperación llegarán correctamente a los usuarios.
