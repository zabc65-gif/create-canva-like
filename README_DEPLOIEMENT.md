# 🚀 Déploiement Rapide - Create

## 📝 Résumé des Scripts Disponibles

J'ai créé plusieurs scripts de déploiement via FTP avec curl. Voici comment les utiliser :

### 🎯 Script Recommandé : `upload-curl.sh`

**Le plus simple et flexible !**

```bash
./upload-curl.sh
```

Menu interactif qui vous permet de choisir :
- Frontend uniquement (rapide)
- Backend uniquement
- Tout (upload complet)
- Fichier spécifique

### ⚡ Script Rapide : `quick-upload.sh`

**Upload uniquement les nouveaux fichiers créés**

```bash
./quick-upload.sh
```

Upload les fichiers des nouvelles fonctionnalités :
- ExportModal.tsx (export PDF/PNG/JPG/SVG)
- DrawingPanel.tsx (outils de dessin)
- LayersPanel.tsx (gestion des calques)
- PhotoLibrary.tsx (bibliothèque de photos)
- package.json mis à jour (avec jsPDF)

### 📦 Script Complet : `deploy.sh`

**Création d'une archive et upload**

```bash
./deploy.sh
```

Build + Archive + Upload automatique.

### 📁 Script Direct : `deploy-direct.sh`

**Upload fichier par fichier sans archive**

```bash
./deploy-direct.sh
```

---

## 🎬 Démarrage Rapide (Première Fois)

### Étape 1 : Installer jsPDF

```bash
cd frontend
npm install jspdf
cd ..
```

### Étape 2 : Choisir votre méthode

**Option A : Upload complet (recommandé pour la première fois)**

```bash
./upload-curl.sh
# Choisir option 3 (Tout)
```

**Option B : Upload rapide des nouveaux fichiers seulement**

```bash
./quick-upload.sh
```

### Étape 3 : Configurer le serveur

Connectez-vous à votre serveur et :

```bash
# Installer les dépendances
cd api
npm install --production

# Installer jsPDF
cd ../src/frontend
npm install jspdf

# Builder le frontend
npm run build

# Démarrer le serveur
cd ../../api
npm start
```

---

## 📊 Informations Serveur

- **Host FTP** : ftp.sc6pixv7011.universe.wf
- **Port** : 21
- **User** : CreateBueBe@create.myziggi.pro
- **URL Production** : https://create.myziggi.pro

Les identifiants complets sont dans `.env.deploy` (ne pas commiter ce fichier !).

---

## 🆕 Nouvelles Fonctionnalités Ajoutées

### 1. Export Multi-Format ✨
- PNG (avec transparence)
- JPG (compressé)
- **PDF** (avec jsPDF)
- SVG (vectoriel)
- Résolutions 1x, 2x, 3x

### 2. Outils de Dessin ✏️
- Dessin à main levée
- Sélection de couleur
- Taille de pinceau variable
- Contrôle d'opacité

### 3. Panneau des Calques 📚
- Visualisation de tous les éléments
- Réorganisation (z-index)
- Visibilité/Verrouillage
- Actions rapides

### 4. Transformations d'Images 🖼️
- Rotation 90°
- Miroir horizontal/vertical
- Mode recadrage

### 5. Bibliothèque de Photos 🌅
- Interface de recherche
- Intégration Unsplash (structure prête)
- Ajout direct au canvas

---

## 🔧 Mises à Jour Futures

Pour les prochaines mises à jour :

```bash
# 1. Modifier votre code

# 2. Rebuild
cd frontend
npm run build
cd ..

# 3. Upload rapide
./upload-curl.sh
# Choisir option 1 (Frontend uniquement)
```

---

## 📚 Documentation Complète

- **NOUVELLES_FONCTIONNALITES.md** : Détails de toutes les fonctionnalités
- **GUIDE_DEPLOIEMENT.md** : Guide complet du déploiement
- **INSTALL_JSPDF.md** : Installation de jsPDF

---

## ⚠️ Important

### Avant le Premier Upload

1. Vérifiez que `.env.deploy` contient les bons identifiants
2. Installez jsPDF : `cd frontend && npm install jspdf`
3. Buildez le frontend : `npm run build`

### Sur le Serveur

1. Les fichiers seront dans `/public` (frontend) et `/api` (backend)
2. N'oubliez pas `npm install` sur le serveur
3. Configurez votre serveur web (Apache/Nginx) selon le guide

### Sécurité

- Ne commitez **jamais** `.env.deploy` sur Git
- Utilisez HTTPS en production (Let's Encrypt)
- Configurez les CORS correctement

---

## 🆘 Besoin d'Aide ?

### Problème : "Permission denied"

```bash
# Rendre les scripts exécutables
chmod +x *.sh
```

### Problème : "Connection refused"

Vérifiez :
- Que le serveur FTP est accessible
- Que les identifiants sont corrects
- Que le firewall autorise le port 21

### Problème : "npm not found" sur le serveur

```bash
# Installer Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

---

## ✅ Checklist de Déploiement

- [ ] jsPDF installé localement (`npm install jspdf`)
- [ ] Frontend buildé (`npm run build`)
- [ ] Scripts rendus exécutables (`chmod +x *.sh`)
- [ ] Upload réussi (script au choix)
- [ ] Dépendances installées sur le serveur
- [ ] Serveur Node.js démarré
- [ ] Tests sur l'URL de production

---

**Bon déploiement ! 🚀**

Si tout fonctionne, vous verrez votre application sur https://create.myziggi.pro avec toutes les nouvelles fonctionnalités.
