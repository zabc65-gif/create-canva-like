import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { ArrowLeft, User, Mail, Lock, Save } from 'lucide-react';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, setUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      setLoading(true);
      try {
        const profile = await api.getProfile();
        setFormData({
          email: profile.email,
          username: profile.username,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.email || !formData.username) {
      setError('Email et pseudo sont requis');
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setSaving(true);

    try {
      const updateData: any = {
        email: formData.email,
        username: formData.username,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.updateProfile(updateData);

      // Mettre à jour les infos dans le store
      if (response.user) {
        setUser(response.user);
      }

      setSuccess('Profil mis à jour avec succès');

      // Réinitialiser les champs de mot de passe
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Retour à l'accueil après 2 secondes
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Header */}
      <header className="bg-white border-b border-dark-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="tool-button"
            title="Retour à l'accueil"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold text-dark-900">Paramètres du compte</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-dark-200 p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informations générales */}
            <div>
              <h2 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informations générales
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-dark-700 mb-1">
                    Pseudo
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="input w-full"
                    placeholder="Votre pseudo"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-700 mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input w-full"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className="pt-6 border-t border-dark-200">
              <h2 className="text-lg font-semibold text-dark-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Changer le mot de passe
              </h2>
              <p className="text-sm text-dark-500 mb-4">
                Laissez ces champs vides si vous ne souhaitez pas changer votre mot de passe
              </p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-dark-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    className="input w-full"
                    placeholder="Mot de passe actuel"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-dark-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    className="input w-full"
                    placeholder="Nouveau mot de passe (min. 6 caractères)"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="input w-full"
                    placeholder="Confirmer le nouveau mot de passe"
                  />
                </div>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="btn btn-primary flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="btn btn-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
