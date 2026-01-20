#!/bin/bash

# Script de déploiement via SFTP
HOST="ftp.cluster030.hosting.ovh.net"
USER="ziggi-create"
PASS="e98kHUxZbv9ksq"
REMOTE_DIR="/www"
LOCAL_DIR="/Users/user/Documents/Développement/Create(Canva-like)/frontend/dist"

echo "🚀 Déploiement vers $HOST..."

# Créer un fichier de commandes SFTP
cat > /tmp/sftp_commands.txt << EOF
cd $REMOTE_DIR
put -r $LOCAL_DIR/*
bye
EOF

# Exécuter SFTP avec le fichier de commandes
sshpass -p "$PASS" sftp -oBatchMode=no -b /tmp/sftp_commands.txt $USER@$HOST

# Nettoyer
rm /tmp/sftp_commands.txt

echo "✅ Déploiement terminé!"
