#!/bin/bash

# Script d'installation de Node.js
# Ce script nécessite les droits administrateur

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Installation de Node.js v20.11.0${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier si Node.js est déjà installé
if command -v node &> /dev/null; then
    CURRENT_VERSION=$(node --version)
    echo -e "${YELLOW}Node.js est déjà installé: $CURRENT_VERSION${NC}"
    echo -e "${YELLOW}Voulez-vous continuer et mettre à jour? (y/n)${NC}"
    read -r response
    if [ "$response" != "y" ]; then
        echo -e "${RED}Installation annulée${NC}"
        exit 0
    fi
fi

echo -e "${YELLOW}Téléchargement de Node.js v20.11.0...${NC}"

# Télécharger Node.js
curl -o /tmp/node-installer.pkg https://nodejs.org/dist/v20.11.0/node-v20.11.0.pkg

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Téléchargement terminé${NC}"
else
    echo -e "${RED}✗ Erreur lors du téléchargement${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Installation de Node.js...${NC}"
echo -e "${YELLOW}(Votre mot de passe administrateur sera demandé)${NC}"
echo ""

# Installer
sudo installer -pkg /tmp/node-installer.pkg -target /

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Installation réussie !${NC}"
else
    echo -e "${RED}✗ Erreur lors de l'installation${NC}"
    exit 1
fi

# Nettoyer
rm -f /tmp/node-installer.pkg

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Installation terminée !${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Vérifier l'installation
echo -e "${YELLOW}Vérification de l'installation...${NC}"
echo ""

# Recharger le PATH
export PATH="/usr/local/bin:$PATH"

NODE_VERSION=$(node --version 2>/dev/null || echo "non trouvé")
NPM_VERSION=$(npm --version 2>/dev/null || echo "non trouvé")

echo -e "  Node.js : ${GREEN}$NODE_VERSION${NC}"
echo -e "  npm     : ${GREEN}$NPM_VERSION${NC}"
echo ""

if [ "$NODE_VERSION" != "non trouvé" ]; then
    echo -e "${GREEN}🎉 Node.js est installé avec succès !${NC}"
    echo ""
    echo -e "${YELLOW}Prochaines étapes :${NC}"
    echo "  1. Fermez et rouvrez votre terminal"
    echo "  2. Installez les dépendances du projet :"
    echo -e "     ${BLUE}cd /Users/user/Documents/Développement/Create\(Canva-like\)${NC}"
    echo -e "     ${BLUE}npm install${NC}"
    echo "  3. Installez jsPDF :"
    echo -e "     ${BLUE}cd frontend && npm install jspdf && cd ..${NC}"
    echo "  4. Lancez l'application :"
    echo -e "     ${BLUE}npm run dev${NC}"
else
    echo -e "${RED}⚠️  Une erreur s'est produite${NC}"
    echo "  Fermez et rouvrez votre terminal, puis vérifiez avec :"
    echo -e "     ${BLUE}node --version${NC}"
    echo -e "     ${BLUE}npm --version${NC}"
fi

echo ""
