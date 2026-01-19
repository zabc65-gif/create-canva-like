<?php
// Script d'initialisation de la base de données
// À exécuter UNE SEULE FOIS via le navigateur: https://create.myziggi.pro/init.php

$host = 'localhost';
$dbname = 'sc6pixv7011_create';
$username = 'sc6pixv7011_CreateBueBe';
$password = 'CreateBueBe79$';

try {
    $db = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $username,
        $password,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    echo "<h1>Initialisation de la base de données Create</h1>";
    echo "<pre>";

    // Table users
    $db->exec("
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(36) PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✅ Table 'users' créée\n";

    // Table projects
    $db->exec("
        CREATE TABLE IF NOT EXISTS projects (
            id VARCHAR(36) PRIMARY KEY,
            user_id VARCHAR(36) NOT NULL,
            name VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            data LONGTEXT NOT NULL,
            thumbnail TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_updated_at (updated_at DESC)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✅ Table 'projects' créée\n";

    echo "\n<strong>✅ Base de données initialisée avec succès!</strong>\n";
    echo "\nVous pouvez maintenant:\n";
    echo "1. Supprimer ce fichier init.php du serveur pour des raisons de sécurité\n";
    echo "2. Accéder à l'application: https://create.myziggi.pro\n";
    echo "3. Créer un compte et commencer à utiliser Create!\n";
    echo "</pre>";

} catch (PDOException $e) {
    echo "<h1>❌ Erreur</h1>";
    echo "<pre>";
    echo "Erreur de connexion: " . $e->getMessage();
    echo "</pre>";
}
