import { v4 as uuidv4 } from 'uuid';
import type { Project, ProjectMeta, CreateProjectRequest } from '@create/shared';

// Stockage en mémoire pour le MVP (à remplacer par une vraie DB)
const projects = new Map<string, Project>();

export const projectService = {
  /**
   * Créer un nouveau projet
   */
  create(data: CreateProjectRequest): Project {
    const now = new Date();
    const project: Project = {
      id: uuidv4(),
      name: data.name,
      type: data.type,
      dimensions: {
        width: data.width,
        height: data.height,
      },
      backgroundColor: data.backgroundColor || '#ffffff',
      elements: [],
      createdAt: now,
      updatedAt: now,
    };

    projects.set(project.id, project);
    return project;
  },

  /**
   * Récupérer un projet par ID
   */
  getById(id: string): Project | undefined {
    return projects.get(id);
  },

  /**
   * Récupérer tous les projets (metadata seulement)
   */
  getAll(): ProjectMeta[] {
    return Array.from(projects.values()).map((project) => ({
      id: project.id,
      name: project.name,
      type: project.type,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      thumbnail: project.thumbnail,
    }));
  },

  /**
   * Mettre à jour un projet
   */
  update(id: string, updates: Partial<Project>): Project | undefined {
    const project = projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updates,
      id: project.id, // ID immuable
      createdAt: project.createdAt, // Date création immuable
      updatedAt: new Date(),
    };

    projects.set(id, updatedProject);
    return updatedProject;
  },

  /**
   * Supprimer un projet
   */
  delete(id: string): boolean {
    return projects.delete(id);
  },

  /**
   * Dupliquer un projet
   */
  duplicate(id: string): Project | undefined {
    const project = projects.get(id);
    if (!project) return undefined;

    const now = new Date();
    const duplicated: Project = {
      ...project,
      id: uuidv4(),
      name: `${project.name} (copie)`,
      elements: JSON.parse(JSON.stringify(project.elements)), // Deep clone
      createdAt: now,
      updatedAt: now,
    };

    projects.set(duplicated.id, duplicated);
    return duplicated;
  },
};
