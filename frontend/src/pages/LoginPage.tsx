import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await api.login(identifier, password);
      setAuth(result.user, result.token);
      navigate('/projects');
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-2xl font-semibold text-dark-900">Create</span>
        </div>

        <h1 className="text-2xl font-bold text-dark-900 mb-2 text-center">
          Connexion
        </h1>
        <p className="text-dark-500 text-center mb-6">
          Accédez à vos projets créatifs
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-dark-700 mb-1">
              Email ou Pseudo
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="input"
              placeholder="votre@email.com ou votre pseudo"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-700 mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              'Connexion...'
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-dark-500">
          Pas encore de compte?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Créer un compte
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-dark-400 hover:text-dark-600">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
