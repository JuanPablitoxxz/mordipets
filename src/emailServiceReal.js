const nodemailer = require('nodemailer');

// Configuración del transporter de email real
const createTransporter = () => {
  // Intentar usar Resend primero (más confiable)
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    });
  }
  
  // Fallback a Gmail con configuración mejorada
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    pool: true,
    maxConnections: 1,
    maxMessages: 1,
    rateDelta: 20000,
    rateLimit: 5
  });
};

// Función para enviar código de verificación
const sendVerificationCode = async (email, code) => {
  try {
    console.log(`📧 Enviando código de verificación a: ${email}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Variables de email no configuradas');
      return { success: false, error: 'Variables de email no configuradas' };
    }
    
    const transporter = createTransporter();
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Código de Verificación - Mordipets',
      text: `Tu código de verificación es: ${code}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4CAF50; text-align: center;">Código de Verificación</h1>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; text-align: center;">
            <h2>Tu código de verificación es:</h2>
            <div style="background-color: #4CAF50; color: white; font-size: 32px; font-weight: bold; 
                        padding: 20px; border-radius: 10px; letter-spacing: 5px; display: inline-block;">
              ${code}
            </div>
            <p style="margin-top: 20px; color: #666;">
              Este código expira en 10 minutos. No lo compartas con nadie.
            </p>
          </div>
          <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;">
            © 2024 Mordipets - Galletas para Perros
          </p>
        </div>
      `
    });
    
    console.log('✅ Email enviado exitosamente:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para enviar confirmación de cambio de contraseña
const sendPasswordChangedConfirmation = async (email, userName) => {
  try {
    console.log(`📧 Enviando confirmación de cambio de contraseña a: ${email}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Variables de email no configuradas');
      return { success: false, error: 'Variables de email no configuradas' };
    }
    
    const transporter = createTransporter();
    
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Contraseña Actualizada - Mordipets',
      text: `Hola ${userName}, tu contraseña ha sido actualizada exitosamente.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4CAF50; text-align: center;">¡Contraseña Actualizada!</h1>
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px;">
            <h2>Hola ${userName},</h2>
            <p>Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión en Mordipets con tu nueva contraseña.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background-color: #4CAF50; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; 
                        display: inline-block;">
                Ir a Mordipets
              </a>
            </div>
          </div>
          <p style="text-align: center; color: #999; font-size: 14px; margin-top: 20px;">
            © 2024 Mordipets - Galletas para Perros
          </p>
        </div>
      `
    });
    
    console.log('✅ Email de confirmación enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationCode,
  sendPasswordChangedConfirmation
};
