# Etapa de producción
FROM nginx:alpine

# Copiar solo los archivos de build
COPY dist /usr/share/nginx/html

# Copiar package.json (para referencia o información de versión)
COPY package.json /app/package.json

# Exponer el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]