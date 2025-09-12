// Script para verificar variables de entorno en Railway
console.log('🔍 VERIFICACIÓN DE VARIABLES EN RAILWAY\n');

console.log('📋 Variables de entorno disponibles:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Configurada' : '❌ No configurada');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Configurada' : '❌ No configurada');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL ? '✅ Configurada' : '❌ No configurada');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');

console.log('\n🔧 Valores actuales:');
console.log('EMAIL_USER =', process.env.EMAIL_USER || 'undefined');
console.log('EMAIL_PASS =', process.env.EMAIL_PASS ? '***' + process.env.EMAIL_PASS.slice(-4) : 'undefined');
console.log('FRONTEND_URL =', process.env.FRONTEND_URL || 'undefined');

console.log('\n📝 Si las variables no aparecen, verifica en Railway:');
console.log('1. Ve a railway.app');
console.log('2. Tu proyecto → Variables');
console.log('3. Verifica que estén exactamente así:');
console.log('   EMAIL_USER = mordipetss@gmail.com');
console.log('   EMAIL_PASS = tu-app-password-de-16-caracteres');
console.log('   FRONTEND_URL = https://tu-app.vercel.app');
console.log('4. Reinicia el servidor (Redeploy)');
