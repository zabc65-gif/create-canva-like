#!/bin/bash

# Script de déploiement direct fichier par fichier via FTP
# Alternative au script avec archive

set -e

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Charger les variables
if [ -f .env.deploy ]; then
    source .env.deploy
else
    echo -e "${RED}Erreur: .env.deploy introuvable${NC}"
    exit 1
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Upload direct des fichiers${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Build frontend
echo -e "${YELLOW}Build du frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Build terminé${NC}"
echo ""

# Fonction pour uploader un fichier
upload_file() {
    local_file=$1
    remote_path=$2

    echo -e "  Uploading: $local_file -> $remote_path"

    curl -T "$local_file" \
        --user "$FTP_USER:$FTP_PASSWORD" \
        "ftp://$FTP_HOST/$remote_path" \
        --ftp-create-dirs \
        --silent

    if [ $? -eq 0 ]; then
        echo -e "  ${GREEN}✓${NC}"
    else
        echo -e "  ${RED}✗ Erreur${NC}"
        return 1
    fi
}

# Upload des fichiers frontend
echo -e "${YELLOW}Upload des fichiers frontend...${NC}"

# Trouver et uploader tous les fichiers du build
find frontend/dist -type f | while read file; do
    # Obtenir le chemin relatif
    relative_path=${file#frontend/dist/}
    upload_file "$file" "public/$relative_path"
done

echo -e "${GREEN}✓ Frontend uploadé${NC}"
echo ""

# Upload des fichiers backend
echo -e "${YELLOW}Upload des fichiers backend...${NC}"

# Backend source files
find backend/src -type f -name "*.ts" -o -name "*.js" | while read file; do
    relative_path=${file#backend/src/}
    upload_file "$file" "api/src/$relative_path"
done

# Backend config
upload_file "backend/package.json" "api/package.json"
upload_file "backend/tsconfig.json" "api/tsconfig.json" 2>/dev/null || true

echo -e "${GREEN}✓ Backend uploadé${NC}"
echo ""

# Upload des fichiers partagés
echo -e "${YELLOW}Upload des fichiers partagés...${NC}"

find shared/src -type f -name "*.ts" | while read file; do
    relative_path=${file#shared/src/}
    upload_file "$file" "api/shared/src/$relative_path"
done

upload_file "shared/package.json" "api/shared/package.json"

echo -e "${GREEN}✓ Shared uploadé${NC}"
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Upload terminé !${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Connectez-vous au serveur pour:"
echo -e "1. Installer les dépendances: ${YELLOW}cd api && npm install${NC}"
echo -e "2. Compiler TypeScript: ${YELLOW}npm run build${NC}"
echo -e "3. Démarrer: ${YELLOW}npm start${NC}"
echo ""
echo -e "URL: ${GREEN}$PRODUCTION_URL${NC}"
