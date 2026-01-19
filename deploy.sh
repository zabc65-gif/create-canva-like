#!/bin/bash

# Script de déploiement via FTP
# Ce script upload les fichiers sur le serveur de production

set -e  # Arrêter en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Charger les variables d'environnement
if [ -f .env.deploy ]; then
    source .env.deploy
else
    echo -e "${RED}Erreur: Fichier .env.deploy introuvable${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Déploiement de Create (Canva-like)${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. Build du frontend
echo -e "${YELLOW}[1/4] Build du frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Build frontend terminé${NC}"
echo ""

# 2. Préparation des fichiers backend
echo -e "${YELLOW}[2/4] Préparation du backend...${NC}"
cd backend
# Créer package.json de production si nécessaire
if [ ! -f "dist/package.json" ]; then
    mkdir -p dist
    cp package.json dist/
fi
npm run build || echo "Build backend (si applicable)"
cd ..
echo -e "${GREEN}✓ Backend préparé${NC}"
echo ""

# 3. Création de l'archive pour upload
echo -e "${YELLOW}[3/4] Création de l'archive...${NC}"
rm -f deploy.tar.gz

# Créer la structure pour le serveur
mkdir -p deploy_temp/public
mkdir -p deploy_temp/api

# Copier le frontend build
cp -r frontend/dist/* deploy_temp/public/

# Copier le backend
cp -r backend/dist/* deploy_temp/api/ 2>/dev/null || cp -r backend/src/* deploy_temp/api/
cp backend/package.json deploy_temp/api/
cp -r backend/node_modules deploy_temp/api/ 2>/dev/null || echo "node_modules non copiés (à installer sur le serveur)"

# Créer l'archive
tar -czf deploy.tar.gz -C deploy_temp .
rm -rf deploy_temp

echo -e "${GREEN}✓ Archive créée: deploy.tar.gz${NC}"
echo ""

# 4. Upload via FTP avec curl
echo -e "${YELLOW}[4/4] Upload sur le serveur FTP...${NC}"

# Upload de l'archive
curl -T deploy.tar.gz \
    --user "$FTP_USER:$FTP_PASSWORD" \
    "ftp://$FTP_HOST/deploy.tar.gz" \
    --ftp-create-dirs

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Archive uploadée avec succès${NC}"
else
    echo -e "${RED}✗ Erreur lors de l'upload${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Déploiement terminé !${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Prochaines étapes sur le serveur:"
echo -e "1. Connectez-vous en SSH au serveur"
echo -e "2. Exécutez: ${YELLOW}tar -xzf deploy.tar.gz${NC}"
echo -e "3. Installez les dépendances: ${YELLOW}cd api && npm install --production${NC}"
echo -e "4. Configurez les variables d'environnement"
echo -e "5. Démarrez le serveur: ${YELLOW}npm start${NC}"
echo ""
echo -e "URL de production: ${GREEN}$PRODUCTION_URL${NC}"
echo ""

# Nettoyage
rm -f deploy.tar.gz

echo -e "${BLUE}Archive nettoyée. Déploiement complet !${NC}"
