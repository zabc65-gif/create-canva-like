# Application Unsplash - Production Ready

## Informations de l'application

**Nom de l'application**: Create - Design Editor
**URL**: https://create.myziggi.pro
**Description**: Plateforme de création graphique en ligne permettant aux utilisateurs de créer, éditer et exporter des designs professionnels. L'intégration Unsplash permet aux utilisateurs d'accéder à une bibliothèque de photos de haute qualité pour enrichir leurs créations.

## Checklist de conformité Unsplash

### ✅ 1. Hotlink photos
**Status**: ✅ Conforme

Les photos sont hotlinkées directement depuis les URLs Unsplash originales:
```typescript
// Code: PhotoLibrary.tsx, ligne 166
src: photo.urls.regular,  // URL directe Unsplash
```

Nous utilisons `photo.urls.regular` fourni par l'API Unsplash sans modification ni re-upload.

### ✅ 2. Trigger downloads
**Status**: ✅ Conforme

Chaque fois qu'un utilisateur sélectionne une photo, nous déclenchons l'événement de téléchargement:

```typescript
// Code: PhotoLibrary.tsx, lignes 186-189
if (photo.links.download_location) {
  triggerUnsplashDownload(photo.links.download_location);
}

// Code: unsplash.ts, lignes 9-18
export async function triggerUnsplashDownload(downloadLocation: string) {
  if (!UNSPLASH_ACCESS_KEY) return;

  try {
    await fetch(downloadLocation, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
  } catch (error) {
    console.error('Error triggering Unsplash download:', error);
  }
}
```

### ✅ 3. Logo et nom distinct
**Status**: ✅ Conforme

- **Nom de l'app**: "Create" (pas "Unsplash" ou similaire)
- **Branding**: Design visuel entièrement distinct d'Unsplash
- **Couleurs**: Schéma de couleurs personnalisé (primary, accent)
- **Logo**: Pas d'utilisation du logo Unsplash

### ✅ 4. Description et nom précis
**Status**: ✅ Conforme

**Nom**: Create - Design Editor

**Description détaillée**:
Create est une plateforme de création graphique en ligne qui permet aux utilisateurs de créer des designs professionnels pour les réseaux sociaux, l'impression et le web. L'intégration Unsplash enrichit l'expérience utilisateur en donnant accès à des millions de photos haute qualité pour illustrer leurs créations. Les utilisateurs peuvent rechercher, prévisualiser et insérer des photos directement dans leurs projets de design.

**Fonctionnalités principales**:
- Éditeur graphique basé sur canvas (Fabric.js)
- Bibliothèque de photos Unsplash intégrée avec recherche
- Retouche photo (filtres, recadrage, rotation)
- Export en PNG/JPG
- Gestion des calques et ordre d'empilement
- Templates prédéfinis pour réseaux sociaux

### ✅ 5. Attribution du photographe et Unsplash
**Status**: ✅ Conforme

**Format d'attribution**: "Photo by [Photographer Name] on Unsplash"

**Implémentation**:
```tsx
// Code: PhotoLibrary.tsx, lignes 273-295
<p className="text-xs text-white flex items-center gap-1">
  Photo by{' '}
  <a
    href={`${photo.user.links.html}?utm_source=create&utm_medium=referral`}
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline font-medium"
  >
    {photo.user.name}
  </a>
  {' '}on{' '}
  <a
    href="https://unsplash.com?utm_source=create&utm_medium=referral"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:underline font-medium"
  >
    Unsplash
  </a>
</p>
```

**Liens UTM**: Tous les liens incluent `?utm_source=create&utm_medium=referral` pour le tracking

**Visibilité**:
- Attribution visible au survol de chaque photo dans la grille
- Attribution inclut des liens cliquables vers le profil du photographe et Unsplash
- Lien vers la licence Unsplash dans le footer de la bibliothèque de photos

## Captures d'écran

### 1. Page d'accueil
![Homepage](screenshots/homepage.png)
- Interface claire et distincte d'Unsplash
- Nom "Create" bien visible

### 2. Bibliothèque de photos Unsplash
![Photo Library](screenshots/photo-library.png)
- Grille de photos avec recherche
- Attribution "Photos gratuites fournies par Unsplash"

### 3. Attribution au survol
![Photo Attribution](screenshots/photo-attribution.png)
- Format: "Photo by [Name] on Unsplash"
- Liens vers profil photographe et Unsplash

### 4. Canvas avec photo insérée
![Canvas](screenshots/canvas-with-photo.png)
- Photo hotlinkée depuis Unsplash
- Utilisable dans le design

### 5. Footer avec licence
![Footer](screenshots/footer-license.png)
- Lien vers licence Unsplash
- Informations sur l'attribution

## Données techniques

**Endpoints utilisés**:
- `GET /photos` - Photos populaires (30 par page)
- `GET /search/photos` - Recherche de photos (30 résultats)
- `GET /photos/:id/download` - Trigger de téléchargement

**Rate limiting estimé**:
- Recherches: ~100-500 requêtes/jour (selon utilisation)
- Downloads: ~50-200 requêtes/jour
- Photos populaires: 1-10 requêtes/jour

**Raison de la demande de production**:
Nous souhaitons passer en production pour offrir une expérience utilisateur fluide sans limitation de rate limit (50 req/heure en démo). Notre application respecte toutes les guidelines Unsplash et contribue à augmenter la visibilité des photographes grâce à l'attribution appropriée et aux liens UTM.

## Conformité légale

- ✅ Respect de la licence Unsplash
- ✅ CGU disponibles sur https://create.myziggi.pro/terms
- ✅ Mention de la licence Unsplash dans les CGU
- ✅ Pas de vente des photos sans modification substantielle
- ✅ Pas de création de banque d'images concurrente

## Contact

**Développeur**: [Votre nom]
**Email**: [Votre email]
**URL de l'application**: https://create.myziggi.pro
**Documentation**: https://github.com/[votre-repo]/create

## Notes pour la soumission

Lors de la soumission de l'application sur le portail Unsplash:

1. **Application Name**: Create - Design Editor
2. **Application Description**: Utiliser la description détaillée ci-dessus
3. **Application URL**: https://create.myziggi.pro
4. **Callback URL**: Non applicable (pas d'OAuth)
5. **Screenshots**: Joindre les 5 captures d'écran listées ci-dessus

## Fichiers à vérifier

- `/frontend/src/components/editor/PhotoLibrary.tsx` - Implémentation principale
- `/frontend/src/config/unsplash.ts` - Configuration API
- `/frontend/src/pages/TermsPage.tsx` - CGU mentionnant Unsplash
- `/.env.example` - Template pour clé API

## Checklist avant soumission

- [x] Hotlinking des photos ✅
- [x] Trigger de téléchargement ✅
- [x] Nom et design distincts ✅
- [x] Description précise ✅
- [x] Attribution "Photo by X on Unsplash" ✅
- [x] Liens UTM vers photographes ✅
- [x] Lien vers Unsplash avec UTM ✅
- [x] Licence Unsplash mentionnée ✅
- [x] CGU en ligne ✅
- [x] Captures d'écran prêtes ✅
