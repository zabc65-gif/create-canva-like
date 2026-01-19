<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/jwt.php';

$userId = requireAuth();
$db = getDatabase();
$method = $_SERVER['REQUEST_METHOD'];

// Récupérer l'ID du projet depuis l'URL
$projectId = $_GET['id'] ?? null;

if (!$projectId) {
    http_response_code(400);
    echo json_encode(['error' => 'ID du projet manquant']);
    exit;
}

try {
    switch ($method) {
        case 'GET':
            // Récupérer un projet spécifique
            $stmt = $db->prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?');
            $stmt->execute([$projectId, $userId]);
            $projectRow = $stmt->fetch();

            if (!$projectRow) {
                http_response_code(404);
                echo json_encode(['error' => 'Projet non trouvé']);
                exit;
            }

            $project = json_decode($projectRow['data'], true);
            echo json_encode(['project' => $project]);
            break;

        case 'PUT':
            // Mettre à jour un projet
            $data = json_decode(file_get_contents('php://input'), true);
            $project = $data['project'] ?? null;

            if (!$project) {
                http_response_code(400);
                echo json_encode(['error' => 'Données du projet manquantes']);
                exit;
            }

            // Vérifier que le projet appartient à l'utilisateur
            $stmt = $db->prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?');
            $stmt->execute([$projectId, $userId]);

            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Projet non trouvé']);
                exit;
            }

            // Mettre à jour
            $stmt = $db->prepare(
                'UPDATE projects
                 SET name = ?, data = ?, thumbnail = ?
                 WHERE id = ? AND user_id = ?'
            );
            $stmt->execute([
                $project['name'],
                json_encode($project),
                $project['thumbnail'] ?? null,
                $projectId,
                $userId
            ]);

            echo json_encode(['message' => 'Projet mis à jour avec succès']);
            break;

        case 'DELETE':
            // Supprimer un projet
            $stmt = $db->prepare('SELECT id FROM projects WHERE id = ? AND user_id = ?');
            $stmt->execute([$projectId, $userId]);

            if (!$stmt->fetch()) {
                http_response_code(404);
                echo json_encode(['error' => 'Projet non trouvé']);
                exit;
            }

            $stmt = $db->prepare('DELETE FROM projects WHERE id = ? AND user_id = ?');
            $stmt->execute([$projectId, $userId]);

            echo json_encode(['message' => 'Projet supprimé avec succès']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Méthode non autorisée']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
}
