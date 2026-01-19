import { useNavigate, Link } from 'react-router-dom';
import { PRESET_FORMATS, type PresetFormat } from '@create/shared';
import { useAuthStore } from '@/stores/authStore';
import {
  Image,
  Video,
  Layout,
  Instagram,
  FileText,
  Plus,
  Presentation,
} from 'lucide-react';

const categoryIcons: Record<string, React.ReactNode> = {
  social: <Instagram className="w-5 h-5" />,
  video: <Video className="w-5 h-5" />,
  presentation: <Presentation className="w-5 h-5" />,
  print: <FileText className="w-5 h-5" />,
};

const projectTypes = [
  {
    id: 'design',
    name: 'Design',
    description: 'Créez des visuels pour les réseaux sociaux, présentations et plus',
    icon: <Layout className="w-8 h-8" />,
    color: 'bg-purple-500',
  },
  {
    id: 'photo',
    name: 'Retouche Photo',
    description: 'Retouchez et améliorez vos photos avec des filtres et outils',
    icon: <Image className="w-8 h-8" />,
    color: 'bg-blue-500',
  },
  {
    id: 'video',
    name: 'Montage Vidéo',
    description: 'Créez des vidéos courtes avec effets et transitions',
    icon: <Video className="w-8 h-8" />,
    color: 'bg-pink-500',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleCreateProject = (type: string, format?: PresetFormat) => {
    const dimensions = format?.dimensions || { width: 1080, height: 1080 };
    const params = new URLSearchParams({
      type,
      width: dimensions.width.toString(),
      height: dimensions.height.toString(),
      name: format?.name || 'Nouveau projet',
      new: 'true', // Marqueur pour indiquer que c'est un NOUVEAU projet
    });
    navigate(`/editor?${params.toString()}`);
  };

  const groupedFormats = PRESET_FORMATS.reduce((acc, format) => {
    if (!acc[format.category]) acc[format.category] = [];
    acc[format.category].push(format);
    return acc;
  }, {} as Record<string, PresetFormat[]>);

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
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/projects" className="btn btn-ghost">
                  Mes projets
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Se connecter
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Créer un compte
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 via-purple-500 to-pink-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Créez. Retouchez. Montez.
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Une solution simple et puissante pour tous vos besoins créatifs.
            Design, retouche photo et montage vidéo en un seul endroit.
          </p>
        </div>
      </section>

      {/* Types de projets */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-dark-900 mb-8">
          Commencer un nouveau projet
        </h2>
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {projectTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleCreateProject(type.id)}
              className="bg-white rounded-2xl p-6 border border-dark-200 hover:border-primary-300 hover:shadow-lg transition-all text-left group"
            >
              <div
                className={`w-16 h-16 ${type.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
              >
                {type.icon}
              </div>
              <h3 className="text-lg font-semibold text-dark-900 mb-2">
                {type.name}
              </h3>
              <p className="text-dark-500 text-sm">{type.description}</p>
            </button>
          ))}
        </div>

        {/* Formats prédéfinis */}
        <h2 className="text-2xl font-semibold text-dark-900 mb-8">
          Ou choisissez un format
        </h2>
        {Object.entries(groupedFormats).map(([category, formats]) => (
          <div key={category} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              {categoryIcons[category]}
              <h3 className="text-lg font-medium text-dark-700 capitalize">
                {category === 'social' && 'Réseaux sociaux'}
                {category === 'video' && 'Vidéo'}
                {category === 'presentation' && 'Présentation'}
                {category === 'print' && 'Impression'}
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {formats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => handleCreateProject('design', format)}
                  className="bg-white rounded-xl p-4 border border-dark-200 hover:border-primary-300 hover:shadow-md transition-all text-left group"
                >
                  <div className="aspect-square bg-dark-100 rounded-lg mb-3 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                    <div
                      className="bg-white border border-dark-200 shadow-sm"
                      style={{
                        width: `${Math.min(60, (format.dimensions.width / format.dimensions.height) * 40)}px`,
                        height: `${Math.min(60, (format.dimensions.height / format.dimensions.width) * 40)}px`,
                      }}
                    />
                  </div>
                  <p className="text-sm font-medium text-dark-900 truncate">
                    {format.name}
                  </p>
                  <p className="text-xs text-dark-400">
                    {format.dimensions.width} × {format.dimensions.height}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Taille personnalisée */}
        <div className="bg-dark-100 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Plus className="w-8 h-8 text-dark-400" />
          </div>
          <h3 className="text-lg font-semibold text-dark-900 mb-2">
            Taille personnalisée
          </h3>
          <p className="text-dark-500 mb-4">
            Créez un projet avec des dimensions sur mesure
          </p>
          <button
            onClick={() => handleCreateProject('design')}
            className="btn btn-primary"
          >
            Créer
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-900 text-dark-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>
            &copy; {new Date().getFullYear()} Create. Tous droits réservés. |{' '}
            <Link to="/terms" className="text-primary-400 hover:text-primary-300 hover:underline">
              Conditions d'utilisation
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
