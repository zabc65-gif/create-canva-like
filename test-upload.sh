#!/bin/bash

# Script de test de connexion FTP et upload d'un fichier de test

# Configuration FTP
FTP_HOST="ftp.sc6pixv7011.universe.wf"
FTP_USER="CreateBueBe@create.myziggi.pro"
FTP_PASSWORD="CreateBueBe79\$"

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Test de Connexion FTP${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. Vérifier que curl est installé
echo -e "${YELLOW}[1/4] Vérification de curl...${NC}"
if command -v curl &> /dev/null; then
    echo -e "${GREEN}✓ curl est installé${NC}"
    curl --version | head -n 1
else
    echo -e "${RED}✗ curl n'est pas installé${NC}"
    echo "Installez curl avec: brew install curl (macOS) ou apt install curl (Linux)"
    exit 1
fi
echo ""

# 2. Test de connexion FTP
echo -e "${YELLOW}[2/4] Test de connexion au serveur FTP...${NC}"
curl --user "$FTP_USER:$FTP_PASSWORD" \
     "ftp://$FTP_HOST/" \
     --max-time 10 \
     --silent \
     --show-error \
     --list-only > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Connexion FTP réussie !${NC}"
else
    echo -e "${RED}✗ Échec de la connexion FTP${NC}"
    echo "Vérifiez :"
    echo "  - Host: $FTP_HOST"
    echo "  - User: $FTP_USER"
    echo "  - Mot de passe dans .env.deploy"
    exit 1
fi
echo ""

# 3. Liste des fichiers sur le serveur
echo -e "${YELLOW}[3/4] Liste des fichiers sur le serveur...${NC}"
echo -e "${BLUE}Contenu de la racine FTP:${NC}"
curl --user "$FTP_USER:$FTP_PASSWORD" \
     "ftp://$FTP_HOST/" \
     --silent \
     --show-error \
     --list-only | head -n 10

echo ""

# 4. Upload d'un fichier de test
echo -e "${YELLOW}[4/4] Upload d'un fichier de test...${NC}"

# Créer un fichier de test
TEST_FILE="test-$(date +%s).txt"
echo "Test upload - $(date)" > "$TEST_FILE"
echo "Ce fichier a été créé automatiquement pour tester la connexion FTP." >> "$TEST_FILE"

echo -e "Upload de $TEST_FILE..."

curl -T "$TEST_FILE" \
     --user "$FTP_USER:$FTP_PASSWORD" \
     "ftp://$FTP_HOST/test/$TEST_FILE" \
     --ftp-create-dirs \
     --progress-bar

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Upload de test réussi !${NC}"
    echo "Fichier uploadé: test/$TEST_FILE"

    # Nettoyer le fichier local
    rm -f "$TEST_FILE"
else
    echo -e "${RED}✗ Échec de l'upload de test${NC}"
    rm -f "$TEST_FILE"
    exit 1
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Tous les tests sont passés ! ✓${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "Vous pouvez maintenant utiliser les scripts de déploiement:"
echo -e "  ${GREEN}./upload-curl.sh${NC}     - Upload interactif"
echo -e "  ${GREEN}./quick-upload.sh${NC}    - Upload rapide des nouveaux fichiers"
echo -e "  ${GREEN}./deploy.sh${NC}          - Déploiement complet"
echo ""
