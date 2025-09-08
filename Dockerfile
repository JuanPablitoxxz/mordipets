# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todos los archivos del proyecto
COPY . .

# Hacer ejecutables los scripts si existen
RUN if [ -f "mordipets" ]; then chmod +x mordipets; fi
RUN if [ -f "mordipets.sh" ]; then chmod +x mordipets.sh; fi

# Exponer el puerto (Render asignará el puerto automáticamente)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
