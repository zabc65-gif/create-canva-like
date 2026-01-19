# 🚀 Guide de Démarrage Rapide

## Installation

### 1. Cloner le projet
```bash
git clone https://github.com/zabc65-gif/create-canva-like.git
cd create-canva-like
```

### 2. Installer les dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configuration (Optionnel)

Les fichiers `.env` sont déjà créés avec les valeurs par défaut. Aucune configuration supplémentaire n'est nécessaire pour le développement local.

## Démarrage

### Option 1: Script automatique (Recommandé)

```bash
./start-with-auth.sh
```

Ce script démarre automatiquement le backend et le frontend.

### Option 2: Démarrage manuel

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## Accès à l'application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/api/health

## Premiers Pas

### 1. Créer un compte

1. Accédez à http://localhost:5173
2. Cliquez sur "Créer un compte"
3. Remplissez le formulaire:
   - Nom d'utilisateur
   - Email
   - Mot de passe (minimum 6 caractères)
4. Vous êtes automatiquement connecté et redirigé vers "Mes projets"

### 2. Créer votre premier projet

1. Depuis "Mes projets", cliquez sur "Nouveau projet"
2. Choisissez un format (Instagram, Story, etc.) ou une taille personnalisée
3. L'éditeur s'ouvre avec votre nouveau projet

### 3. Utiliser l'éditeur

#### Outils disponibles:
- **Sélection (V)**: Sélectionner et déplacer des éléments
- **Texte (T)**: Ajouter du texte
- **Formes (S)**: Ajouter des rectangles, cercles, etc.
- **Dessin (D)**: Dessiner à main levée
- **Déplacer (H)**: Déplacer la vue du canvas

#### Sidebar gauche:
- **Éléments**: Ajouter des formes de base
- **Texte**: Ajouter et styliser du texte
- **Images**: Uploader ou chercher des images (Unsplash)
- **Calques**: Gérer l'ordre des éléments

#### Sidebar droite (quand élément sélectionné):
- Modifier les propriétés (taille, position, couleur)
- Appliquer des filtres (images)
- Gérer l'ordre d'empilement (Z-index)

#### Header:
- **Sauvegarder**: Sauvegarde manuelle immédiate
- **Exporter**: Télécharger en PNG, JPEG ou PDF
- **Undo/Redo**: Annuler/Rétablir les actions
- **Zoom**: Ajuster le niveau de zoom

### 4. Sauvegarde automatique

Vos projets sont **automatiquement sauvegardés toutes les 30 secondes** quand vous êtes connecté. Aucune action requise!

### 5. Retrouver vos projets

1. Cliquez sur le logo "C" ou "Mes projets" dans le header
2. Tous vos projets sont listés par date de modification
3. Cliquez sur "Ouvrir" pour continuer l'édition
4. Cliquez sur l'icône poubelle pour supprimer un projet

## Fonctionnalités Mobile

L'application est entièrement responsive:

- **Pinch-to-zoom**: Zoomer/dézoomer avec 2 doigts
- **Pan**: Déplacer la vue avec 2 doigts
- **Menus adaptatifs**: Les sidebars deviennent des modals
- **Auto-fermeture**: Les menus se ferment automatiquement après ajout d'élément

## Raccourcis Clavier

- **V**: Mode Sélection
- **T**: Mode Texte
- **S**: Mode Formes
- **D**: Mode Dessin
- **H**: Mode Déplacer
- **Cmd/Ctrl + Z**: Annuler
- **Cmd/Ctrl + Shift + Z**: Rétablir
- **Suppr**: Supprimer l'élément sélectionné

## Structure du Projet

```
create-canva-like/
├── backend/               # API Node.js + Express
│   ├── data/             # Base de données SQLite
│   ├── src/
│   │   ├── middleware/   # Auth JWT
│   │   ├── routes/       # API endpoints
│   │   └── services/     # Business logic
│   └── uploads/          # Fichiers uploadés
├── frontend/             # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/   # Composants UI
│   │   ├── pages/        # Pages de l'app
│   │   ├── stores/       # State management (Zustand)
│   │   ├── hooks/        # Custom hooks
│   │   └── services/     # API client
│   └── public/
└── shared/               # Types TypeScript partagés
```

## Technologies Utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build
- **Fabric.js** pour le canvas
- **Zustand** pour le state management
- **React Router** pour la navigation
- **Tailwind CSS** pour le styling
- **Lucide React** pour les icônes

### Backend
- **Node.js** + Express
- **SQLite** pour la base de données
- **bcryptjs** pour le hash des mots de passe
- **jsonwebtoken** pour l'authentification
- **TypeScript** pour la sécurité du typage

## Dépannage

### Le backend ne démarre pas

```bash
cd backend
rm -rf node_modules
npm install
npm run dev
```

### Le frontend ne démarre pas

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

### Base de données corrompue

```bash
cd backend
rm data/create.db
npm run dev  # La DB sera recréée automatiquement
```

### Port déjà utilisé

Si les ports 4000 ou 5173 sont déjà utilisés:

```bash
# Trouver et tuer le processus
lsof -ti:4000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Frontend
```

## Support et Contribution

- **Issues**: https://github.com/zabc65-gif/create-canva-like/issues
- **Discussions**: https://github.com/zabc65-gif/create-canva-like/discussions

## Documentation Complète

- [README_AUTH.md](./README_AUTH.md) - Détails sur l'authentification et l'API
- [README.md](./README.md) - Documentation principale

## Prochaines Étapes

Maintenant que vous maîtrisez les bases:

1. ✅ Créez plusieurs projets
2. ✅ Testez les différents outils et formats
3. ✅ Explorez les filtres d'images
4. ✅ Exportez vos créations
5. 📱 Testez sur mobile!

Bon design! 🎨✨
