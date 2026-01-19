#!/bin/bash

# Script de déploiement FTP ultra-agressif avec toutes les options de contournement

FTP_HOST="ftp.cluster026.hosting.ovh.net"
FTP_USER="myziggi.pro"
FTP_PASS="Tintinlecoquin67!"
FTP_DIR="/www/create"
LOCAL_DIR="dist"

echo "🚀 Déploiement AGRESSIF sur create.myziggi.pro"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")"

# Fonction d'upload ultra-agressive
upload_aggressive() {
  local file=$1
  local remote_path=$2

  # Options agressives :
  # --ftp-pasv : mode passif
  # --disable-epsv : désactiver EPSV
  # --ftp-skip-pasv-ip : ignorer l'IP passive
  # -1 : forcer HTTP/1.0 (pas applicable mais garde compatibilité)
  # --no-keepalive : pas de keep-alive
  # --tcp-nodelay : désactiver Nagle

  timeout 60 curl \
    --ftp-pasv \
    --disable-epsv \
    --ftp-skip-pasv-ip \
    --no-keepalive \
    --tcp-nodelay \
    --connect-timeout 10 \
    --max-time 120 \
    --speed-time 30 \
    --speed-limit 100 \
    --ftp-create-dirs \
    -T "$file" \
    "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$remote_path" 2>&1 | grep -q "100\|226\|bytes" && echo "✓" || echo "✗"
}

# Upload index.html
echo -n "📄 index.html... "
upload_aggressive "$LOCAL_DIR/index.html" "$FTP_DIR/index.html"

# Upload favicon
echo -n "🎨 favicon.svg... "
upload_aggressive "$LOCAL_DIR/favicon.svg" "$FTP_DIR/favicon.svg"

# Upload CSS
echo ""
echo "📦 CSS:"
for file in "$LOCAL_DIR/assets"/*.css; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo -n "   $filename... "
    upload_aggressive "$file" "$FTP_DIR/assets/$filename"
  fi
done

# Upload JS
echo ""
echo "📦 JavaScript:"
for file in "$LOCAL_DIR/assets"/*.js; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo -n "   $filename... "
    upload_aggressive "$file" "$FTP_DIR/assets/$filename"
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Tentative terminée!"
echo "🌐 https://create.myziggi.pro"
