# 📧 Configuración de Email para Mordipets

## Configuración de Gmail

Para que el envío de emails funcione correctamente, necesitas configurar Gmail con una "App Password".

### Pasos para configurar Gmail:

1. **Habilita la verificación en 2 pasos** en tu cuenta de Google:
   - Ve a [myaccount.google.com](https://myaccount.google.com)
   - Seguridad → Verificación en 2 pasos
   - Actívala si no está activada

2. **Genera una App Password**:
   - Ve a [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Selecciona "Correo" y "Otro (nombre personalizado)"
   - Escribe "Mordipets" como nombre
   - Copia la contraseña de 16 caracteres que te genera

3. **Configura las variables de entorno**:
   - Copia `env.example` a `.env`
   - Reemplaza los valores:
     ```
     EMAIL_USER=tu-email@gmail.com
     EMAIL_PASS=tu-app-password-de-16-caracteres
     FRONTEND_URL=https://tu-dominio.com
     ```

### Para producción (Vercel/Render):

1. **Vercel**:
   - Ve a tu proyecto en Vercel
   - Settings → Environment Variables
   - Agrega:
     - `EMAIL_USER`: tu-email@gmail.com
     - `EMAIL_PASS`: tu-app-password
     - `FRONTEND_URL`: https://tu-dominio.vercel.app

2. **Render**:
   - Ve a tu servicio en Render
   - Environment → Add Environment Variable
   - Agrega las mismas variables

## Alternativas de Email

Si no quieres usar Gmail, puedes usar otros servicios:

### SendGrid (Recomendado para producción)
```javascript
// En src/emailService.js, reemplaza el transporter:
const transporter = nodemailer.createTransporter({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

### Mailgun
```javascript
const transporter = nodemailer.createTransporter({
  host: 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS
  }
});
```

## Pruebas

Para probar el envío de emails:

1. Inicia el servidor: `npm start`
2. Ve a la página web
3. Haz clic en "¿Olvidaste tu contraseña?"
4. Ingresa un email válido
5. Revisa tu bandeja de entrada

## Troubleshooting

- **Error de autenticación**: Verifica que la App Password sea correcta
- **Emails en spam**: Revisa la carpeta de spam
- **Error de conexión**: Verifica que las variables de entorno estén configuradas
- **Gmail bloquea**: Asegúrate de tener la verificación en 2 pasos activada
