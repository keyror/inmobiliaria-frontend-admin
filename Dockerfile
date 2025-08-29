# Usar una imagen base de Node.js para construir la aplicación
FROM node:latest as build-stage

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

RUN corepack enable

# Después de establecer el directorio de trabajo
RUN chmod -R 777 /app

# Copiar package.json y package-lock.json para instalar las dependencias
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos del proyecto
COPY ./ .


RUN npm run build

# Construir la aplicación para producción
RUN chmod -R 755 /app/.output && ls -la /app/.output

# Usar una imagen base de Nginx para servir la aplicación
#FROM nginx as production-stage

# Build Stage 2
FROM node:latest
WORKDIR /app
#RUN mkdir /app
# Copiar los archivos estáticos construidos desde la etapa anterior
COPY --from=build-stage /app/.output ./.output

# Copiar la configuración personalizada de Nginx
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf
#ENV PORT=3000
#ENV HOST=0.0.0.0
# Exponer el puerto 51 para acceder a la aplicación
EXPOSE 3000

# Iniciar Nginx cuando se ejecute el contenedor
#CMD ["nginx", "-g", "daemon off;"]
CMD ["node", ".output/server/index.mjs"]
