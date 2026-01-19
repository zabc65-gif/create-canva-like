#!/bin/bash

# Script d'upload simple avec curl uniquement
# Upload les fichiers essentiels sur le serveur FTP

# Configuration FTP (depuis .env.deploy)
FTP_HOST="ftp.sc6pixv7011.universe.wf"
FTP_USER="CreateBueBe@create.myziggi.pro"
FTP_PASSWORD="CreateBueBe79\$"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=================================${NC}"
echo -e "${BLUE}  Upload via CURL (FTP)${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""

# Fonction d'upload
upload() {
    local file=$1
    local dest=$2

    echo -e "${YELLOW}Upload:${NC} $file → $dest"

    curl -T "$file" \
         --user "$FTP_USER:$FTP_PASSWORD" \
         "ftp://$FTP_HOST/$dest" \
         --ftp-create-dirs \
         --progress-bar

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Success${NC}"
        return 0
    else
        echo -e "${RED}✗ Failed${NC}"
        return 1
    fi
}

# Fonction d'upload récursif
upload_dir() {
    local source_dir=$1
    local target_dir=$2

    echo -e "\n${BLUE}Uploading directory: $source_dir${NC}"

    find "$source_dir" -type f | while read -r file; do
        # Calculer le chemin relatif
        relative_path="${file#$source_dir/}"
        remote_path="$target_dir/$relative_path"

        upload "$file" "$remote_path" || echo -e "${RED}Warning: Failed to upload $file${NC}"
    done
}

# Vérifier si le build frontend existe
if [ ! -d "frontend/dist" ]; then
    echo -e "${YELLOW}Le dossier frontend/dist n'existe pas.${NC}"
    echo -e "${YELLOW}Voulez-vous builder maintenant? (y/n)${NC}"
    read -r response
    if [ "$response" = "y" ]; then
        echo -e "${BLUE}Building frontend...${NC}"
        cd frontend && npm run build && cd ..
    else
        echo -e "${RED}Abandon. Veuillez builder le frontend d'abord.${NC}"
        exit 1
    fi
fi

# Menu de sélection
echo -e "\n${BLUE}Que voulez-vous uploader?${NC}"
echo "1) Frontend uniquement (dist)"
echo "2) Backend uniquement (src)"
echo "3) Tout (frontend + backend + shared)"
echo "4) Fichier spécifique"
echo ""
read -p "Choix (1-4): " choice

case $choice in
    1)
        echo -e "\n${BLUE}Upload du frontend...${NC}"
        upload_dir "frontend/dist" "public"
        echo -e "\n${GREEN}Frontend uploadé !${NC}"
        ;;

    2)
        echo -e "\n${BLUE}Upload du backend...${NC}"
        upload_dir "backend/src" "api/src"
        upload "backend/package.json" "api/package.json"
        upload "backend/tsconfig.json" "api/tsconfig.json" 2>/dev/null || true
        echo -e "\n${GREEN}Backend uploadé !${NC}"
        ;;

    3)
        echo -e "\n${BLUE}Upload complet...${NC}"

        # Frontend
        upload_dir "frontend/dist" "public"

        # Backend
        upload_dir "backend/src" "api/src"
        upload "backend/package.json" "api/package.json"

        # Shared
        upload_dir "shared/src" "api/shared/src"
        upload "shared/package.json" "api/shared/package.json"

        # Package root
        upload "package.json" "package.json"

        echo -e "\n${GREEN}Upload complet terminé !${NC}"
        ;;

    4)
        echo -e "\n${YELLOW}Entrez le chemin local du fichier:${NC}"
        read -r local_file
        echo -e "${YELLOW}Entrez le chemin distant (ex: public/index.html):${NC}"
        read -r remote_file

        if [ -f "$local_file" ]; then
            upload "$local_file" "$remote_file"
        else
            echo -e "${RED}Fichier introuvable: $local_file${NC}"
            exit 1
        fi
        ;;

    *)
        echo -e "${RED}Choix invalide${NC}"
        exit 1
        ;;
esac

echo -e "\n${BLUE}=================================${NC}"
echo -e "${GREEN}Upload terminé !${NC}"
echo -e "${BLUE}=================================${NC}"
echo ""
echo -e "URL de production: ${GREEN}https://create.myziggi.pro${NC}"
echo ""
echo -e "${YELLOW}N'oubliez pas sur le serveur:${NC}"
echo "  cd api"
echo "  npm install --production"
echo "  npm start"
echo ""
