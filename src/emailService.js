const nodemailer = require('nodemailer');

// Configuración simple del transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
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
      html: `<h1>Código de Verificación</h1><p>Tu código es: <strong>${code}</strong></p>`
    });
    
    console.log('✅ Email enviado exitosamente');
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
      html: `<h1>Contraseña Actualizada</h1><p>Hola ${userName}, tu contraseña ha sido actualizada exitosamente.</p>`
    });
    
    console.log('✅ Email de confirmación enviado');
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
