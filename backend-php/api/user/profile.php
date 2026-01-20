<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/jwt.php';

$userId = requireAuth();

// GET - Récupérer les infos du profil
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $db = getDatabase();

        $stmt = $db->prepare('SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'Utilisateur non trouvé']);
            exit;
        }

        echo json_encode($user);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la récupération du profil: ' . $e->getMessage()]);
    }
    exit;
}

// PUT - Mettre à jour les infos du profil
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);

    $email = $data['email'] ?? '';
    $username = $data['username'] ?? '';
    $currentPassword = $data['currentPassword'] ?? '';
    $newPassword = $data['newPassword'] ?? '';

    // Validation
    if (empty($email) || empty($username)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email et pseudo requis']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Email invalide']);
        exit;
    }

    try {
        $db = getDatabase();

        // Vérifier que l'utilisateur existe
        $stmt = $db->prepare('SELECT * FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            http_response_code(404);
            echo json_encode(['error' => 'Utilisateur non trouvé']);
            exit;
        }

        // Si changement de mot de passe, vérifier le mot de passe actuel
        if (!empty($newPassword)) {
            if (empty($currentPassword)) {
                http_response_code(400);
                echo json_encode(['error' => 'Mot de passe actuel requis pour changer le mot de passe']);
                exit;
            }

            if (!password_verify($currentPassword, $user['password'])) {
                http_response_code(401);
                echo json_encode(['error' => 'Mot de passe actuel incorrect']);
                exit;
            }

            if (strlen($newPassword) < 6) {
                http_response_code(400);
                echo json_encode(['error' => 'Le nouveau mot de passe doit contenir au moins 6 caractères']);
                exit;
            }
        }

        // Vérifier si l'email ou le username sont déjà utilisés par un autre utilisateur
        $stmt = $db->prepare('SELECT id FROM users WHERE (email = ? OR username = ?) AND id != ?');
        $stmt->execute([$email, $username, $userId]);
        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Cet email ou pseudo est déjà utilisé']);
            exit;
        }

        // Mettre à jour les informations
        if (!empty($newPassword)) {
            $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
            $stmt = $db->prepare('UPDATE users SET email = ?, username = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            $stmt->execute([$email, $username, $hashedPassword, $userId]);
        } else {
            $stmt = $db->prepare('UPDATE users SET email = ?, username = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
            $stmt->execute([$email, $username, $userId]);
        }

        // Récupérer les infos mises à jour
        $stmt = $db->prepare('SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $updatedUser = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'message' => 'Profil mis à jour avec succès',
            'user' => $updatedUser
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la mise à jour du profil: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Méthode non autorisée']);
