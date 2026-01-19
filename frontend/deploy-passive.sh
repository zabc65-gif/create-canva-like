#!/bin/bash

# Script de déploiement FTP avec mode passif explicite
# MÉTHODE FIABLE - À CONSERVER

FTP_HOST="ftp.cluster026.hosting.ovh.net"
FTP_USER="myziggi.pro"
FTP_PASS="Tintinlecoquin67!"
FTP_DIR="/www/create"
LOCAL_DIR="dist"

echo "🚀 Déploiement sur create.myziggi.pro (Mode Passif)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")"

if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌ Erreur: Le dossier dist n'existe pas"
  exit 1
fi

# Fonction d'upload avec mode passif et verbose minimal
upload_file() {
  local file=$1
  local remote_path=$2

  curl --ftp-pasv \
       --ftp-create-dirs \
       --connect-timeout 30 \
       --max-time 180 \
       --retry 2 \
       --retry-delay 3 \
       -T "$file" \
       "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$remote_path" 2>&1 | grep -q "100\|226\|Transfer complete" && echo "✓" || echo "✗"
}

# Upload index.html
echo -n "📄 index.html... "
result=$(upload_file "$LOCAL_DIR/index.html" "$FTP_DIR/index.html")
echo "$result"

# Upload favicon
echo -n "🎨 favicon.svg... "
result=$(upload_file "$LOCAL_DIR/favicon.svg" "$FTP_DIR/favicon.svg")
echo "$result"

# Upload CSS
echo ""
echo "📦 Upload CSS:"
for file in "$LOCAL_DIR/assets"/*.css; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo -n "   $filename... "
    result=$(upload_file "$file" "$FTP_DIR/assets/$filename")
    echo "$result"
  fi
done

# Upload JS
echo ""
echo "📦 Upload JavaScript:"
for file in "$LOCAL_DIR/assets"/*.js; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo -n "   $filename... "
    result=$(upload_file "$file" "$FTP_DIR/assets/$filename")
    echo "$result"
    sleep 2
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Déploiement terminé!"
echo "🌐 https://create.myziggi.pro"
