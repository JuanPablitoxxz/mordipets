const nodemailer = require('nodemailer');
require('dotenv').config();

// Función para probar la configuración de email
async function testEmailConfiguration() {
  console.log('🔍 DIAGNÓSTICO DE CONFIGURACIÓN DE EMAIL\n');
  
  // Verificar variables de entorno
  console.log('📋 Variables de entorno:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`EMAIL_PASS: ${process.env.EMAIL_PASS ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅ Configurada' : '❌ No configurada'}`);
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('\n❌ ERROR: Variables de entorno no configuradas');
    console.log('📝 Configura las variables en Railway:');
    console.log('   - EMAIL_USER: tu-email@gmail.com');
    console.log('   - EMAIL_PASS: tu-app-password-de-16-caracteres');
    return;
  }
  
  // Crear transporter
  console.log('\n🔧 Creando transporter...');
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  // Verificar conexión
  console.log('🔌 Verificando conexión con Gmail...');
  try {
    await transporter.verify();
    console.log('✅ Conexión exitosa con Gmail');
  } catch (error) {
    console.log('❌ Error de conexión:', error.message);
    console.log('\n🔧 Posibles soluciones:');
    console.log('1. Verifica que la App Password sea correcta');
    console.log('2. Asegúrate de tener la verificación en 2 pasos activada');
    console.log('3. Revisa que el email sea válido');
    return;
  }
  
  // Enviar email de prueba
  console.log('\n📧 Enviando email de prueba...');
  const testEmail = process.env.EMAIL_USER; // Enviar a sí mismo para prueba
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: testEmail,
    subject: '🧪 Prueba de Email - Mordipets',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #4CAF50;">✅ Email de Prueba Exitoso</h1>
        <p>Si recibes este email, la configuración está funcionando correctamente.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Servidor:</strong> Mordipets</p>
      </div>
    `
  };
  
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado exitosamente');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📬 Revisa tu bandeja de entrada: ${testEmail}`);
  } catch (error) {
    console.log('❌ Error enviando email:', error.message);
  }
}

// Ejecutar diagnóstico
testEmailConfiguration().catch(console.error);
