# 1️⃣ Imagen base
FROM node:20-alpine

# 2️⃣ Crear carpeta de la app
WORKDIR /app

# 3️⃣ Copiar package.json y package-lock.json
COPY package*.json ./

# 4️⃣ Instalar dependencias
RUN npm install --production

# 5️⃣ Copiar el resto del proyecto
COPY . .

# 6️⃣ Exponer el puerto de la app
EXPOSE 8080

# 7️⃣ Variables de entorno opcionales
ENV PORT=8080
ENV MONGO_URI=mongodb://host.docker.internal:27017/adoptions

# 8️⃣ Comando para levantar la app
CMD ["node", "src/server.js"]
