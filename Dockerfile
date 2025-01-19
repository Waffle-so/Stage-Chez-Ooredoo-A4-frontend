# Utiliser l'image de Node.js officielle
FROM node:20

# Créer un répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Installer PM2 globalement
RUN npm install -g pm2

# Installer le compilateur SWC manuellement pour Next.js
RUN npm install @next/swc-linux-x64-gnu

# Copier le reste du code de l'application
COPY . .

# Exposer le port pour le frontend (habituellement 3000 pour Next.js)
EXPOSE 3000

# Commande pour démarrer l'application avec PM2
CMD ["pm2-runtime", "start", "npm", "--", "run", "dev"]
