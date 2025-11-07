# Etapa 1: Instalación de dependencias (incluye las de desarrollo)
FROM node:22.12.0-alpine3.20 AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install  # Instala todas las dependencias, incluidas las de desarrollo

# Etapa 2: Construcción de la aplicación
FROM node:22.12.0-alpine3.20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 3: Servir la aplicación con un servidor ligero
FROM node:22.12.0-alpine3.20 AS production
WORKDIR /app
COPY --from=build /app/.next .next
COPY --from=dependencies /app/node_modules node_modules
COPY --from=build /app/package.json package.json

EXPOSE 80
ENV PORT=80

CMD ["npm", "run", "start"]
