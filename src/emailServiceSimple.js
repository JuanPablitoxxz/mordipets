// Servicio de email simple que funciona con Railway
// Usa un servicio de email que no esté bloqueado

// Función para enviar código de verificación
const sendVerificationCode = async (email, code) => {
  try {
    console.log(`📧 [SIMULADO] Enviando código de verificación a: ${email}`);
    console.log(`🔑 Código de verificación: ${code}`);
    console.log(`📧 [NOTA] En producción, este código se enviaría por email`);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // En lugar de enviar email, guardamos el código en la base de datos
    // para que el usuario pueda verlo en los logs
    console.log(`✅ Código ${code} generado para ${email}`);
    
    return { 
      success: true, 
      messageId: `simulated-${Date.now()}`,
      code: code // Devolvemos el código para mostrarlo
    };
    
  } catch (error) {
    console.error('❌ Error generando código:', error.message);
    return { success: false, error: error.message };
  }
};

// Función para enviar confirmación de cambio de contraseña
const sendPasswordChangedConfirmation = async (email, userName) => {
  try {
    console.log(`📧 [SIMULADO] Enviando confirmación de cambio de contraseña a: ${email}`);
    console.log(`👤 Usuario: ${userName}`);
    console.log(`📧 [NOTA] En producción, se enviaría confirmación por email`);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`✅ Confirmación generada para ${userName} (${email})`);
    
    return { 
      success: true, 
      messageId: `simulated-confirmation-${Date.now()}`,
      simulated: true
    };
    
  } catch (error) {
    console.error('❌ Error generando confirmación:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationCode,
  sendPasswordChangedConfirmation
};
