#!/usr/bin/env node
// Script de inicio para Mordipets
console.log('🐕 Starting Mordipets - Galletas para Perros');
console.log('📦 Installing dependencies...');

const { execSync } = require('child_process');
const path = require('path');

try {
  // Instalar dependencias si es necesario
  execSync('npm install', { stdio: 'inherit' });
  
  // Iniciar el servidor
  console.log('🚀 Starting server...');
  execSync('npx serve -s . -l ${PORT:-3000}', { 
    stdio: 'inherit',
    env: { ...process.env, PORT: process.env.PORT || '3000' }
  });
} catch (error) {
  console.error('❌ Error starting Mordipets:', error.message);
  process.exit(1);
}
