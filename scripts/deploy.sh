#!/bin/bash

# Script de déploiement FTP pour Create
# Usage: ./scripts/deploy.sh

set -e

# Charger les variables d'environnement
if [ -f ".env.deploy" ]; then
    export $(cat .env.deploy | grep -v '^#' | xargs)
else
    echo "❌ Fichier .env.deploy non trouvé"
    echo "Créez le fichier avec les variables FTP_HOST, FTP_USER, FTP_PASSWORD"
    exit 1
fi

# Vérifier les variables requises
if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ] || [ -z "$FTP_PASSWORD" ]; then
    echo "❌ Variables FTP manquantes dans .env.deploy"
    exit 1
fi

echo "🚀 Déploiement de Create vers $FTP_HOST"

# Build du frontend
echo "📦 Build du frontend..."
cd frontend
npm run build
cd ..

# Créer un fichier .htaccess pour le SPA
cat > frontend/dist/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Compression GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
EOF

echo "📤 Upload via FTP..."

# Upload via lftp (plus fiable que ftp standard)
if command -v lftp &> /dev/null; then
    lftp -u "$FTP_USER","$FTP_PASSWORD" "$FTP_HOST" << EOF
set ssl:verify-certificate no
mirror -R --delete --verbose frontend/dist/ /
bye
EOF
else
    # Alternative avec ncftpput si lftp n'est pas disponible
    if command -v ncftpput &> /dev/null; then
        ncftpput -R -v -u "$FTP_USER" -p "$FTP_PASSWORD" "$FTP_HOST" / frontend/dist/*
    else
        echo "⚠️  lftp ou ncftpput requis pour le déploiement"
        echo "Installez avec: brew install lftp"
        echo ""
        echo "Ou uploadez manuellement le contenu de frontend/dist/"
        exit 1
    fi
fi

echo "✅ Déploiement terminé!"
echo "🌐 Votre site est disponible sur: $PRODUCTION_URL"
