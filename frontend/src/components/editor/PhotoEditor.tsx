import { useState, useRef, useEffect } from 'react';
import type { ImageFilters } from '@create/shared';
import {
  Sun,
  Contrast,
  Droplets,
  CircleDot,
  Palette,
  RotateCcw,
  Crop,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
} from 'lucide-react';

interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<ImageFilters>;
}

const filterPresets: FilterPreset[] = [
  { id: 'original', name: 'Original', filters: {} },
  { id: 'vivid', name: 'Vif', filters: { saturation: 130, contrast: 110 } },
  { id: 'warm', name: 'Chaud', filters: { hueRotate: 15, saturation: 110 } },
  { id: 'cool', name: 'Froid', filters: { hueRotate: -15, saturation: 90 } },
  { id: 'bw', name: 'N&B', filters: { grayscale: 100 } },
  { id: 'sepia', name: 'Sépia', filters: { sepia: 80 } },
  { id: 'dramatic', name: 'Drama', filters: { contrast: 130, brightness: 90 } },
  { id: 'fade', name: 'Fade', filters: { brightness: 110, contrast: 80, saturation: 80 } },
];

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
};

interface PhotoEditorProps {
  imageUrl: string;
  onSave: (filters: ImageFilters) => void;
  onCancel: () => void;
  initialFilters?: ImageFilters;
}

export default function PhotoEditor({
  imageUrl,
  onSave,
  onCancel,
  initialFilters,
}: PhotoEditorProps) {
  const [filters, setFilters] = useState<ImageFilters>(
    initialFilters || DEFAULT_FILTERS
  );
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Charger l'image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      renderImage();
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Rendre l'image avec les filtres et transformations
  const renderImage = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajuster la taille du canvas
    const maxWidth = 800;
    const maxHeight = 600;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height = (height * maxWidth) / width;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (width * maxHeight) / height;
      height = maxHeight;
    }

    // Ajuster les dimensions du canvas selon la rotation
    if (rotation === 90 || rotation === 270) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    // Sauvegarder le contexte
    ctx.save();

    // Appliquer les transformations
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

    // Appliquer les filtres CSS
    const filterString = buildFilterString(filters);
    ctx.filter = filterString;

    // Dessiner l'image centrée
    ctx.drawImage(img, -width / 2, -height / 2, width, height);

    // Restaurer le contexte
    ctx.restore();
  };

  // Mettre à jour quand les filtres ou transformations changent
  useEffect(() => {
    renderImage();
  }, [filters, rotation, flipHorizontal, flipVertical]);

  const buildFilterString = (f: ImageFilters): string => {
    return [
      `brightness(${f.brightness}%)`,
      `contrast(${f.contrast}%)`,
      `saturate(${f.saturation}%)`,
      `blur(${f.blur}px)`,
      `grayscale(${f.grayscale}%)`,
      `sepia(${f.sepia}%)`,
      `hue-rotate(${f.hueRotate}deg)`,
    ].join(' ');
  };

  const handleFilterChange = (key: keyof ImageFilters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setActivePreset(null);
  };

  const handlePresetClick = (preset: FilterPreset) => {
    if (preset.id === 'original') {
      setFilters(DEFAULT_FILTERS);
    } else {
      setFilters({ ...DEFAULT_FILTERS, ...preset.filters });
    }
    setActivePreset(preset.id);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setActivePreset('original');
  };

  const adjustments = [
    {
      key: 'brightness' as const,
      label: 'Luminosité',
      icon: Sun,
      min: 0,
      max: 200,
    },
    {
      key: 'contrast' as const,
      label: 'Contraste',
      icon: Contrast,
      min: 0,
      max: 200,
    },
    {
      key: 'saturation' as const,
      label: 'Saturation',
      icon: Droplets,
      min: 0,
      max: 200,
    },
    { key: 'blur' as const, label: 'Flou', icon: CircleDot, min: 0, max: 20 },
    {
      key: 'grayscale' as const,
      label: 'Niveaux de gris',
      icon: Palette,
      min: 0,
      max: 100,
    },
    { key: 'sepia' as const, label: 'Sépia', icon: Palette, min: 0, max: 100 },
    {
      key: 'hueRotate' as const,
      label: 'Teinte',
      icon: Palette,
      min: -180,
      max: 180,
    },
  ];

  return (
    <div className="fixed inset-0 bg-dark-900/80 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-[1000px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-200">
          <h2 className="text-lg font-semibold text-dark-900">Retouche photo</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="btn btn-ghost flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
            <button onClick={onCancel} className="btn btn-secondary">
              Annuler
            </button>
            <button onClick={() => onSave(filters)} className="btn btn-primary">
              Appliquer
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-dark-100 p-8">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full rounded-lg shadow-lg"
            />
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-dark-200 overflow-y-auto">
            {/* Presets */}
            <div className="p-4 border-b border-dark-200">
              <h3 className="sidebar-title mb-3">Filtres</h3>
              <div className="grid grid-cols-4 gap-2">
                {filterPresets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handlePresetClick(preset)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activePreset === preset.id
                        ? 'border-primary-500'
                        : 'border-transparent hover:border-dark-300'
                    }`}
                  >
                    <div
                      className="w-full h-full bg-gradient-to-br from-primary-300 to-purple-300"
                      style={{
                        filter: buildFilterString({
                          ...DEFAULT_FILTERS,
                          ...preset.filters,
                        }),
                      }}
                    />
                    <span className="text-xs text-dark-600 block text-center mt-1">
                      {preset.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Adjustments */}
            <div className="p-4">
              <h3 className="sidebar-title mb-3">Ajustements</h3>
              <div className="space-y-4">
                {adjustments.map((adj) => (
                  <div key={adj.key}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <adj.icon className="w-4 h-4 text-dark-500" />
                        <span className="text-sm text-dark-700">{adj.label}</span>
                      </div>
                      <span className="text-sm text-dark-500 w-12 text-right">
                        {filters[adj.key]}
                        {adj.key === 'hueRotate' ? '°' : adj.key === 'blur' ? 'px' : '%'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={adj.min}
                      max={adj.max}
                      value={filters[adj.key]}
                      onChange={(e) =>
                        handleFilterChange(adj.key, parseInt(e.target.value))
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Transform tools */}
            <div className="p-4 border-t border-dark-200">
              <h3 className="sidebar-title mb-3">Transformation</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setRotation((rotation - 90 + 360) % 360)}
                  className="tool-button flex-1"
                  title="Rotation gauche"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setRotation((rotation + 90) % 360)}
                  className="tool-button flex-1"
                  title="Rotation droite"
                >
                  <RotateCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFlipHorizontal(!flipHorizontal)}
                  className={`tool-button flex-1 ${flipHorizontal ? 'active' : ''}`}
                  title="Miroir horizontal"
                >
                  <FlipHorizontal className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setFlipVertical(!flipVertical)}
                  className={`tool-button flex-1 ${flipVertical ? 'active' : ''}`}
                  title="Miroir vertical"
                >
                  <FlipVertical className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsCropping(!isCropping)}
                  className={`tool-button flex-1 ${isCropping ? 'active' : ''}`}
                  title="Recadrer"
                >
                  <Crop className="w-5 h-5" />
                </button>
              </div>
              {rotation !== 0 && (
                <p className="text-xs text-dark-500 mt-2">
                  Rotation: {rotation}°
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
