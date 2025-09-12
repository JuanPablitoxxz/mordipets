// Servicio de email simulado para desarrollo/testing
// Muestra el código en consola en lugar de enviarlo por email

// Función para enviar código de verificación (SIMULADA)
const sendVerificationCode = async (email, code) => {
  try {
    console.log(`📧 [SIMULADO] Intentando enviar código de verificación a: ${email}`);
    console.log(`🔑 [SIMULADO] Código de verificación: ${code}`);
    console.log(`📧 [SIMULADO] Email enviado exitosamente (simulado)`);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
      success: true, 
      messageId: `mock-${Date.now()}`,
      simulated: true
    };
    
  } catch (error) {
    console.error('❌ Error en simulación de email:', error);
    return { success: false, error: error.message };
  }
};

// Función para enviar confirmación de cambio de contraseña (SIMULADA)
const sendPasswordChangedConfirmation = async (email, userName) => {
  try {
    console.log(`📧 [SIMULADO] Intentando enviar confirmación de cambio de contraseña a: ${email}`);
    console.log(`👤 [SIMULADO] Usuario: ${userName}`);
    console.log(`📧 [SIMULADO] Email de confirmación enviado (simulado)`);
    
    // Simular delay de envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { 
      success: true, 
      messageId: `mock-confirmation-${Date.now()}`,
      simulated: true
    };
    
  } catch (error) {
    console.error('❌ Error en simulación de email de confirmación:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendVerificationCode,
  sendPasswordChangedConfirmation
};
