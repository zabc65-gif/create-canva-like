#!/bin/bash

# Script de déploiement FTP avec LES BONS identifiants
# MÉTHODE FIABLE - À CONSERVER

FTP_HOST="ftp.sc6pixv7011.universe.wf"
FTP_USER="CreateBueBe@create.myziggi.pro"
FTP_PASS="CreateBueBe79\$"
FTP_DIR="/"
LOCAL_DIR="dist"

echo "🚀 Déploiement sur create.myziggi.pro"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$(dirname "$0")"

if [ ! -d "$LOCAL_DIR" ]; then
  echo "❌ Erreur: Le dossier dist n'existe pas"
  exit 1
fi

# Fonction d'upload avec retry
upload_file() {
  local file=$1
  local remote_path=$2
  local max_attempts=3
  local attempt=1

  while [ $attempt -le $max_attempts ]; do
    if curl --ftp-create-dirs --retry 3 --retry-delay 2 --max-time 120 \
           -T "$file" --user "$FTP_USER:$FTP_PASS" "ftp://$FTP_HOST$remote_path" 2>/dev/null; then
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

# Upload .htaccess
echo ""
echo "⚙️  Upload .htaccess..."
upload_file "$LOCAL_DIR/.htaccess" "$FTP_DIR/.htaccess"

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

# Upload assets JS
echo ""
echo "📦 Upload JavaScript..."
for file in "$LOCAL_DIR/assets"/*.js; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "   Uploading $filename..."
    upload_file "$file" "$FTP_DIR/assets/$filename"
    sleep 1
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Déploiement terminé!"
echo "🌐 Votre site: https://create.myziggi.pro"
echo ""
