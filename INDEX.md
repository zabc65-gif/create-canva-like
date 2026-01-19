# 📑 Index Complet - Create (Canva-like)

## 🎯 Par Où Commencer ?

### 👉 **Nouveau sur le projet ?**
Commencez par lire : **[START_HERE.md](START_HERE.md)**

### 👉 **Prêt à déployer ?**
Allez à : **[README_DEPLOIEMENT.md](README_DEPLOIEMENT.md)**

---

## 📚 Documentation

| Fichier | Description | Quand l'utiliser |
|---------|-------------|------------------|
| **[START_HERE.md](START_HERE.md)** | 🚀 Guide de démarrage rapide | Premier lancement du projet |
| **[RESUME_COMPLET.md](RESUME_COMPLET.md)** | 📋 Vue d'ensemble complète | Comprendre tout ce qui a été fait |
| **[NOUVELLES_FONCTIONNALITES.md](NOUVELLES_FONCTIONNALITES.md)** | ✨ Liste des fonctionnalités | Voir ce qui est disponible |
| **[README_DEPLOIEMENT.md](README_DEPLOIEMENT.md)** | 🚀 Guide rapide de déploiement | Déployer rapidement |
| **[GUIDE_DEPLOIEMENT.md](GUIDE_DEPLOIEMENT.md)** | 📖 Guide complet de déploiement | Configuration détaillée |
| **[INSTALL_JSPDF.md](INSTALL_JSPDF.md)** | 📦 Installation de jsPDF | Problème avec jsPDF |

---

## 🛠️ Scripts de Déploiement

### Tests et Diagnostic

| Script | Description | Commande |
|--------|-------------|----------|
| **test-upload.sh** | ✅ Teste la connexion FTP | `./test-upload.sh` |

**Utilisation** : Lancez ce script EN PREMIER pour vérifier que tout fonctionne.

### Upload sur le Serveur

| Script | Description | Quand l'utiliser | Commande |
|--------|-------------|------------------|----------|
| **upload-curl.sh** | 🎯 Upload interactif | **Recommandé** - Choisir ce qu'on upload | `./upload-curl.sh` |
| **quick-upload.sh** | ⚡ Upload rapide | Upload seulement les nouveaux fichiers | `./quick-upload.sh` |
| **deploy.sh** | 📦 Déploiement complet | Build + Archive + Upload automatique | `./deploy.sh` |
| **deploy-direct.sh** | 📁 Upload direct | Upload fichier par fichier sans archive | `./deploy-direct.sh` |

---

## 🎯 Scénarios d'Utilisation

### Scénario 1 : Premier Déploiement

```bash
# 1. Installer jsPDF
cd frontend && npm install jspdf && cd ..

# 2. Tester la connexion
./test-upload.sh

# 3. Upload complet
./upload-curl.sh
# Choisir option 3 (Tout)

# 4. Configurer sur le serveur (voir README_DEPLOIEMENT.md)
```

### Scénario 2 : Mise à Jour Rapide

```bash
# 1. Modifier le code

# 2. Rebuild frontend
cd frontend && npm run build && cd ..

# 3. Upload frontend seulement
./upload-curl.sh
# Choisir option 1 (Frontend uniquement)
```

### Scénario 3 : Upload des Nouvelles Fonctionnalités

```bash
# Upload uniquement les fichiers des nouvelles fonctionnalités
./quick-upload.sh
```

### Scénario 4 : Problème de Connexion

```bash
# Diagnostic de la connexion FTP
./test-upload.sh

# Vérifier .env.deploy
cat .env.deploy
```

---

## 📂 Structure du Projet

```
Create(Canva-like)/
│
├── 📚 Documentation
│   ├── START_HERE.md                    👈 Commencez ici
│   ├── README_DEPLOIEMENT.md
│   ├── GUIDE_DEPLOIEMENT.md
│   ├── NOUVELLES_FONCTIONNALITES.md
│   ├── INSTALL_JSPDF.md
│   ├── RESUME_COMPLET.md
│   └── INDEX.md                         👈 Ce fichier
│
├── 🛠️ Scripts de Déploiement
│   ├── test-upload.sh                   ✅ Test connexion
│   ├── upload-curl.sh                   🎯 Upload interactif
│   ├── quick-upload.sh                  ⚡ Upload rapide
│   ├── deploy.sh                        📦 Déploiement complet
│   └── deploy-direct.sh                 📁 Upload direct
│
├── 🎨 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   │   ├── ExportModal.tsx      ✨ Nouveau
│   │   │   │   ├── DrawingPanel.tsx     ✨ Nouveau
│   │   │   │   ├── LayersPanel.tsx      ✨ Nouveau
│   │   │   │   ├── PhotoLibrary.tsx     ✨ Nouveau
│   │   │   │   └── PhotoEditor.tsx      ⚡ Modifié
│   │   │   └── layout/
│   │   │       ├── EditorHeader.tsx     ⚡ Modifié
│   │   │       ├── EditorLayout.tsx     ⚡ Modifié
│   │   │       └── EditorSidebar.tsx    ⚡ Modifié
│   │   ├── hooks/
│   │   │   └── useDrawing.ts            ✨ Nouveau
│   │   └── stores/
│   │       └── editorStore.ts           ⚡ Modifié
│   └── package.json                     ⚡ jsPDF ajouté
│
├── ⚙️ Backend (Express + TypeScript)
│   └── src/
│
└── 📦 Shared (Types partagés)
    └── src/types/
```

