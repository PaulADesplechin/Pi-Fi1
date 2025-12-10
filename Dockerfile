# Dockerfile pour Pifi Backend
FROM node:18-alpine

WORKDIR /app

# Copier les fichiers du serveur
COPY server/package*.json ./
RUN npm install --production

COPY server/ ./

EXPOSE 3001

CMD ["node", "index.js"]

