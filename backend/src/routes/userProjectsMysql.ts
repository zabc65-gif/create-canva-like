import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authenticateToken } from '../middleware/auth.js';
import { query, get, all } from '../services/databaseMysql.js';
import type { Project } from '@create/shared';

const router = Router();

// Toutes les routes nécessitent l'authentification
router.use(authenticateToken);

/**
 * GET /api/user/projects
 * Récupérer tous les projets de l'utilisateur
 */
router.get('/projects', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const projects = await all(
      `SELECT id, name, type, thumbnail, created_at, updated_at
       FROM projects
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.json({ projects });
  } catch (error: any) {
    console.error('Erreur récupération projets:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
  }
});

/**
 * GET /api/user/projects/:projectId
 * Récupérer un projet spécifique
 */
router.get('/projects/:projectId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { projectId } = req.params;

    const projectRow = await get(
      'SELECT * FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (!projectRow) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    // Parser les données JSON
    const project: Project = JSON.parse(projectRow.data);

    res.json({ project });
  } catch (error: any) {
    console.error('Erreur récupération projet:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du projet' });
  }
});

/**
 * POST /api/user/projects
 * Créer un nouveau projet
 */
router.post('/projects', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { project } = req.body;

    if (!project) {
      return res.status(400).json({ error: 'Données du projet manquantes' });
    }

    const projectId = project.id || uuidv4();
    const projectData = {
      ...project,
      id: projectId,
    };

    await query(
      `INSERT INTO projects (id, user_id, name, type, data, thumbnail)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        userId,
        project.name,
        project.type,
        JSON.stringify(projectData),
        project.thumbnail || null,
      ]
    );

    res.status(201).json({
      message: 'Projet créé avec succès',
      projectId,
    });
  } catch (error: any) {
    console.error('Erreur création projet:', error);
    res.status(500).json({ error: 'Erreur lors de la création du projet' });
  }
});

/**
 * PUT /api/user/projects/:projectId
 * Mettre à jour un projet
 */
router.put('/projects/:projectId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { projectId } = req.params;
    const { project } = req.body;

    if (!project) {
      return res.status(400).json({ error: 'Données du projet manquantes' });
    }

    // Vérifier que le projet appartient à l'utilisateur
    const existingProject = await get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (!existingProject) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    // Mettre à jour le projet
    await query(
      `UPDATE projects
       SET name = ?, data = ?, thumbnail = ?
       WHERE id = ? AND user_id = ?`,
      [
        project.name,
        JSON.stringify(project),
        project.thumbnail || null,
        projectId,
        userId,
      ]
    );

    res.json({ message: 'Projet mis à jour avec succès' });
  } catch (error: any) {
    console.error('Erreur mise à jour projet:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du projet' });
  }
});

/**
 * DELETE /api/user/projects/:projectId
 * Supprimer un projet
 */
router.delete('/projects/:projectId', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { projectId } = req.params;

    // Vérifier que le projet appartient à l'utilisateur
    const existingProject = await get(
      'SELECT id FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    if (!existingProject) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    // Supprimer le projet
    await query(
      'DELETE FROM projects WHERE id = ? AND user_id = ?',
      [projectId, userId]
    );

    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error: any) {
    console.error('Erreur suppression projet:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
  }
});

export default router;
