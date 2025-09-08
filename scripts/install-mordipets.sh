#!/bin/bash
# Script para instalar mordipets globalmente
echo "🔧 Installing Mordipets command globally..."

# Crear directorio bin si no existe
mkdir -p /usr/local/bin

# Copiar el script y hacerlo ejecutable
cp mordipets /usr/local/bin/mordipets
chmod +x /usr/local/bin/mordipets

# Crear symlink en /usr/bin también
ln -sf /usr/local/bin/mordipets /usr/bin/mordipets

echo "✅ Mordipets command installed globally"
echo "🚀 Running Mordipets..."
exec mordipets

