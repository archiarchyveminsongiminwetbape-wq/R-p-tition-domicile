#!/bin/bash

echo "🚀 Déploiement de Répétitions à Domicile en production..."

# Étape 1: Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

echo "📦 Installation des dépendances du serveur..."
cd server
npm install
cd ..

# Étape 2: Configurer Prisma
echo "🗄️  Configuration de la base de données..."
cd server
npm run prisma:generate
npm run prisma:deploy
cd ..

# Étape 3: Builder le frontend
echo "🔨 Construction du frontend..."
npm run build:prod

# Étape 4: Démarrer le serveur
echo "🎯 Démarrage du serveur en production..."
cd server
NODE_ENV=production npm start

echo "✅ Déploiement terminé!"
echo "🌐 Application disponible sur http://localhost:3000"