# Guide de soumission Unsplash - Production

## ✅ Application déjà créée

**Application ID**: 859180
**Access Key**: 6N8T82TtotPpNxKEV_4BhlCJgW2_VMwbL-_er5UJ0S4
**Status**: Development (50 req/hour) → À passer en Production (5000 req/hour)

## 📝 Informations pour la demande de production

### Nom de l'application
```
Create - Design Editor
```

### Description
```
Create est une plateforme de création graphique en ligne qui permet aux utilisateurs de créer des designs professionnels pour les réseaux sociaux, l'impression et le web.

L'intégration Unsplash enrichit l'expérience utilisateur en donnant accès à des millions de photos haute qualité gratuites pour illustrer leurs créations. Les utilisateurs peuvent rechercher, prévisualiser et insérer des photos directement dans leurs projets de design.

Fonctionnalités principales :
• Éditeur graphique basé sur canvas HTML5
• Bibliothèque de photos Unsplash intégrée avec recherche en temps réel
• Retouche photo (filtres, recadrage, rotation, ordre d'empilement)
• Export en PNG/JPG haute qualité
• Gestion des calques et éléments
• Templates prédéfinis pour réseaux sociaux

L'application respecte scrupuleusement toutes les guidelines Unsplash :
✓ Photos hotlinkées depuis les URLs Unsplash originales
✓ Événement de téléchargement déclenché pour chaque photo utilisée
✓ Attribution complète "Photo by [Nom] on Unsplash" avec liens UTM
✓ Design et nom totalement distincts d'Unsplash
✓ Licence Unsplash mentionnée dans les CGU
```

### URL de l'application
```
https://create.myziggi.pro
```

### URL de la bibliothèque de photos
```
https://create.myziggi.pro/editor?type=design
(Cliquer sur l'onglet "Photos" dans la sidebar gauche)
```

### URL des CGU
```
https://create.myziggi.pro/terms
```

## 📸 Captures d'écran à fournir

### 1. Page d'accueil
**Localisation**: https://create.myziggi.pro
**Ce qui doit être visible**:
- Logo et nom "Create" (pas d'utilisation du nom Unsplash)
- Design visuel distinct d'Unsplash
- Options de création de projet

### 2. Bibliothèque de photos - Vue d'ensemble
**Localisation**: Éditeur → Onglet "Photos"
**Ce qui doit être visible**:
- Grille de photos Unsplash
- Barre de recherche
- Message "Photos gratuites fournies par Unsplash"

### 3. Attribution au survol d'une photo
**Localisation**: Éditeur → Onglet "Photos" → Survoler une photo
**Ce qui doit être visible**:
- Format exact : "Photo by [Nom du photographe] on Unsplash"
- Liens cliquables vers le photographe ET Unsplash
- Icône de lien externe

### 4. Photo insérée dans le canvas
**Localisation**: Éditeur → Après avoir sélectionné une photo
**Ce qui doit être visible**:
- Photo affichée sur le canvas
- URL de la photo dans les DevTools (montrer qu'elle provient d'images.unsplash.com)

### 5. Section de licence dans le footer
**Localisation**: Éditeur → Onglet "Photos" → Footer
**Ce qui doit être visible**:
- Message sur la licence Unsplash
- Lien vers https://unsplash.com/license

## 🔍 Points de vérification techniques

### Hotlinking ✅
```typescript
// Fichier: PhotoLibrary.tsx
src: photo.urls.regular  // URL directe depuis Unsplash
```
**Vérification**: Inspecter une image dans le canvas, l'URL doit être `images.unsplash.com/...`

### Trigger de téléchargement ✅
```typescript
// Fichier: PhotoLibrary.tsx + unsplash.ts
if (photo.links.download_location) {
  triggerUnsplashDownload(photo.links.download_location);
}
```
**Vérification**: Dans DevTools Network, chercher une requête vers `/download` quand une photo est sélectionnée

### Attribution ✅
```tsx
Photo by [nom] on Unsplash
```
**Vérification**: Survoler une photo dans la grille, l'attribution doit apparaître

### Liens UTM ✅
```typescript
?utm_source=create&utm_medium=referral
```
**Vérification**: Tous les liens vers Unsplash doivent contenir ces paramètres UTM

## 📊 Statistiques d'utilisation estimées

**Utilisateurs attendus**: 100-500/mois (phase initiale)
**Requêtes estimées**:
- Chargement photos populaires: ~500-1000/mois
- Recherches: ~1000-5000/mois
- Downloads déclenchés: ~500-2000/mois

**Total estimé**: ~2000-8000 requêtes/mois
**Pic horaire**: ~50-100 requêtes/heure (bien sous la limite de 5000/h en production)

## 🎯 Checklist finale avant soumission

- [x] Application créée (ID: 859180)
- [x] Clé API configurée et testée
- [x] Hotlinking des photos implémenté
- [x] Trigger de téléchargement implémenté
- [x] Attribution "Photo by X on Unsplash" avec liens
- [x] Liens UTM ajoutés
- [x] Nom et design distincts d'Unsplash
- [x] CGU en ligne mentionnant Unsplash
- [x] Application déployée et accessible publiquement
- [ ] 5 captures d'écran préparées
- [ ] Soumission sur https://unsplash.com/oauth/applications/859180

## 🚀 Étapes de soumission

1. **Aller sur le portail**: https://unsplash.com/oauth/applications/859180

2. **Cliquer sur "Apply for production"**

3. **Remplir le formulaire**:
   - Cocher toutes les cases de la checklist
   - Uploader les 5 captures d'écran
   - Copier-coller le nom et la description ci-dessus

4. **Soumettre la demande**

5. **Attendre l'approbation** (généralement 1-5 jours ouvrés)

## 📞 En cas de questions

Si Unsplash demande des clarifications:

**Contact développeur**: [Votre email]
**Documentation complète**: Voir `UNSPLASH_PRODUCTION.md`
**Code source**: Disponible pour review si nécessaire

## ⚠️ Important

- **NE PAS** committer le fichier `.env` avec les clés API
- Les clés sont déjà dans `.gitignore`
- Pour déploiement: utiliser les variables d'environnement du serveur
- Régénérer les clés si elles sont compromises

## 🎉 Après approbation

Une fois approuvé:
1. Le rate limit passera automatiquement à 5000 req/heure
2. Pas besoin de modifier le code
3. L'application fonctionnera avec les mêmes clés API
4. Monitoring via le dashboard Unsplash: https://unsplash.com/oauth/applications/859180/stats
