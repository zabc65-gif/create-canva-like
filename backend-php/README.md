# Backend PHP pour Create

Ce backend PHP est conçu pour fonctionner sur o2switch avec MySQL.

## Déploiement

### 1. Initialiser la base de données

Connectez-vous à phpMyAdmin sur o2switch et:
1. Sélectionnez la base de données `sc6pixv7011_create`
2. Exécutez le contenu du fichier `init-database.sql`

### 2. Uploader les fichiers

Uploadez le dossier `api/` sur le serveur FTP dans un sous-dossier, par exemple:
```
/api/
  auth/
    register.php
    login.php
  user/
    projects.php
    project.php
  config/
    database.php
  utils/
    jwt.php
  .htaccess
```

### 3. Mettre à jour le frontend

Modifiez `/Users/user/Documents/Développement/Create(Canva-like)/frontend/.env`:
```env
VITE_API_URL=https://create.myziggi.pro/api
```

Puis rebuild et redéployez:
```bash
cd frontend
npm run build
# Upload dist/ vers FTP
```

## Structure de l'API

### Authentification

```
POST https://create.myziggi.pro/api/auth/register
POST https://create.myziggi.pro/api/auth/login
```

### Projets

```
GET    https://create.myziggi.pro/api/user/projects
POST   https://create.myziggi.pro/api/user/projects
GET    https://create.myziggi.pro/api/user/projects/{id}
PUT    https://create.myziggi.pro/api/user/projects/{id}
DELETE https://create.myziggi.pro/api/user/projects/{id}
```

## Configuration

Les identifiants de la base de données sont dans `api/config/database.php`:
- Host: localhost
- Database: sc6pixv7011_create
- User: sc6pixv7011_CreateBueBe
- Password: CreateBueBe79$

## Sécurité

- Mots de passe hashés avec `password_hash()` (bcrypt)
- JWT pour l'authentification
- Validation des entrées
- Protection CSRF via tokens
- CORS configuré

## Test Local (Optionnel)

Pour tester en local avec PHP:
```bash
cd backend-php
php -S localhost:8000 -t api
```

Puis mettez à jour `frontend/.env`:
```env
VITE_API_URL=http://localhost:8000
```
