const fs = require('fs');
const path = require('path');

console.log('🚀 Configurador de variables de entorno para Railway');
console.log('================================================');

// Verificar si ya existe un archivo .env
const envPath = path.join(__dirname, '..', '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
    console.log('✅ Archivo .env encontrado');
} else {
    console.log('⚠️ Archivo .env no encontrado');
}

console.log('\n📋 Para configurar la base de datos de Railway:');
console.log('1. Ve a https://railway.app/dashboard');
console.log('2. Selecciona tu proyecto');
console.log('3. Ve a la pestaña "Variables"');
console.log('4. Busca la variable DATABASE_URL');
console.log('5. Copia el valor completo');
console.log('\n🔧 Luego ejecuta uno de estos comandos:');

console.log('\nOpción 1 - Configurar variable de entorno temporal:');
console.log('$env:DATABASE_URL="tu-url-de-railway-aqui"');
console.log('npm start');

console.log('\nOpción 2 - Crear archivo .env:');
console.log('Crea un archivo .env en la raíz del proyecto con:');
console.log('DATABASE_URL=tu-url-de-railway-aqui');
console.log('NODE_ENV=development');
console.log('PORT=3000');

console.log('\nOpción 3 - Usar Railway CLI:');
console.log('npm install -g @railway/cli');
console.log('railway login');
console.log('railway link');
console.log('railway run npm start');

console.log('\n💡 La URL de la base de datos debe verse así:');
console.log('postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway');

// Verificar variables de entorno actuales
console.log('\n🔍 Variables de entorno actuales:');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No configurada');
console.log('NODE_ENV:', process.env.NODE_ENV || 'No configurado');
console.log('PORT:', process.env.PORT || 'No configurado');
