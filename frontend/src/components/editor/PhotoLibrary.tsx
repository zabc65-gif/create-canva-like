import { useState, useEffect } from 'react';
import { Search, ExternalLink } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { generatePrefixedId, DEFAULT_IMAGE_FILTERS } from '@create/shared';
import type { ImageElement } from '@create/shared';
import { UNSPLASH_ACCESS_KEY, UNSPLASH_API_URL, triggerUnsplashDownload } from '@/config/unsplash';

interface UnsplashPhoto {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
    download_location: string;
  };
  width: number;
  height: number;
}

interface PhotoLibraryProps {
  onClose?: () => void;
}

export default function PhotoLibrary({ onClose }: PhotoLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addElement, project } = useEditorStore();

  // Charger les photos populaires au démarrage
  useEffect(() => {
    loadPopularPhotos();
  }, []);

  const getDemoPhotos = (): UnsplashPhoto[] => {
    return [
      {
        id: '1',
        urls: {
          raw: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
          full: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200',
          regular: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
          small: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
          thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
        },
        alt_description: 'Abstract gradient colorful background',
        user: { name: 'Unsplash', username: 'unsplash', links: { html: 'https://unsplash.com' } },
        links: { html: 'https://unsplash.com', download_location: '' },
        width: 1200,
        height: 800,
      },
      {
        id: '2',
        urls: {
          raw: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200',
          full: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1200',
          regular: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
          small: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
          thumb: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200',
        },
        alt_description: 'Abstract blue waves',
        user: { name: 'Unsplash', username: 'unsplash', links: { html: 'https://unsplash.com' } },
        links: { html: 'https://unsplash.com', download_location: '' },
        width: 1200,
        height: 800,
      },
      {
        id: '3',
        urls: {
          raw: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
          full: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200',
          regular: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
          small: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
          thumb: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=200',
        },
        alt_description: 'Gradient purple and pink',
        user: { name: 'Unsplash', username: 'unsplash', links: { html: 'https://unsplash.com' } },
        links: { html: 'https://unsplash.com', download_location: '' },
        width: 1200,
        height: 800,
      },
      {
        id: '4',
        urls: {
          raw: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200',
          full: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200',
          regular: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
          small: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400',
          thumb: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=200',
        },
        alt_description: 'Gradient orange and yellow',
        user: { name: 'Unsplash', username: 'unsplash', links: { html: 'https://unsplash.com' } },
        links: { html: 'https://unsplash.com', download_location: '' },
        width: 1200,
        height: 800,
      },
      {
        id: '5',
        urls: {
          raw: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200',
          full: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200',
          regular: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
          small: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400',
          thumb: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=200',
        },
        alt_description: 'Colorful abstract pattern',
        user: { name: 'Unsplash', username: 'unsplash', links: { html: 'https://unsplash.com' } },
        links: { html: 'https://unsplash.com', download_location: '' },
        width: 1200,
        height: 800,
      },
      {
        id: '6',
        urls: {
          raw: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=1200',
          full: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=1200',
          regular: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800',
          small: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400',
          thumb: 'https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=200',
        },
        alt_description: 'Green and blue gradient',
        user: { name: 'Unsplash', username: 'unsplash', links: { html: 'https://unsplash.com' } },
        links: { html: 'https://unsplash.com', download_location: '' },
        width: 1200,
        height: 800,
      },
    ];
  };

  const loadPopularPhotos = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!UNSPLASH_ACCESS_KEY) {
        console.log('📸 Mode démo: Pas de clé API Unsplash');
        setPhotos(getDemoPhotos());
        return;
      }

      console.log('📸 Chargement des photos Unsplash avec clé API...');

      // Code Unsplash réel avec clé API
      const response = await fetch(
        `${UNSPLASH_API_URL}/photos?per_page=30&order_by=popular`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      console.log('📸 Réponse Unsplash:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erreur API Unsplash:', errorText);

        // Fallback sur les photos de démo si l'API échoue
        console.log('📸 Fallback sur les photos de démo');
        setPhotos(getDemoPhotos());
        return;
      }

      const data = await response.json();
      console.log('✅ Photos chargées:', data.length);
      setPhotos(data);
    } catch (err) {
      console.error('❌ Erreur lors du chargement des photos:', err);
      // Fallback sur les photos de démo en cas d'erreur
      setPhotos(getDemoPhotos());
    } finally {
      setLoading(false);
    }
  };

  const searchPhotos = async () => {
    if (!searchQuery.trim()) {
      loadPopularPhotos();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (!UNSPLASH_ACCESS_KEY) {
        setPhotos([]);
        setError('Clé API Unsplash requise pour la recherche');
        return;
      }

      const response = await fetch(
        `${UNSPLASH_API_URL}/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=30`,
        {
          headers: {
            Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }

      const data = await response.json();
      setPhotos(data.results);
    } catch (err) {
      setError('Impossible de rechercher des photos. Veuillez réessayer.');
      console.error('Error searching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoSelect = (photo: UnsplashPhoto) => {
    if (!project) return;

    // Calculer les dimensions pour s'adapter au projet
    const maxWidth = project.dimensions.width * 0.6;
    const maxHeight = project.dimensions.height * 0.6;

    let width = photo.width;
    let height = photo.height;

    // Redimensionner proportionnellement
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
    width *= ratio;
    height *= ratio;

    const imageElement: ImageElement = {
      id: generatePrefixedId('img'),
      name: photo.alt_description || 'Photo',
      type: 'image',
      src: photo.urls.regular,
      originalSrc: photo.urls.regular,
      filters: DEFAULT_IMAGE_FILTERS,
      transform: {
        x: (project.dimensions.width - width) / 2,
        y: (project.dimensions.height - height) / 2,
        width,
        height,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: project.elements.length,
    };

    addElement(imageElement);

    // Télécharger l'image via Unsplash (requis par leurs conditions d'utilisation)
    if (photo.links.download_location) {
      triggerUnsplashDownload(photo.links.download_location);
    }
  };

  return (
    <div>
      {/* En-tête de recherche */}
      <div className="p-4 border-b border-dark-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchPhotos()}
            placeholder="Rechercher des photos..."
            className="w-full pl-10 pr-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <p className="text-xs text-dark-400 mt-2">
          Photos gratuites fournies par{' '}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Unsplash
          </a>
        </p>
      </div>

      {/* Grille de photos */}
      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-dark-500">Chargement...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadPopularPhotos}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && photos.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <Search className="w-12 h-12 text-dark-300 mb-3" />
            <p className="text-sm text-dark-600 font-medium mb-1">
              Aucune photo trouvée
            </p>
            <p className="text-xs text-dark-400">
              Essayez une autre recherche
            </p>
          </div>
        )}

        {!loading && !error && photos.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square rounded-lg overflow-hidden bg-dark-100 cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                onClick={() => handlePhotoSelect(photo)}
              >
                <img
                  src={photo.urls.small}
                  alt={photo.alt_description}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />

                {/* Overlay au survol avec attribution Unsplash */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-2">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity w-full">
                    <p className="text-xs text-white flex items-center gap-1">
                      Photo by{' '}
                      <a
                        href={`${photo.user.links.html}?utm_source=create&utm_medium=referral`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline font-medium"
                      >
                        {photo.user.name}
                      </a>
                      {' '}on{' '}
                      <a
                        href="https://unsplash.com?utm_source=create&utm_medium=referral"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="hover:underline font-medium"
                      >
                        Unsplash
                      </a>
                      <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 border-t border-dark-200 bg-dark-50">
        {!UNSPLASH_ACCESS_KEY ? (
          <p className="text-xs text-dark-600">
            <strong>Mode démo:</strong> Pour utiliser l'API Unsplash complète avec recherche,
            ajoutez votre clé API dans les variables d'environnement (VITE_UNSPLASH_ACCESS_KEY).
          </p>
        ) : (
          <p className="text-xs text-dark-600">
            Les photos sont fournies par Unsplash et soumises à leur{' '}
            <a
              href="https://unsplash.com/license"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              licence
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}
