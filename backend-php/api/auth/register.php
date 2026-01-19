<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/jwt.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$username = $data['username'] ?? '';

// Validation
if (empty($email) || empty($password) || empty($username)) {
    http_response_code(400);
    echo json_encode(['error' => 'Email, mot de passe et nom d\'utilisateur requis']);
    exit;
}

if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['error' => 'Le mot de passe doit contenir au moins 6 caractères']);
    exit;
}

try {
    $db = getDatabase();

    // Vérifier si l'email existe déjà
    $stmt = $db->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);

    if ($stmt->fetch()) {
        http_response_code(400);
        echo json_encode(['error' => 'Cet email est déjà utilisé']);
        exit;
    }

    // Créer l'utilisateur
    $userId = generateUuid();
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $db->prepare('INSERT INTO users (id, email, password, username) VALUES (?, ?, ?, ?)');
    $stmt->execute([$userId, $email, $hashedPassword, $username]);

    // Récupérer l'utilisateur créé
    $stmt = $db->prepare('SELECT id, email, username, created_at, updated_at FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Générer le token JWT
    $token = generateJWT($user['id'], $user['email']);

    http_response_code(201);
    echo json_encode([
        'message' => 'Utilisateur créé avec succès',
        'user' => $user,
        'token' => $token
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de l\'inscription: ' . $e->getMessage()]);
}
