#!/bin/bash
# Script de inicio para Mordipets en Render
echo "🐕 Starting Mordipets - Galletas para Perros"
echo "📦 Installing dependencies..."
npm install
echo "🚀 Starting server..."
npx serve -s . -l ${PORT:-3000}
