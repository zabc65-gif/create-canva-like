<?php
// Script pour RÉINITIALISER les tables (ATTENTION: Supprime toutes les données!)
// À exécuter via: https://create.myziggi.pro/reset-tables.php

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

    echo "<h1>⚠️ RÉINITIALISATION des tables Create</h1>";
    echo "<p style='color: red;'><strong>ATTENTION: Cette opération va SUPPRIMER toutes les données existantes!</strong></p>";
    echo "<pre>";

    // Désactiver les contraintes de clés étrangères temporairement
    $db->exec("SET FOREIGN_KEY_CHECKS = 0");
    echo "🔓 Contraintes désactivées\n";

    // Supprimer les tables existantes
    $db->exec("DROP TABLE IF EXISTS projects");
    echo "🗑️  Table 'projects' supprimée\n";

    $db->exec("DROP TABLE IF EXISTS users");
    echo "🗑️  Table 'users' supprimée\n";

    // Recréer la table users avec la bonne structure
    $db->exec("
        CREATE TABLE users (
            id VARCHAR(36) PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "✅ Table 'users' recréée\n";

    // Recréer la table projects
    $db->exec("
        CREATE TABLE projects (
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
    echo "✅ Table 'projects' recréée\n";

    // Vérifier la structure
    echo "\n📋 Structure finale de 'users':\n";
    $stmt = $db->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo "  - {$col['Field']} ({$col['Type']})\n";
    }

    echo "\n📋 Structure finale de 'projects':\n";
    $stmt = $db->query("DESCRIBE projects");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo "  - {$col['Field']} ({$col['Type']})\n";
    }

    // Réactiver les contraintes
    $db->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "🔒 Contraintes réactivées\n";

    echo "\n<strong>✅ Tables réinitialisées avec succès!</strong>\n";
    echo "\nVous pouvez maintenant:\n";
    echo "1. Créer un compte sur https://create.myziggi.pro\n";
    echo "2. SUPPRIMER ce fichier reset-tables.php du serveur!\n";
    echo "</pre>";

} catch (PDOException $e) {
    echo "<h1>❌ Erreur</h1>";
    echo "<pre>";
    echo "Erreur: " . $e->getMessage();
    echo "</pre>";
}
