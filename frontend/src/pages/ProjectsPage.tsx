import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useEditorStore } from '@/stores/editorStore';
import { api } from '@/services/api';
import { Plus, LogOut, Trash2, Clock, FileText } from 'lucide-react';
import type { Project } from '@create/shared';

interface ProjectListItem {
  id: string;
  name: string;
  type: string;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { setProject } = useEditorStore();

  const [projects, setProjects] = useState<ProjectListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadProjects();
  }, [isAuthenticated, navigate]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const result = await api.getProjects();
      setProjects(result.projects);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleOpenProject = async (projectId: string) => {
    try {
      const result = await api.getProject(projectId);
      setProject(result.project);
      navigate('/editor');
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'ouverture du projet');
    }
  };

  const handleDeleteProject = async (projectId: string, projectName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${projectName}" ?`)) {
      return;
    }

    try {
      await api.deleteProject(projectId);
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la suppression du projet');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <header className="bg-white border-b border-dark-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-semibold text-dark-900">Create</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-dark-900">{user?.username}</p>
              <p className="text-xs text-dark-500">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="btn btn-ghost" title="Déconnexion">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-dark-900">Mes projets</h1>
          <Link to="/" className="btn btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Nouveau projet
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-primary-500 rounded-xl"></div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-dark-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-dark-700 mb-2">
              Aucun projet pour le moment
            </h2>
            <p className="text-dark-500 mb-6">
              Commencez à créer votre premier design
            </p>
            <Link to="/" className="btn btn-primary inline-flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Créer un projet
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl border border-dark-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Thumbnail */}
                <button
                  onClick={() => handleOpenProject(project.id)}
                  className="w-full aspect-video bg-dark-100 flex items-center justify-center text-left"
                >
                  {project.thumbnail ? (
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileText className="w-16 h-16 text-dark-300" />
                  )}
                </button>

                {/* Info */}
                <div className="p-4">
                  <button
                    onClick={() => handleOpenProject(project.id)}
                    className="text-left w-full"
                  >
                    <h3 className="font-semibold text-dark-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {project.name}
                    </h3>
                  </button>

                  <div className="flex items-center gap-1 text-xs text-dark-500 mb-3">
                    <Clock className="w-3 h-3" />
                    {formatDate(project.updated_at)}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenProject(project.id)}
                      className="btn btn-primary flex-1 text-sm py-2"
                    >
                      Ouvrir
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.name)}
                      className="btn btn-ghost text-red-600 hover:bg-red-50 p-2"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
