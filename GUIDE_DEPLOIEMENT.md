# Guide de Déploiement - Create (Canva-like)

## 📋 Prérequis

- Node.js installé localement
- Accès FTP au serveur de production
- Les identifiants FTP configurés dans `.env.deploy`

## 🚀 Méthodes de Déploiement

### Méthode 1 : Script Interactif (Recommandé)

Le script `upload-curl.sh` est la méthode la plus simple :

```bash
./upload-curl.sh
```

Vous aurez le choix entre :
1. **Frontend uniquement** - Upload rapide du build frontend
2. **Backend uniquement** - Upload du code serveur
3. **Tout** - Upload complet (frontend + backend + shared)
4. **Fichier spécifique** - Upload d'un seul fichier

### Méthode 2 : Script Automatique avec Archive

```bash
./deploy.sh
```

Ce script :
1. Build le frontend
2. Prépare le backend
3. Crée une archive compressée
4. Upload l'archive sur le serveur

### Méthode 3 : Script Upload Direct

```bash
./deploy-direct.sh
```

Upload fichier par fichier sans créer d'archive.

## 📦 Étape par Étape - Premier Déploiement

### 1. Préparation Locale

```bash
# Installer toutes les dépendances
npm install

# Installer jsPDF pour l'export PDF
cd frontend
npm install jspdf
cd ..

# Builder le frontend
cd frontend
npm run build
cd ..
```

### 2. Upload sur le Serveur

```bash
# Lancer le script interactif
./upload-curl.sh

# Choisir l'option 3 (Tout)
```

### 3. Configuration sur le Serveur

Connectez-vous au serveur via SSH ou FTP et exécutez :

```bash
# Aller dans le dossier API
cd api

# Installer les dépendances de production
npm install --production

# Compiler TypeScript (si nécessaire)
npm run build

# Créer le fichier .env
cat > .env << 'EOF'
PORT=4000
NODE_ENV=production
DB_HOST=localhost
DB_NAME=sc6pixv7011_create
DB_USER=sc6pixv7011_CreateBueBe
DB_PASSWORD=CreateBueBe79$
EOF

# Démarrer le serveur
npm start
```

### 4. Configuration du Serveur Web

Configurez votre serveur web (Apache/Nginx) pour servir :
- `/public/*` → Fichiers statiques du frontend
- `/api/*` → Proxy vers Node.js (port 4000)

#### Exemple Apache (.htaccess)

```apache
# Frontend - Servir les fichiers statiques
<FilesMatch "\.(html|css|js|json|svg|png|jpg|jpeg|gif|woff|woff2|ttf)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# API - Proxy vers Node.js
RewriteEngine On
RewriteCond %{REQUEST_URI} ^/api
RewriteRule ^api/(.*)$ http://localhost:4000/api/$1 [P,L]

# SPA - Rediriger toutes les routes vers index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ /index.html [L]
```

#### Exemple Nginx

```nginx
server {
    listen 80;
    server_name create.myziggi.pro;

    root /var/www/create/public;
    index index.html;

    # Frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache statique
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🔄 Mises à Jour

Pour les mises à jour futures :

```bash
# 1. Build local
cd frontend
npm run build
cd ..

# 2. Upload uniquement le frontend
./upload-curl.sh
# Choisir option 1

# 3. Redémarrer le serveur Node.js (si modifications backend)
ssh user@server
pm2 restart create
```

## 🛠️ Gestion du Serveur Node.js

### Avec PM2 (Recommandé)

```bash
# Installer PM2
npm install -g pm2

# Démarrer l'application
pm2 start api/src/index.js --name create

# Sauvegarder la configuration
pm2 save

# Auto-démarrage au boot
pm2 startup
```

### Avec systemd

Créer `/etc/systemd/system/create.service` :

```ini
[Unit]
Description=Create API Server
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/create/api
ExecStart=/usr/bin/npm start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Activer :
```bash
sudo systemctl enable create
sudo systemctl start create
```

## 📊 Vérification du Déploiement

### Tests après déploiement

1. **Frontend** : Ouvrir https://create.myziggi.pro
2. **API** : Tester https://create.myziggi.pro/api/health

```bash
curl https://create.myziggi.pro/api/health
# Devrait retourner: {"status":"ok","timestamp":"..."}
```

### Logs

```bash
# Avec PM2
pm2 logs create

# Avec systemd
sudo journalctl -u create -f
```

## 🔒 Sécurité

### HTTPS

Installer un certificat SSL avec Let's Encrypt :

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d create.myziggi.pro
```

### Fichiers sensibles

Assurez-vous que `.env` et `.env.deploy` ne sont **jamais** uploadés sur le serveur public.

## 🐛 Dépannage

### Problème : "npm: command not found"

```bash
# Installer Node.js sur le serveur
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Problème : "Permission denied"

```bash
# Donner les bonnes permissions
sudo chown -R www-data:www-data /var/www/create
sudo chmod -R 755 /var/www/create
```

### Problème : Port 4000 déjà utilisé

```bash
# Changer le port dans .env
PORT=4001

# Ou arrêter le processus existant
lsof -ti:4000 | xargs kill -9
```

## 📱 Contact & Support

- **URL Production** : https://create.myziggi.pro
- **FTP Host** : ftp.sc6pixv7011.universe.wf
- **Database** : sc6pixv7011_create

---

**Déploiement configuré par Claude Code**
Dernière mise à jour : Janvier 2026
