#!/bin/bash

# Script d'upload rapide des nouveaux fichiers
# Upload uniquement les fichiers créés pour les nouvelles fonctionnalités

# Configuration FTP
FTP_HOST="ftp.sc6pixv7011.universe.wf"
FTP_USER="CreateBueBe@create.myziggi.pro"
FTP_PASSWORD="CreateBueBe79\$"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Upload Rapide - Nouveaux Fichiers${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Fonction d'upload
up() {
    local file=$1
    local dest=$2

    if [ ! -f "$file" ]; then
        echo -e "${RED}✗ Fichier introuvable: $file${NC}"
        return 1
    fi

    echo -e "${YELLOW}→${NC} $dest"

    curl -T "$file" \
         --user "$FTP_USER:$FTP_PASSWORD" \
         "ftp://$FTP_HOST/$dest" \
         --ftp-create-dirs \
         --silent \
         --show-error

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}  ✓${NC}"
        return 0
    else
        echo -e "${RED}  ✗ Erreur${NC}"
        return 1
    fi
}

# 1. Build frontend si nécessaire
if [ ! -d "frontend/dist" ]; then
    echo -e "${YELLOW}Build du frontend...${NC}"
    cd frontend && npm run build && cd ..
fi

echo -e "${BLUE}Upload des nouveaux composants...${NC}"
echo ""

# Nouveaux composants frontend
echo -e "${YELLOW}[1/4] Composants éditeur${NC}"
up "frontend/src/components/editor/ExportModal.tsx" "src/frontend/components/editor/ExportModal.tsx"
up "frontend/src/components/editor/DrawingPanel.tsx" "src/frontend/components/editor/DrawingPanel.tsx"
up "frontend/src/components/editor/LayersPanel.tsx" "src/frontend/components/editor/LayersPanel.tsx"
up "frontend/src/components/editor/PhotoLibrary.tsx" "src/frontend/components/editor/PhotoLibrary.tsx"

echo ""
echo -e "${YELLOW}[2/4] Layouts modifiés${NC}"
up "frontend/src/components/layout/EditorHeader.tsx" "src/frontend/components/layout/EditorHeader.tsx"
up "frontend/src/components/layout/EditorLayout.tsx" "src/frontend/components/layout/EditorLayout.tsx"
up "frontend/src/components/layout/EditorSidebar.tsx" "src/frontend/components/layout/EditorSidebar.tsx"

echo ""
echo -e "${YELLOW}[3/4] Hooks et stores${NC}"
up "frontend/src/hooks/useDrawing.ts" "src/frontend/hooks/useDrawing.ts"
up "frontend/src/stores/editorStore.ts" "src/frontend/stores/editorStore.ts"

echo ""
echo -e "${YELLOW}[4/4] Package.json avec jsPDF${NC}"
up "frontend/package.json" "src/frontend/package.json"

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Upload terminé !${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${YELLOW}Prochaines étapes sur le serveur:${NC}"
echo ""
echo "1. Installer jsPDF:"
echo -e "   ${BLUE}cd src/frontend && npm install jspdf${NC}"
echo ""
echo "2. Rebuild frontend:"
echo -e "   ${BLUE}npm run build${NC}"
echo ""
echo "3. Si vous voulez aussi uploader le build complet:"
echo -e "   ${BLUE}./upload-curl.sh${NC} (choisir option 1)"
echo ""
echo -e "URL: ${GREEN}https://create.myziggi.pro${NC}"
echo ""
