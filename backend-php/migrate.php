<?php
// Script de migration pour ajouter les colonnes manquantes
// À exécuter via: https://create.myziggi.pro/migrate.php

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

    echo "<h1>Migration de la base de données Create</h1>";
    echo "<pre>";

    // Vérifier si la colonne username existe
    $stmt = $db->query("SHOW COLUMNS FROM users LIKE 'username'");
    if ($stmt->rowCount() == 0) {
        // Ajouter la colonne username
        $db->exec("ALTER TABLE users ADD COLUMN username VARCHAR(255) NOT NULL AFTER password");
        echo "✅ Colonne 'username' ajoutée à la table users\n";
    } else {
        echo "ℹ️  La colonne 'username' existe déjà\n";
    }

    // Vérifier la structure complète de la table users
    echo "\n📋 Structure de la table 'users':\n";
    $stmt = $db->query("DESCRIBE users");
    $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($columns as $col) {
        echo "  - {$col['Field']} ({$col['Type']})\n";
    }

    echo "\n<strong>✅ Migration terminée avec succès!</strong>\n";
    echo "\n⚠️  IMPORTANT: Supprimez ce fichier migrate.php du serveur maintenant!\n";
    echo "</pre>";

} catch (PDOException $e) {
    echo "<h1>❌ Erreur</h1>";
    echo "<pre>";
    echo "Erreur: " . $e->getMessage();
    echo "</pre>";
}
