import { useState } from 'react';
import { Crop, RotateCw, FlipHorizontal, FlipVertical, Maximize2 } from 'lucide-react';
import type { CropArea } from '@create/shared';

interface CropPreset {
  id: string;
  name: string;
  ratio: number | null; // null = libre
  icon: string;
}

const cropPresets: CropPreset[] = [
  { id: 'free', name: 'Libre', ratio: null, icon: '✂️' },
  { id: 'square', name: 'Carré', ratio: 1, icon: '⬜' },
  { id: '16-9', name: '16:9', ratio: 16 / 9, icon: '📺' },
  { id: '9-16', name: '9:16', ratio: 9 / 16, icon: '📱' },
  { id: '4-3', name: '4:3', ratio: 4 / 3, icon: '🖼️' },
  { id: '3-2', name: '3:2', ratio: 3 / 2, icon: '📷' },
];

interface ImageCropProps {
  currentCrop?: CropArea;
  rotation: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  onCropChange: (crop: CropArea | undefined) => void;
  onRotationChange: (rotation: number) => void;
  onFlipHorizontalChange: (flip: boolean) => void;
  onFlipVerticalChange: (flip: boolean) => void;
}

export default function ImageCrop({
  currentCrop,
  rotation,
  flipHorizontal,
  flipVertical,
  onCropChange,
  onRotationChange,
  onFlipHorizontalChange,
  onFlipVerticalChange,
}: ImageCropProps) {
  const [activePreset, setActivePreset] = useState<string>('free');

  const handlePresetClick = (preset: CropPreset) => {
    setActivePreset(preset.id);
    // En production, déclencher le mode de recadrage avec le ratio sélectionné
  };

  const handleRotate = () => {
    onRotationChange((rotation + 90) % 360);
  };

  const handleFlipH = () => {
    onFlipHorizontalChange(!flipHorizontal);
  };

  const handleFlipV = () => {
    onFlipVerticalChange(!flipVertical);
  };

  const handleResetCrop = () => {
    onCropChange(undefined);
    setActivePreset('free');
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Crop className="w-4 h-4 text-primary-600" />
        <h3 className="sidebar-title m-0">Recadrage & Transformation</h3>
      </div>

      {/* Ratios de recadrage */}
      <div>
        <h4 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
          Ratios de recadrage
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {cropPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handlePresetClick(preset)}
              className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-all hover:scale-105 ${
                activePreset === preset.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-dark-200 hover:border-dark-300'
              }`}
              title={preset.name}
            >
              <span className="text-xl">{preset.icon}</span>
              <span className="text-[9px] text-dark-600 font-medium text-center">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Transformations */}
      <div className="space-y-2 pt-4 border-t border-dark-200">
        <h4 className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
          Transformations
        </h4>

        {/* Rotation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-dark-600">Rotation</label>
            <span className="text-xs text-dark-500">{rotation}°</span>
          </div>
          <div className="flex gap-2">
            <button onClick={handleRotate} className="flex-1 btn btn-secondary text-sm py-2">
              <RotateCw className="w-4 h-4 mr-2" />
              Pivoter 90°
            </button>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => onRotationChange(parseInt(e.target.value))}
            className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        {/* Retournement */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleFlipH}
            className={`btn text-sm py-2 ${
              flipHorizontal ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            <FlipHorizontal className="w-4 h-4 mr-1" />
            Miroir H
          </button>
          <button
            onClick={handleFlipV}
            className={`btn text-sm py-2 ${
              flipVertical ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            <FlipVertical className="w-4 h-4 mr-1" />
            Miroir V
          </button>
        </div>

        {/* Redimensionner à la zone de recadrage */}
        {currentCrop && (
          <div className="pt-2">
            <button className="w-full btn btn-secondary text-sm py-2">
              <Maximize2 className="w-4 h-4 mr-2" />
              Appliquer le recadrage
            </button>
          </div>
        )}

        {/* Réinitialiser */}
        <button
          onClick={handleResetCrop}
          className="w-full btn btn-ghost text-sm py-2 mt-2"
        >
          Réinitialiser tout
        </button>
      </div>

      {/* Info sur le recadrage actif */}
      {currentCrop && (
        <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-xs text-primary-700 font-medium">
            Zone de recadrage active
          </p>
          <p className="text-xs text-primary-600 mt-1">
            {Math.round(currentCrop.width)} × {Math.round(currentCrop.height)} px
          </p>
        </div>
      )}
    </div>
  );
}
