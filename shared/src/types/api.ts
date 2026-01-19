import { Project } from './project';

/**
 * Réponse API standard
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

/**
 * Erreur API
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Réponse paginée
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Requête de création de projet
 */
export interface CreateProjectRequest {
  name: string;
  type: Project['type'];
  width: number;
  height: number;
  backgroundColor?: string;
}

/**
 * Requête de mise à jour de projet
 */
export interface UpdateProjectRequest {
  name?: string;
  backgroundColor?: string;
  elements?: Project['elements'];
}

/**
 * Réponse upload de fichier
 */
export interface UploadResponse {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
}

/**
 * Requête d'export
 */
export interface ExportRequest {
  projectId: string;
  format: 'png' | 'jpg' | 'pdf' | 'mp4' | 'gif';
  quality?: number;
  scale?: number;
}

/**
 * Réponse d'export
 */
export interface ExportResponse {
  downloadUrl: string;
  expiresAt: Date;
}

/**
 * Utilisateur
 */
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

/**
 * Session utilisateur
 */
export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}
