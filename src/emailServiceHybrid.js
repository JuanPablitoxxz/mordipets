// Servicio de email híbrido que funciona con Railway
// Intenta enviar por email, si falla muestra el código en logs

const nodemailer = require('nodemailer');

// Configuración del transporter de email
const createTransporter = () => {
  // Intentar usar Resend primero
  if (process.env.RESEND_API_KEY) {
    return nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 587,
      secure: false,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      },
      connectionTimeout: 10000, // 10 segundos
      greetingTimeout: 5000,    // 5 segundos
      socketTimeout: 10000      // 10 segundos
    });
  }
  
  // Fallback a Gmail
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 5000,
    socketTimeout: 10000
  });
};

// Función para enviar código de verificación
const sendVerificationCode = async (email, code) => {
  try {
    console.log(`📧 Intentando enviar código de verificación a: ${email}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Variables de email no configuradas');
      console.log(`🔑 CÓDIGO DE VERIFICACIÓN: ${code}`);
      console.log(`📧 [NOTA] En producción, este código se enviaría por email`);
      return { 
        success: true, 
        messageId: `simulated-${Date.now()}`,
        code: code,
        simulated: true
      };
    }
    
    const transporter = createTransporter();
    
    // Intentar enviar email con timeout corto
    const emailPromise = transporter.sendMail({
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
    
    // Timeout de 15 segundos
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 15000)
    );
    
    const result = await Promise.race([emailPromise, timeoutPromise]);
    
    console.log('✅ Email enviado exitosamente:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error.message);
    console.log(`🔑 CÓDIGO DE VERIFICACIÓN: ${code}`);
    console.log(`📧 [NOTA] Debido a problemas de conectividad, el código se muestra aquí`);
    console.log(`📧 [NOTA] En producción, este código se enviaría por email`);
    
    return { 
      success: true, 
      messageId: `simulated-${Date.now()}`,
      code: code,
      simulated: true,
      error: error.message
    };
  }
};

// Función para enviar confirmación de cambio de contraseña
const sendPasswordChangedConfirmation = async (email, userName) => {
  try {
    console.log(`📧 Intentando enviar confirmación de cambio de contraseña a: ${email}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Variables de email no configuradas');
      console.log(`✅ Confirmación generada para ${userName} (${email})`);
      return { 
        success: true, 
        messageId: `simulated-confirmation-${Date.now()}`,
        simulated: true
      };
    }
    
    const transporter = createTransporter();
    
    const emailPromise = transporter.sendMail({
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
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 15000)
    );
    
    const result = await Promise.race([emailPromise, timeoutPromise]);
    
    console.log('✅ Email de confirmación enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error.message);
    console.log(`✅ Confirmación generada para ${userName} (${email})`);
    console.log(`📧 [NOTA] Debido a problemas de conectividad, la confirmación se muestra aquí`);
    
    return { 
      success: true, 
      messageId: `simulated-confirmation-${Date.now()}`,
      simulated: true,
      error: error.message
    };
  }
};

module.exports = {
  sendVerificationCode,
  sendPasswordChangedConfirmation
};
