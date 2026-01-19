# 🎉 Bienvenue ! Par où commencer ?

## 🚀 Installation et Premier Lancement

### 1. Installer les Dépendances

```bash
# À la racine du projet
npm install

# Installer jsPDF pour l'export PDF
cd frontend
npm install jspdf
cd ..
```

### 2. Lancer en Développement

```bash
# Lancer le frontend ET le backend en même temps
npm run dev
```

Votre application sera accessible sur :
- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:4000

## 📚 Documentation Disponible

| Fichier | Description |
|---------|-------------|
| **README_DEPLOIEMENT.md** | 👈 **COMMENCEZ ICI** pour le déploiement |
| **NOUVELLES_FONCTIONNALITES.md** | Liste détaillée des fonctionnalités ajoutées |
| **GUIDE_DEPLOIEMENT.md** | Guide complet de déploiement |
| **INSTALL_JSPDF.md** | Instructions d'installation de jsPDF |

## 🛠️ Scripts de Déploiement

### Tester la Connexion (Recommandé en premier)

```bash
./test-upload.sh
```

Vérifie que :
- curl est installé
- La connexion FTP fonctionne
- L'upload est possible

### Upload Complet (Recommandé)

```bash
./upload-curl.sh
```

Menu interactif pour choisir ce que vous voulez uploader.

### Upload Rapide

```bash
./quick-upload.sh
```

Upload uniquement les nouveaux fichiers des fonctionnalités avancées.

### Déploiement Complet

```bash
./deploy.sh
```

Build + Archive + Upload automatique.

## ✨ Nouvelles Fonctionnalités

### 1. Export Multi-Format
- PNG, JPG, **PDF**, SVG
- Résolutions variables (1x, 2x, 3x)
- Transparence PNG

### 2. Outils de Dessin
- Brush/Pen à main levée
- Couleurs personnalisables
- Taille de pinceau variable

### 3. Panneau des Calques
- Gestion complète des éléments
- Réorganisation z-index
- Visibilité/Verrouillage

### 4. Transformations d'Images
- Rotation 90°
- Miroir horizontal/vertical

### 5. Bibliothèque de Photos
- Interface de recherche
- Intégration Unsplash

## 🎯 Workflow Rapide

### Développement Local

```bash
# 1. Installer
npm install

# 2. Installer jsPDF
cd frontend && npm install jspdf && cd ..

# 3. Lancer
npm run dev

# 4. Développer sur http://localhost:3000
```

### Déploiement Production

```bash
# 1. Tester la connexion
./test-upload.sh

# 2. Upload
./upload-curl.sh

# 3. Sur le serveur, installer et démarrer
ssh user@server
cd api
npm install --production
npm start
```

## 🏗️ Structure du Projet

```
Create/
├── frontend/           # Application React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/    # ✨ Nouveaux composants ici
│   │   │   └── layout/
│   │   ├── hooks/         # ✨ useDrawing.ts
│   │   └── stores/        # État global
│   └── package.json       # ✨ Mis à jour avec jsPDF
│
├── backend/            # API Express + TypeScript
│   ├── src/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
│
├── shared/             # Types partagés
│   └── src/types/
│
└── Scripts de déploiement (*.sh)
```

## 🔗 Liens Utiles

- **Production** : https://create.myziggi.pro
- **FTP** : ftp.sc6pixv7011.universe.wf
- **jsPDF** : https://github.com/parallax/jsPDF
- **Unsplash API** : https://unsplash.com/developers

## ⚡ Commandes Rapides

```bash
# Développement
npm run dev              # Lancer frontend + backend
npm run dev:frontend     # Frontend seulement
npm run dev:backend      # Backend seulement

# Build
cd frontend && npm run build

# Tests
npm test                 # Lancer les tests

# Déploiement
./test-upload.sh         # Tester la connexion
./upload-curl.sh         # Upload interactif
./quick-upload.sh        # Upload rapide
```

## 🆘 Problèmes Courants

### "npm: command not found"

Installez Node.js : https://nodejs.org/

### "Permission denied" pour les scripts

```bash
chmod +x *.sh
```

### Erreur de connexion FTP

Vérifiez les identifiants dans `.env.deploy`

### jsPDF non trouvé

```bash
cd frontend
npm install jspdf
```

## 📝 Checklist Première Installation

- [ ] Node.js installé (v18+)
- [ ] `npm install` exécuté
- [ ] jsPDF installé (`cd frontend && npm install jspdf`)
- [ ] Application testée localement (`npm run dev`)
- [ ] Connexion FTP testée (`./test-upload.sh`)
- [ ] Fichiers uploadés (`./upload-curl.sh`)
- [ ] Application accessible sur https://create.myziggi.pro

---

## 🎊 C'est Parti !

Vous êtes prêt à utiliser et déployer votre application Create !

**Prochaine étape** : Lisez [README_DEPLOIEMENT.md](README_DEPLOIEMENT.md) pour déployer sur votre serveur.

---

**Développé avec ❤️ par Claude Code**
