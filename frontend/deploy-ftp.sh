#!/bin/bash

# Script de déploiement FTP optimisé
FTP_HOST="ftp.cluster026.hosting.ovh.net"
FTP_USER="myziggi.pro"
FTP_PASS="Tintinlecoquin67!"
FTP_DIR="/www/create"
LOCAL_DIR="dist"

echo "🚀 Déploiement sur create.myziggi.pro"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")"

if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌ Erreur: Le dossier dist n'existe pas"
  echo "   Exécutez 'npm run build' d'abord"
  exit 1
fi

# Upload fichiers principaux
echo ""
echo "📄 Upload index.html..."
curl -s --connect-timeout 10 -T "$LOCAL_DIR/index.html" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$FTP_DIR/index.html" && echo "   ✓ index.html" || echo "   ✗ Échec"

echo "🎨 Upload favicon.svg..."
curl -s --connect-timeout 10 -T "$LOCAL_DIR/favicon.svg" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$FTP_DIR/favicon.svg" && echo "   ✓ favicon.svg" || echo "   ✗ Échec"

# Upload assets
echo ""
echo "📦 Upload assets..."
cd "$LOCAL_DIR/assets"

for file in *.css; do
  if [ -f "$file" ]; then
    echo "   Uploading $file..."
    curl -s --connect-timeout 30 -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$FTP_DIR/assets/$file" && echo "   ✓ $file" || echo "   ✗ Échec: $file"
  fi
done

for file in *.js; do
  if [ -f "$file" ]; then
    echo "   Uploading $file..."
    curl -s --connect-timeout 60 -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$FTP_DIR/assets/$file" && echo "   ✓ $file" || echo "   ✗ Échec: $file"
    sleep 2  # Pause entre chaque gros fichier
  fi
done

cd ../..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Déploiement terminé!"
echo "🌐 Votre site: https://create.myziggi.pro"
