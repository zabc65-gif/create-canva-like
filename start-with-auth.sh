#!/bin/bash

echo "🚀 Démarrage de Create avec authentification..."
echo ""

# Couleurs
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour démarrer le backend
start_backend() {
  cd backend
  echo -e "${BLUE}📦 Démarrage du backend API...${NC}"
  npm run dev &
  BACKEND_PID=$!
  cd ..
  echo -e "${GREEN}✅ Backend PID: $BACKEND_PID${NC}"
  echo ""
}

# Fonction pour démarrer le frontend
start_frontend() {
  cd frontend
  echo -e "${BLUE}🎨 Démarrage du frontend...${NC}"
  npm run dev &
  FRONTEND_PID=$!
  cd ..
  echo -e "${GREEN}✅ Frontend PID: $FRONTEND_PID${NC}"
  echo ""
}

# Démarrer les services
start_backend
sleep 3
start_frontend

echo ""
echo -e "${GREEN}🎉 Application démarrée!${NC}"
echo ""
echo "📍 Backend:  http://localhost:4000"
echo "📍 Frontend: http://localhost:5173"
echo ""
echo "💡 Pour arrêter: Ctrl+C puis exécuter:"
echo "   kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Attendre
wait
