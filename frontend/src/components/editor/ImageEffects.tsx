import { useState } from 'react';
import { Wand2, Square, Circle } from 'lucide-react';

interface ImageEffect {
  shadow: {
    enabled: boolean;
    blur: number;
    offsetX: number;
    offsetY: number;
    color: string;
    opacity: number;
  };
  border: {
    enabled: boolean;
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
  };
  corners: {
    enabled: boolean;
    radius: number;
  };
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
    blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  };
}

interface ImageEffectsProps {
  currentEffects: Partial<ImageEffect>;
  onEffectsChange: (effects: Partial<ImageEffect>) => void;
}

export default function ImageEffects({ currentEffects, onEffectsChange }: ImageEffectsProps) {
  const [shadowEnabled, setShadowEnabled] = useState(currentEffects.shadow?.enabled || false);
  const [borderEnabled, setBorderEnabled] = useState(currentEffects.border?.enabled || false);
  const [cornersEnabled, setCornersEnabled] = useState(currentEffects.corners?.enabled || false);
  const [overlayEnabled, setOverlayEnabled] = useState(currentEffects.overlay?.enabled || false);

  const updateShadow = (updates: Partial<ImageEffect['shadow']>) => {
    onEffectsChange({
      ...currentEffects,
      shadow: {
        enabled: shadowEnabled,
        blur: 10,
        offsetX: 0,
        offsetY: 4,
        color: '#000000',
        opacity: 0.3,
        ...currentEffects.shadow,
        ...updates,
      },
    });
  };

  const updateBorder = (updates: Partial<ImageEffect['border']>) => {
    onEffectsChange({
      ...currentEffects,
      border: {
        enabled: borderEnabled,
        width: 2,
        color: '#000000',
        style: 'solid',
        ...currentEffects.border,
        ...updates,
      },
    });
  };

  const updateCorners = (updates: Partial<ImageEffect['corners']>) => {
    onEffectsChange({
      ...currentEffects,
      corners: {
        enabled: cornersEnabled,
        radius: 8,
        ...currentEffects.corners,
        ...updates,
      },
    });
  };

  const updateOverlay = (updates: Partial<ImageEffect['overlay']>) => {
    onEffectsChange({
      ...currentEffects,
      overlay: {
        enabled: overlayEnabled,
        color: '#000000',
        opacity: 0.2,
        blendMode: 'overlay',
        ...currentEffects.overlay,
        ...updates,
      },
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Wand2 className="w-4 h-4 text-primary-600" />
        <h3 className="sidebar-title m-0">Effets Visuels</h3>
      </div>

      {/* Ombre portée */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-700">Ombre portée</label>
          <input
            type="checkbox"
            checked={shadowEnabled}
            onChange={(e) => {
              setShadowEnabled(e.target.checked);
              updateShadow({ enabled: e.target.checked });
            }}
            className="w-4 h-4 accent-primary-500"
          />
        </div>

        {shadowEnabled && (
          <div className="space-y-2 pl-4 border-l-2 border-primary-200">
            <div>
              <label className="text-xs text-dark-600">Flou</label>
              <input
                type="range"
                min="0"
                max="50"
                value={currentEffects.shadow?.blur || 10}
                onChange={(e) => updateShadow({ blur: parseInt(e.target.value) })}
                className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-xs text-dark-500">{currentEffects.shadow?.blur || 10}px</span>
            </div>

            <div>
              <label className="text-xs text-dark-600">Décalage Y</label>
              <input
                type="range"
                min="-20"
                max="20"
                value={currentEffects.shadow?.offsetY || 4}
                onChange={(e) => updateShadow({ offsetY: parseInt(e.target.value) })}
                className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-xs text-dark-500">{currentEffects.shadow?.offsetY || 4}px</span>
            </div>

            <div>
              <label className="text-xs text-dark-600">Opacité</label>
              <input
                type="range"
                min="0"
                max="100"
                value={(currentEffects.shadow?.opacity || 0.3) * 100}
                onChange={(e) => updateShadow({ opacity: parseInt(e.target.value) / 100 })}
                className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-xs text-dark-500">
                {Math.round((currentEffects.shadow?.opacity || 0.3) * 100)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bordure */}
      <div className="space-y-2 pt-3 border-t border-dark-200">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-700">Bordure</label>
          <input
            type="checkbox"
            checked={borderEnabled}
            onChange={(e) => {
              setBorderEnabled(e.target.checked);
              updateBorder({ enabled: e.target.checked });
            }}
            className="w-4 h-4 accent-primary-500"
          />
        </div>

        {borderEnabled && (
          <div className="space-y-2 pl-4 border-l-2 border-primary-200">
            <div>
              <label className="text-xs text-dark-600">Épaisseur</label>
              <input
                type="range"
                min="1"
                max="20"
                value={currentEffects.border?.width || 2}
                onChange={(e) => updateBorder({ width: parseInt(e.target.value) })}
                className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-xs text-dark-500">{currentEffects.border?.width || 2}px</span>
            </div>

            <div>
              <label className="text-xs text-dark-600 block mb-1">Couleur</label>
              <input
                type="color"
                value={currentEffects.border?.color || '#000000'}
                onChange={(e) => updateBorder({ color: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-dark-600 block mb-1">Style</label>
              <select
                value={currentEffects.border?.style || 'solid'}
                onChange={(e) => updateBorder({ style: e.target.value as any })}
                className="w-full input text-sm py-1"
              >
                <option value="solid">Pleine</option>
                <option value="dashed">Tirets</option>
                <option value="dotted">Points</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Coins arrondis */}
      <div className="space-y-2 pt-3 border-t border-dark-200">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-700">Coins arrondis</label>
          <input
            type="checkbox"
            checked={cornersEnabled}
            onChange={(e) => {
              setCornersEnabled(e.target.checked);
              updateCorners({ enabled: e.target.checked });
            }}
            className="w-4 h-4 accent-primary-500"
          />
        </div>

        {cornersEnabled && (
          <div className="space-y-2 pl-4 border-l-2 border-primary-200">
            <div>
              <label className="text-xs text-dark-600">Rayon</label>
              <input
                type="range"
                min="0"
                max="100"
                value={currentEffects.corners?.radius || 8}
                onChange={(e) => updateCorners({ radius: parseInt(e.target.value) })}
                className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-xs text-dark-500">{currentEffects.corners?.radius || 8}px</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => updateCorners({ radius: 8 })}
                className="flex-1 btn btn-secondary text-xs py-1"
              >
                <Square className="w-3 h-3 mr-1" />
                Léger
              </button>
              <button
                onClick={() => updateCorners({ radius: 999 })}
                className="flex-1 btn btn-secondary text-xs py-1"
              >
                <Circle className="w-3 h-3 mr-1" />
                Cercle
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Superposition de couleur */}
      <div className="space-y-2 pt-3 border-t border-dark-200">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-dark-700">Superposition</label>
          <input
            type="checkbox"
            checked={overlayEnabled}
            onChange={(e) => {
              setOverlayEnabled(e.target.checked);
              updateOverlay({ enabled: e.target.checked });
            }}
            className="w-4 h-4 accent-primary-500"
          />
        </div>

        {overlayEnabled && (
          <div className="space-y-2 pl-4 border-l-2 border-primary-200">
            <div>
              <label className="text-xs text-dark-600 block mb-1">Couleur</label>
              <input
                type="color"
                value={currentEffects.overlay?.color || '#000000'}
                onChange={(e) => updateOverlay({ color: e.target.value })}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs text-dark-600">Opacité</label>
              <input
                type="range"
                min="0"
                max="100"
                value={(currentEffects.overlay?.opacity || 0.2) * 100}
                onChange={(e) => updateOverlay({ opacity: parseInt(e.target.value) / 100 })}
                className="w-full h-2 bg-dark-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-xs text-dark-500">
                {Math.round((currentEffects.overlay?.opacity || 0.2) * 100)}%
              </span>
            </div>

            <div>
              <label className="text-xs text-dark-600 block mb-1">Mode de fusion</label>
              <select
                value={currentEffects.overlay?.blendMode || 'overlay'}
                onChange={(e) => updateOverlay({ blendMode: e.target.value as any })}
                className="w-full input text-sm py-1"
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiplier</option>
                <option value="screen">Écran</option>
                <option value="overlay">Superposition</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de réinitialisation */}
      <button
        onClick={() => {
          setShadowEnabled(false);
          setBorderEnabled(false);
          setCornersEnabled(false);
          setOverlayEnabled(false);
          onEffectsChange({});
        }}
        className="w-full btn btn-ghost text-sm py-2 mt-4"
      >
        Réinitialiser les effets
      </button>
    </div>
  );
}
