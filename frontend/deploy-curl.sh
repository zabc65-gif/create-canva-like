#!/bin/bash

# Script de déploiement FTP optimisé avec curl
# Méthode fiable testée et validée

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

# Fonction pour uploader un fichier avec retry
upload_file() {
  local file=$1
  local remote_path=$2
  local max_attempts=3
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    if curl --ftp-create-dirs --retry 3 --retry-delay 2 --max-time 120 \
           -T "$file" "ftp://$FTP_USER:$FTP_PASS@$FTP_HOST$remote_path" 2>/dev/null; then
      echo "   ✓ $file"
      return 0
    else
      echo "   ⚠ Tentative $attempt/$max_attempts échouée pour $file"
      attempt=$((attempt + 1))
      sleep 2
    fi
  done

  echo "   ✗ Échec définitif: $file"
  return 1
}

# Upload index.html
echo ""
echo "📄 Upload index.html..."
upload_file "$LOCAL_DIR/index.html" "$FTP_DIR/index.html"

# Upload favicon
echo ""
echo "🎨 Upload favicon.svg..."
upload_file "$LOCAL_DIR/favicon.svg" "$FTP_DIR/favicon.svg"

# Upload assets CSS
echo ""
echo "📦 Upload CSS..."
for file in "$LOCAL_DIR/assets"/*.css; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    upload_file "$file" "$FTP_DIR/assets/$filename"
  fi
done

# Upload assets JS (un par un avec pause)
echo ""
echo "📦 Upload JavaScript..."
for file in "$LOCAL_DIR/assets"/*.js; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "   Uploading $filename..."
    upload_file "$file" "$FTP_DIR/assets/$filename"
    sleep 1  # Pause entre chaque fichier JS
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Déploiement terminé!"
echo "🌐 Votre site: https://create.myziggi.pro"
echo ""
