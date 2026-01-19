#!/bin/bash
# Script pour corriger les chemins absolus en chemins relatifs dans index.html

cd "$(dirname "$0")/dist"

# Remplacer les chemins absolus par des chemins relatifs
sed -i '' 's|"/assets/|"./assets/|g' index.html
sed -i '' 's|"/favicon.svg"|"./favicon.svg"|g' index.html

echo "✓ Chemins corrigés en relatifs dans index.html"