---

## 🔍 Recherche Rapide

### Je veux...

| Action | Fichier à lire | Commande |
|--------|----------------|----------|
| **Installer le projet** | [START_HERE.md](START_HERE.md) | `npm install` |
| **Lancer en local** | [START_HERE.md](START_HERE.md) | `npm run dev` |
| **Installer jsPDF** | [INSTALL_JSPDF.md](INSTALL_JSPDF.md) | `cd frontend && npm install jspdf` |
| **Tester la connexion FTP** | - | `./test-upload.sh` |
| **Déployer pour la première fois** | [README_DEPLOIEMENT.md](README_DEPLOIEMENT.md) | `./upload-curl.sh` |
| **Mettre à jour le frontend** | - | `./upload-curl.sh` (option 1) |
| **Comprendre les nouvelles fonctionnalités** | [NOUVELLES_FONCTIONNALITES.md](NOUVELLES_FONCTIONNALITES.md) | - |
| **Configuration serveur complète** | [GUIDE_DEPLOIEMENT.md](GUIDE_DEPLOIEMENT.md) | - |
| **Voir tout ce qui a été fait** | [RESUME_COMPLET.md](RESUME_COMPLET.md) | - |

---

## ✨ Fonctionnalités Principales

### 1. Export Multi-Format 📥
- PNG, JPG, PDF, SVG
- Résolutions multiples
- Fichier : `frontend/src/components/editor/ExportModal.tsx`

### 2. Outils de Dessin ✏️
- Brush/Pen à main levée
- Couleurs + opacité
- Fichiers : `DrawingPanel.tsx`, `useDrawing.ts`

### 3. Panneau des Calques 📚
- Gestion complète des éléments
- Réorganisation z-index
- Fichier : `frontend/src/components/editor/LayersPanel.tsx`

### 4. Transformations d'Images 🖼️
- Rotation, miroirs
- Fichier : `frontend/src/components/editor/PhotoEditor.tsx`

### 5. Bibliothèque de Photos 🌅
- Interface de recherche
- Fichier : `frontend/src/components/editor/PhotoLibrary.tsx`

---

## 🚀 Commandes Essentielles

```bash
# Installation
npm install
cd frontend && npm install jspdf && cd ..

# Développement
npm run dev                 # Lancer frontend + backend

# Build
cd frontend && npm run build

# Tests de déploiement
./test-upload.sh           # Tester la connexion FTP

# Déploiement
./upload-curl.sh           # Interactif (recommandé)
./quick-upload.sh          # Rapide
./deploy.sh               # Complet

# Permissions (si nécessaire)
chmod +x *.sh
```

---

## 🌐 URLs et Accès

| Service | URL/Host | Usage |
|---------|----------|-------|
| **Frontend Dev** | http://localhost:3000 | Développement local |
| **Backend Dev** | http://localhost:4000 | API locale |
| **Production** | https://create.myziggi.pro | Site en production |
| **FTP** | ftp.sc6pixv7011.universe.wf | Upload des fichiers |
| **Database** | sc6pixv7011_create | Base de données MySQL |

---

## 🆘 Aide Rapide

### Problèmes Courants

| Problème | Solution | Fichier |
|----------|----------|---------|
| Permission denied sur scripts | `chmod +x *.sh` | - |
| npm not found | Installer Node.js v18+ | [START_HERE.md](START_HERE.md) |
| jsPDF error | `cd frontend && npm install jspdf` | [INSTALL_JSPDF.md](INSTALL_JSPDF.md) |
| Connexion FTP échoue | Vérifier `.env.deploy` | [GUIDE_DEPLOIEMENT.md](GUIDE_DEPLOIEMENT.md) |
| Build frontend échoue | `npm install` puis retry | [START_HERE.md](START_HERE.md) |

---

## 📞 Support

1. **Documentation** : Lire les fichiers .md appropriés
2. **Tests** : `./test-upload.sh`
3. **Logs** : `npm run dev` pour voir les erreurs

---

## ✅ Checklist Rapide

### Installation
- [ ] Node.js installé
- [ ] `npm install` exécuté
- [ ] jsPDF installé
- [ ] App testée localement

### Déploiement
- [ ] Test FTP OK (`./test-upload.sh`)
- [ ] Fichiers uploadés
- [ ] App accessible en production

---

**🎉 Tout est prêt ! Commencez par [START_HERE.md](START_HERE.md)**

---

**Dernière mise à jour** : Janvier 2026
**Version** : 0.2.0
**Développé par** : Claude Code
