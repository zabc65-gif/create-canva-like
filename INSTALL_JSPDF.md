# Installation de jsPDF pour l'export PDF

## Installation

Exécutez cette commande dans le dossier `frontend` :

```bash
cd frontend
npm install jspdf
```

## Alternative avec yarn

```bash
cd frontend
yarn add jspdf
```

## Alternative avec pnpm

```bash
cd frontend
pnpm add jspdf
```

## Vérification

Après l'installation, le fichier `frontend/package.json` devrait contenir :

```json
{
  "dependencies": {
    "jspdf": "^2.5.1",
    ...
  }
}
```

## Utilisation

Le composant `ExportModal.tsx` est déjà configuré pour utiliser jsPDF.
Aucune configuration supplémentaire n'est nécessaire.
