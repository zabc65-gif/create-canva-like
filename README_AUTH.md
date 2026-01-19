# Système d'Authentification et Gestion des Projets

## Vue d'ensemble

Le système permet maintenant aux utilisateurs de:
- Créer un compte et se connecter
- Sauvegarder leurs projets dans une base de données
- Accéder à leurs projets depuis n'importe quel appareil
- Rouvrir et modifier leurs projets existants

## Architecture

### Backend
- **Base de données**: SQLite (fichier `backend/data/create.db`)
- **Authentification**: JWT (JSON Web Tokens)
- **API REST**: Express.js

### Frontend
- **State Management**: Zustand avec persist
- **Auto-save**: Sauvegarde automatique toutes les 30 secondes
- **Routes protégées**: Authentification requise pour /projects

## Installation et Configuration

### 1. Backend

```bash
cd backend
npm install

# Le fichier .env est déjà configuré avec:
# - PORT=4000
# - JWT_SECRET (généré automatiquement)
# - DATABASE_PATH=./data/create.db
```

### 2. Frontend

```bash
cd frontend
# Le fichier .env est déjà configuré avec:
# - VITE_API_URL=http://localhost:4000/api
```

## Démarrage

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

Le serveur démarre sur `http://localhost:4000`

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

L'application démarre sur `http://localhost:5173`

## Fonctionnalités

### Authentification

#### Inscription (`/register`)
- Email unique
- Mot de passe minimum 6 caractères
- Nom d'utilisateur
- Génération automatique de token JWT

#### Connexion (`/login`)
- Email + mot de passe
- Token JWT valide 7 jours
- Stockage dans localStorage

### Gestion des Projets

#### Page d'accueil (`/`)
- Boutons dynamiques:
  - Non authentifié: "Se connecter" / "Créer un compte"
  - Authentifié: "Mes projets"

#### Page Mes Projets (`/projects`)
- Liste de tous les projets de l'utilisateur
- Tri par date de modification (plus récent en premier)
- Actions:
  - **Ouvrir**: Charge le projet dans l'éditeur
  - **Supprimer**: Supprime définitivement le projet

#### Éditeur (`/editor`)
- **Sauvegarde automatique**: Toutes les 30 secondes si authentifié
- **Bouton Sauvegarder**: Sauvegarde manuelle immédiate
- Indicateur visuel pendant la sauvegarde

## API Endpoints

### Authentification

```
POST /api/auth/register
Body: { email, password, username }
Response: { user, token }

POST /api/auth/login
Body: { email, password }
Response: { user, token }

GET /api/auth/me
Headers: Authorization: Bearer <token>
Response: { user }
```

### Projets Utilisateur

```
GET /api/user/projects
Headers: Authorization: Bearer <token>
Response: { projects: [...] }

GET /api/user/projects/:projectId
Headers: Authorization: Bearer <token>
Response: { project }

POST /api/user/projects
Headers: Authorization: Bearer <token>
Body: { project }
Response: { message, projectId }

PUT /api/user/projects/:projectId
Headers: Authorization: Bearer <token>
Body: { project }
Response: { message }

DELETE /api/user/projects/:projectId
Headers: Authorization: Bearer <token>
Response: { message }
```

## Structure de la Base de Données

### Table `users`
- `id` (TEXT PRIMARY KEY)
- `email` (TEXT UNIQUE)
- `password` (TEXT - hasher avec bcrypt)
- `username` (TEXT)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

### Table `projects`
- `id` (TEXT PRIMARY KEY)
- `user_id` (TEXT FOREIGN KEY)
- `name` (TEXT)
- `type` (TEXT)
- `data` (TEXT - JSON stringified)
- `thumbnail` (TEXT - optionnel)
- `created_at` (DATETIME)
- `updated_at` (DATETIME)

## Flux Utilisateur

### Nouvel Utilisateur

1. Visite `/` (HomePage)
2. Clique sur "Créer un compte"
3. Remplit le formulaire d'inscription
4. Redirection automatique vers `/projects`
5. Clique sur "Nouveau projet"
6. Création d'un projet dans l'éditeur
7. Le projet est automatiquement sauvegardé toutes les 30s
8. Retour sur `/projects` pour voir tous les projets

### Utilisateur Existant

1. Visite `/` (HomePage)
2. Clique sur "Se connecter"
3. Entre ses identifiants
4. Redirection vers `/projects`
5. Clique sur un projet existant pour le rouvrir
6. Modifications sauvegardées automatiquement

## Sécurité

- Mots de passe hashés avec `bcryptjs` (salt rounds: 10)
- Tokens JWT signés avec clé secrète
- Validation des entrées côté serveur
- Middleware d'authentification pour routes protégées
- CORS configuré pour le développement

## Déploiement

### Backend
1. Utiliser une vraie base de données (PostgreSQL recommandé)
2. Changer `JWT_SECRET` en production
3. Configurer CORS pour le domaine de production
4. Activer HTTPS

### Frontend
1. Mettre à jour `VITE_API_URL` avec l'URL de production
2. Build: `npm run build`
3. Déployer le dossier `dist/`

## Améliorations Futures

- [ ] Récupération de mot de passe par email
- [ ] Partage de projets entre utilisateurs
- [ ] Gestion d'équipes/organisations
- [ ] Versionning des projets
- [ ] Collaboration en temps réel
- [ ] Export automatique vers cloud storage
- [ ] Templates communautaires
- [ ] Limite de stockage par utilisateur
- [ ] Plans premium

## Dépannage

### Erreur "Token invalide"
- Le token a expiré (7 jours)
- Se reconnecter

### Projet non sauvegardé
- Vérifier la connexion au backend
- Vérifier les logs du navigateur (F12)
- Vérifier que vous êtes authentifié

### Base de données verrouillée
- Fermer toutes les instances du serveur backend
- Supprimer le fichier `backend/data/create.db` si nécessaire
- Redémarrer le serveur (la DB sera recréée)
