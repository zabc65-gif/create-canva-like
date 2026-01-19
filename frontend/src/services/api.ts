import type { Project } from '@create/shared';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

class ApiService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private getToken(): string | null {
    const authStorage = localStorage.getItem('create-auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        return parsed.state?.token || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  // AUTH
  async register(email: string, password: string, username: string) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password, username }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'inscription');
    }

    return response.json();
  }

  async login(email: string, password: string) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la connexion');
    }

    return response.json();
  }

  async getMe() {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Non authentifié');
    }

    return response.json();
  }

  // PROJECTS
  async getProjects() {
    const response = await fetch(`${API_URL}/user/projects`, {
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération des projets');
    }

    return response.json();
  }

  async getProject(projectId: string) {
    const response = await fetch(`${API_URL}/user/projects/${projectId}`, {
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la récupération du projet');
    }

    return response.json();
  }

  async createProject(project: Project) {
    const response = await fetch(`${API_URL}/user/projects`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ project }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création du projet');
    }

    return response.json();
  }

  async updateProject(projectId: string, project: Project) {
    const response = await fetch(`${API_URL}/user/projects/${projectId}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify({ project }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la mise à jour du projet');
    }

    return response.json();
  }

  async deleteProject(projectId: string) {
    const response = await fetch(`${API_URL}/user/projects/${projectId}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la suppression du projet');
    }

    return response.json();
  }
}

export const api = new ApiService();
