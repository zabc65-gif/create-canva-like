#!/bin/bash

# Script de lancement de l'application Create
# Charge automatiquement nvm et lance l'application

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Lancement de Create (Canva-like)${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Charger nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js n'est pas chargé${NC}"
    echo "Fermez et rouvrez votre terminal, puis relancez ce script"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version)${NC}"
echo -e "${GREEN}✓ npm $(npm --version)${NC}"
echo ""

# Aller dans le dossier du projet
cd "$(dirname "$0")"

echo -e "${YELLOW}Démarrage de l'application...${NC}"
echo ""
echo -e "  ${BLUE}Frontend${NC} : http://localhost:3000"
echo -e "  ${BLUE}Backend${NC}  : http://localhost:4000"
echo ""
echo -e "${YELLOW}Appuyez sur Ctrl+C pour arrêter${NC}"
echo ""

# Lancer l'application
npm run dev
