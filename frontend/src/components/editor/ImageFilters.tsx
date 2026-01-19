import { useState } from 'react';
import type { ImageFilters as IImageFilters } from '@create/shared';
import { DEFAULT_IMAGE_FILTERS } from '@create/shared';
import { Sparkles } from 'lucide-react';

interface FilterPreset {
  id: string;
  name: string;
  filters: IImageFilters;
  preview: string;
}

const filterPresets: FilterPreset[] = [
  {
    id: 'none',
    name: 'Original',
    filters: DEFAULT_IMAGE_FILTERS,
    preview: '🖼️',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    filters: {
      brightness: 110,
      contrast: 90,
      saturation: 80,
      blur: 0,
      grayscale: 0,
      sepia: 40,
      hueRotate: 0,
    },
    preview: '📸',
  },
  {
    id: 'bw',
    name: 'Noir & Blanc',
    filters: {
      brightness: 105,
      contrast: 110,
      saturation: 0,
      blur: 0,
      grayscale: 100,
      sepia: 0,
      hueRotate: 0,
    },
    preview: '⚫',
  },
  {
    id: 'warm',
    name: 'Chaleureux',
    filters: {
      brightness: 105,
      contrast: 95,
      saturation: 120,
      blur: 0,
      grayscale: 0,
      sepia: 20,
      hueRotate: 10,
    },
    preview: '🔥',
  },
  {
    id: 'cool',
    name: 'Froid',
    filters: {
      brightness: 100,
      contrast: 105,
      saturation: 110,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      hueRotate: -20,
    },
    preview: '❄️',
  },
  {
    id: 'dramatic',
    name: 'Dramatique',
    filters: {
      brightness: 90,
      contrast: 130,
      saturation: 90,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
    },
    preview: '🎭',
  },
  {
    id: 'soft',
    name: 'Doux',
    filters: {
      brightness: 115,
      contrast: 85,
      saturation: 95,
      blur: 1,
      grayscale: 0,
      sepia: 0,
      hueRotate: 0,
    },
    preview: '☁️',
  },
  {
    id: 'vivid',
    name: 'Éclatant',
    filters: {
      brightness: 105,
      contrast: 115,
      saturation: 140,
      blur: 0,
      grayscale: 0,
      sepia: 0,
      hueRotate: 5,
    },
    preview: '🌈',
  },
];

interface ImageFiltersProps {
  currentFilters: IImageFilters;
  onFiltersChange: (filters: IImageFilters) => void;
}

export default function ImageFiltersPanel({ currentFilters, onFiltersChange }: ImageFiltersProps) {
  const [activePreset, setActivePreset] = useState<string>('none');

  const handlePresetClick = (preset: FilterPreset) => {
    setActivePreset(preset.id);
    onFiltersChange(preset.filters);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary-600" />
        <h3 className="sidebar-title m-0">Filtres Prédéfinis</h3>
      </div>

      {/* Grille de filtres prédéfinis */}
      <div className="grid grid-cols-4 gap-2">
        {filterPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePresetClick(preset)}
            className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all hover:scale-105 ${
              activePreset === preset.id
                ? 'border-primary-500 bg-primary-50'
                : 'border-dark-200 hover:border-dark-300'
            }`}
            title={preset.name}
          >
            <span className="text-2xl">{preset.preview}</span>
            <span className="text-[9px] text-dark-600 font-medium text-center leading-tight px-1">
              {preset.name}
            </span>
          </button>
        ))}
      </div>

      {/* Contrôles manuels */}
      <div className="space-y-3 pt-4 border-t border-dark-200">
        <h4 className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
          Ajustements Manuels
        </h4>

        {/* Luminosité */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-dark-600">Luminosité</label>
            <span className="text-xs text-dark-500">{currentFilters.brightness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={currentFilters.brightness}
            onChange={(e) =>
              onFiltersChange({ ...currentFilters, brightness: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        {/* Contraste */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-dark-600">Contraste</label>
            <span className="text-xs text-dark-500">{currentFilters.contrast}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={currentFilters.contrast}
            onChange={(e) =>
              onFiltersChange({ ...currentFilters, contrast: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        {/* Saturation */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-dark-600">Saturation</label>
            <span className="text-xs text-dark-500">{currentFilters.saturation}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={currentFilters.saturation}
            onChange={(e) =>
              onFiltersChange({ ...currentFilters, saturation: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        {/* Flou */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-dark-600">Flou</label>
            <span className="text-xs text-dark-500">{currentFilters.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={currentFilters.blur}
            onChange={(e) =>
              onFiltersChange({ ...currentFilters, blur: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        {/* Sépia */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-dark-600">Sépia</label>
            <span className="text-xs text-dark-500">{currentFilters.sepia}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={currentFilters.sepia}
            onChange={(e) =>
              onFiltersChange({ ...currentFilters, sepia: parseInt(e.target.value) })
            }
            className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        {/* Réinitialiser */}
        <button
          onClick={() => {
            setActivePreset('none');
            onFiltersChange(DEFAULT_IMAGE_FILTERS);
          }}
          className="w-full btn btn-secondary text-sm py-2"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
