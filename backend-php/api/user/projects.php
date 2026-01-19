<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/jwt.php';

$userId = requireAuth();
$db = getDatabase();
$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Récupérer tous les projets de l'utilisateur
            $stmt = $db->prepare(
                'SELECT id, name, type, thumbnail, created_at, updated_at
                 FROM projects
                 WHERE user_id = ?
                 ORDER BY updated_at DESC'
            );
            $stmt->execute([$userId]);
            $projects = $stmt->fetchAll();

            echo json_encode(['projects' => $projects]);
            break;

        case 'POST':
            // Créer un nouveau projet
            $data = json_decode(file_get_contents('php://input'), true);
            $project = $data['project'] ?? null;

            if (!$project) {
                http_response_code(400);
                echo json_encode(['error' => 'Données du projet manquantes']);
                exit;
            }

            $projectId = $project['id'] ?? generateUuid();
            $project['id'] = $projectId;

            $stmt = $db->prepare(
                'INSERT INTO projects (id, user_id, name, type, data, thumbnail)
                 VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $projectId,
                $userId,
                $project['name'],
                $project['type'],
                json_encode($project),
                $project['thumbnail'] ?? null
            ]);

            http_response_code(201);
            echo json_encode([
                'message' => 'Projet créé avec succès',
                'projectId' => $projectId
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
