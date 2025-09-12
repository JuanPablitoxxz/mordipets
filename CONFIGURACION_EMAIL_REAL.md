# 📧 CONFIGURACIÓN DE EMAIL REAL PARA MORDIPETS

## 🎯 OBJETIVO
Enviar códigos de verificación y confirmaciones **realmente al correo del cliente**.

## 🔧 OPCIÓN 1: RESEND (RECOMENDADO)

### **PASO 1: Crear cuenta en Resend**
1. Ve a [resend.com](https://resend.com)
2. **Regístrate** con tu email
3. **Verifica** tu cuenta
4. **Completa** el perfil

### **PASO 2: Obtener API Key**
1. En Resend → **"API Keys"**
2. Haz clic en **"Create API Key"**
3. **Nombre**: "Mordipets App"
4. **Copia** la API Key (empieza con `re_`)

### **PASO 3: Configurar en Railway**
1. Ve a [railway.app](https://railway.app)
2. Tu proyecto → **"Variables"**
3. **Agrega**:
   ```
   RESEND_API_KEY = re_tu-api-key-aqui
   EMAIL_USER = mordipetss@gmail.com
   FRONTEND_URL = https://tu-app.vercel.app
   ```

### **PASO 4: Reiniciar servidor**
1. En Railway → **"Deployments"**
2. Haz clic en **"Redeploy"**

## 🔧 OPCIÓN 2: GMAIL (ALTERNATIVA)

### **Si prefieres usar Gmail:**
1. **Genera nueva App Password** en Gmail
2. **Actualiza** en Railway:
   ```
   EMAIL_USER = mordipetss@gmail.com
   EMAIL_PASS = nueva-app-password
   FRONTEND_URL = https://tu-app.vercel.app
   ```
3. **Reinicia** el servidor

## 🧪 PRUEBA

### **1. Reinicia el servidor en Railway**
### **2. Ve a tu aplicación web**
### **3. Prueba "¿Olvidaste tu contraseña?"**
### **4. Ingresa un email válido**
### **5. Revisa si llega el email**

## 📊 LOGS ESPERADOS

### **Con Resend:**
```
📧 Usando servicio de email real (envía a correo del cliente)
📧 Enviando código de verificación a: usuario@email.com
✅ Email enviado exitosamente: <message-id>
```

### **Con Gmail:**
```
📧 Usando servicio de email real (envía a correo del cliente)
📧 Enviando código de verificación a: usuario@email.com
✅ Email enviado exitosamente: <message-id>
```

## 🎯 RESULTADO

- ✅ **Códigos de verificación** llegan al email del cliente
- ✅ **Confirmaciones** de cambio de contraseña llegan al email
- ✅ **Sistema completo** funcionando

## 🔧 TROUBLESHOOTING

### **Si no llegan los emails:**
1. **Revisa** la carpeta de spam
2. **Verifica** las variables en Railway
3. **Reinicia** el servidor
4. **Prueba** con otro email

### **Si hay errores de conexión:**
1. **Usa Resend** en lugar de Gmail
2. **Verifica** la API Key
3. **Revisa** los logs en Railway

## 🚀 VENTAJAS DE RESEND

- ✅ **Más confiable** que Gmail
- ✅ **Mejor deliverability** (menos spam)
- ✅ **Funciona** con Railway
- ✅ **3,000 emails gratis** por mes
- ✅ **Logs detallados** de envío

---

**🎯 RESULTADO FINAL:** Los códigos de verificación y confirmaciones se enviarán realmente al correo del cliente.
