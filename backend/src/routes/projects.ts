import { Router } from 'express';
import { projectService } from '../services/projectService.js';
import { AppError } from '../middleware/errorHandler.js';
import type { ApiResponse, CreateProjectRequest } from '@create/shared';

export const projectRoutes = Router();

// GET /api/projects - Liste tous les projets
projectRoutes.get('/', (req, res) => {
  const projects = projectService.getAll();
  res.json({
    success: true,
    data: projects,
  });
});

// GET /api/projects/:id - Récupère un projet
projectRoutes.get('/:id', (req, res, next) => {
  const project = projectService.getById(req.params.id);

  if (!project) {
    return next(new AppError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND'));
  }

  res.json({
    success: true,
    data: project,
  });
});

// POST /api/projects - Crée un nouveau projet
projectRoutes.post('/', (req, res, next) => {
  const { name, type, width, height, backgroundColor } = req.body as CreateProjectRequest;

  if (!name || !type || !width || !height) {
    return next(new AppError('Données manquantes', 400, 'MISSING_DATA'));
  }

  if (!['design', 'photo', 'video'].includes(type)) {
    return next(new AppError('Type de projet invalide', 400, 'INVALID_PROJECT_TYPE'));
  }

  const project = projectService.create({
    name,
    type,
    width,
    height,
    backgroundColor,
  });

  res.status(201).json({
    success: true,
    data: project,
  });
});

// PUT /api/projects/:id - Met à jour un projet
projectRoutes.put('/:id', (req, res, next) => {
  const project = projectService.update(req.params.id, req.body);

  if (!project) {
    return next(new AppError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND'));
  }

  res.json({
    success: true,
    data: project,
  });
});

// DELETE /api/projects/:id - Supprime un projet
projectRoutes.delete('/:id', (req, res, next) => {
  const deleted = projectService.delete(req.params.id);

  if (!deleted) {
    return next(new AppError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND'));
  }

  res.json({
    success: true,
    data: { id: req.params.id },
  });
});

// POST /api/projects/:id/duplicate - Duplique un projet
projectRoutes.post('/:id/duplicate', (req, res, next) => {
  const project = projectService.duplicate(req.params.id);

  if (!project) {
    return next(new AppError('Projet non trouvé', 404, 'PROJECT_NOT_FOUND'));
  }

  res.status(201).json({
    success: true,
    data: project,
  });
});
