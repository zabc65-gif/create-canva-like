import { useState, useRef, useEffect } from 'react';
import type { ImageFilters, CropArea } from '@create/shared';
import { DEFAULT_IMAGE_FILTERS } from '@create/shared';
import { X, Check, RotateCcw, Sparkles, Crop, Wand2 } from 'lucide-react';
import ImageFiltersPanel from './ImageFilters';
import ImageCrop from './ImageCrop';
import ImageEffects from './ImageEffects';

interface PhotoEditorAdvancedProps {
  imageUrl: string;
  onSave: (data: {
    filters: ImageFilters;
    rotation: number;
    flipH: boolean;
    flipV: boolean;
    crop?: CropArea;
    effects?: any;
  }) => void;
  onCancel: () => void;
  initialFilters?: ImageFilters;
}

type TabType = 'filters' | 'crop' | 'effects';

export default function PhotoEditorAdvanced({
  imageUrl,
  onSave,
  onCancel,
  initialFilters,
}: PhotoEditorAdvancedProps) {
  const [activeTab, setActiveTab] = useState<TabType>('filters');
  const [filters, setFilters] = useState<ImageFilters>(initialFilters || DEFAULT_IMAGE_FILTERS);
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | undefined>();
  const [effects, setEffects] = useState<any>({});

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

  // Rendre l'image avec tous les effets
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

    // Ajuster selon rotation
    if (rotation === 90 || rotation === 270) {
      canvas.width = height;
      canvas.height = width;
    } else {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.save();

    // Appliquer les transformations géométriques
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

    // Appliquer les filtres
    ctx.filter = buildFilterString(filters);

    // Dessiner l'image
    ctx.drawImage(img, -width / 2, -height / 2, width, height);

    ctx.restore();

    // Appliquer les effets visuels
    applyVisualEffects(ctx, canvas.width, canvas.height);
  };

  // Construire la chaîne de filtres CSS
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

  // Appliquer les effets visuels (ombre, bordure, etc.)
  const applyVisualEffects = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Ombre portée
    if (effects.shadow?.enabled) {
      ctx.shadowBlur = effects.shadow.blur || 10;
      ctx.shadowOffsetX = effects.shadow.offsetX || 0;
      ctx.shadowOffsetY = effects.shadow.offsetY || 4;
      ctx.shadowColor = `rgba(0,0,0,${effects.shadow.opacity || 0.3})`;
    }

    // Bordure
    if (effects.border?.enabled) {
      ctx.strokeStyle = effects.border.color || '#000000';
      ctx.lineWidth = effects.border.width || 2;
      ctx.strokeRect(0, 0, width, height);
    }

    // Superposition de couleur
    if (effects.overlay?.enabled) {
      ctx.globalCompositeOperation = effects.overlay.blendMode || 'overlay';
      ctx.fillStyle = effects.overlay.color || '#000000';
      ctx.globalAlpha = effects.overlay.opacity || 0.2;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  // Re-rendre quand les paramètres changent
  useEffect(() => {
    renderImage();
  }, [filters, rotation, flipHorizontal, flipVertical, effects]);

  const handleSave = () => {
    onSave({
      filters,
      rotation,
      flipH: flipHorizontal,
      flipV: flipVertical,
      crop: cropArea,
      effects,
    });
  };

  const handleReset = () => {
    setFilters(DEFAULT_IMAGE_FILTERS);
    setRotation(0);
    setFlipHorizontal(false);
    setFlipVertical(false);
    setCropArea(undefined);
    setEffects({});
  };

  const tabs = [
    { id: 'filters' as const, label: 'Filtres', icon: Sparkles },
    { id: 'crop' as const, label: 'Recadrer', icon: Crop },
    { id: 'effects' as const, label: 'Effets', icon: Wand2 },
  ];

  return (
    <div className="fixed inset-0 bg-dark-900/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-200">
          <h2 className="text-lg font-semibold text-dark-900">Retouche photo avancée</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="btn btn-ghost flex items-center gap-2"
              title="Réinitialiser tous les réglages"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden md:inline">Réinitialiser</span>
            </button>
            <button onClick={onCancel} className="btn btn-secondary">
              <X className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Annuler</span>
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              <Check className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">Appliquer</span>
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-dark-100 p-8">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full rounded-lg shadow-xl"
                style={{
                  borderRadius: effects.corners?.enabled ? `${effects.corners.radius}px` : '0',
                }}
              />
              {cropArea && (
                <div className="absolute top-2 right-2 bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Zone de recadrage active
                </div>
              )}
            </div>
          </div>

          {/* Sidebar with tabs */}
          <div className="w-80 border-l border-dark-200 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-dark-200">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 p-3 flex flex-col items-center gap-1 text-xs transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                      : 'text-dark-500 hover:text-dark-700 hover:bg-dark-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'filters' && (
                <ImageFiltersPanel
                  currentFilters={filters}
                  onFiltersChange={setFilters}
                />
              )}

              {activeTab === 'crop' && (
                <ImageCrop
                  currentCrop={cropArea}
                  rotation={rotation}
                  flipHorizontal={flipHorizontal}
                  flipVertical={flipVertical}
                  onCropChange={setCropArea}
                  onRotationChange={setRotation}
                  onFlipHorizontalChange={setFlipHorizontal}
                  onFlipVerticalChange={setFlipVertical}
                />
              )}

              {activeTab === 'effects' && (
                <ImageEffects
                  currentEffects={effects}
                  onEffectsChange={setEffects}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
