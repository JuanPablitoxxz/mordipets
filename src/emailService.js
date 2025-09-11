const nodemailer = require('nodemailer');

// Configuración del transporter de email
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'tu-app-password'
    }
  });
};

// Función para enviar código de verificación
const sendVerificationCode = async (email, code) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mordipets@tudominio.com',
      to: email,
      subject: 'Código de Verificación - Mordipets',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://via.placeholder.com/150x50/4CAF50/FFFFFF?text=Mordipets" alt="Mordipets Logo" style="max-width: 150px;">
            <h1 style="color: #4CAF50; margin: 20px 0;">Recuperar Contraseña</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">¡Hola!</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Has solicitado recuperar tu contraseña en Mordipets. Para continuar con el proceso, 
              utiliza el siguiente código de verificación:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #4CAF50; color: white; font-size: 32px; font-weight: bold; 
                          padding: 20px; border-radius: 10px; letter-spacing: 5px; display: inline-block;">
                ${code}
              </div>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <strong>Importante:</strong>
            </p>
            <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <li>Este código expira en 10 minutos</li>
              <li>No compartas este código con nadie</li>
              <li>Si no solicitaste este cambio, ignora este email</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>Este email fue enviado automáticamente por Mordipets</p>
            <p>© 2024 Mordipets - Galletas para Perros</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar confirmación de cambio de contraseña
const sendPasswordChangedConfirmation = async (email, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'mordipets@tudominio.com',
      to: email,
      subject: 'Contraseña Actualizada - Mordipets',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="https://via.placeholder.com/150x50/4CAF50/FFFFFF?text=Mordipets" alt="Mordipets Logo" style="max-width: 150px;">
            <h1 style="color: #4CAF50; margin: 20px 0;">¡Contraseña Actualizada!</h1>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Hola ${userName},</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              Tu contraseña ha sido actualizada exitosamente. Ahora puedes iniciar sesión 
              en Mordipets con tu nueva contraseña.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" 
                 style="background-color: #4CAF50; color: white; padding: 15px 30px; 
                        text-decoration: none; border-radius: 5px; font-weight: bold; 
                        display: inline-block;">
                Ir a Mordipets
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <strong>Si no realizaste este cambio:</strong>
            </p>
            <ul style="color: #666; line-height: 1.6; margin-bottom: 20px;">
              <li>Contacta inmediatamente a nuestro soporte</li>
              <li>Cambia tu contraseña nuevamente</li>
              <li>Revisa la seguridad de tu cuenta</li>
            </ul>
          </div>
          
          <div style="text-align: center; color: #999; font-size: 14px;">
            <p>Este email fue enviado automáticamente por Mordipets</p>
            <p>© 2024 Mordipets - Galletas para Perros</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Error enviando email de confirmación:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationCode,
  sendPasswordChangedConfirmation
};
