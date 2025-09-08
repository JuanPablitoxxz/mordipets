#!/bin/bash
# Script para configurar mordipets en el PATH
echo "🔧 Setting up Mordipets command..."

# Crear directorio bin si no existe
mkdir -p ~/bin

# Copiar el script de Node.js
cp mordipets.js ~/bin/mordipets
chmod +x ~/bin/mordipets

# Agregar al PATH si no está
if [[ ":$PATH:" != *":$HOME/bin:"* ]]; then
    echo 'export PATH="$HOME/bin:$PATH"' >> ~/.bashrc
    export PATH="$HOME/bin:$PATH"
fi

echo "✅ Mordipets command setup complete"
echo "🚀 Running Mordipets..."
exec ~/bin/mordipets
