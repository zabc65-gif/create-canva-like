import { useState } from 'react';
import { useDrawing } from '@/hooks/useDrawing';

const brushSizes = [
  { value: 2, label: 'Fin' },
  { value: 5, label: 'Moyen' },
  { value: 10, label: 'Épais' },
  { value: 20, label: 'Très épais' },
];

const colors = [
  '#000000',
  '#ffffff',
  '#ef4444',
  '#f59e0b',
  '#eab308',
  '#22c55e',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
];

export default function DrawingPanel() {
  const [color, setColor] = useState('#000000');
  const [brushWidth, setBrushWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);

  useDrawing({ color, width: brushWidth, opacity });

  return (
    <div className="w-80 border-l border-dark-200 bg-white p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h3 className="text-lg font-semibold text-dark-900 mb-1">Outils de dessin</h3>
          <p className="text-sm text-dark-500">Dessinez librement sur le canvas</p>
        </div>

        {/* Couleur */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Couleur
          </label>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  color === c
                    ? 'border-primary-500 scale-110'
                    : 'border-dark-200 hover:border-dark-300'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded border border-dark-200 cursor-pointer"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="flex-1 px-3 py-2 border border-dark-200 rounded-lg text-sm"
              placeholder="#000000"
            />
          </div>
        </div>

        {/* Taille du pinceau */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Taille du pinceau
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {brushSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => setBrushWidth(size.value)}
                className={`p-2 rounded-lg border-2 text-center transition-colors ${
                  brushWidth === size.value
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-dark-200 hover:border-dark-300'
                }`}
              >
                <div className="flex items-center justify-center mb-1">
                  <div
                    className="rounded-full bg-dark-900"
                    style={{
                      width: `${size.value}px`,
                      height: `${size.value}px`,
                    }}
                  />
                </div>
                <span
                  className={`text-xs ${
                    brushWidth === size.value ? 'text-primary-700 font-medium' : 'text-dark-600'
                  }`}
                >
                  {size.label}
                </span>
              </button>
            ))}
          </div>
          <input
            type="range"
            min="1"
            max="50"
            value={brushWidth}
            onChange={(e) => setBrushWidth(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
            <span>1px</span>
            <span className="font-medium text-dark-700">{brushWidth}px</span>
            <span>50px</span>
          </div>
        </div>

        {/* Opacité */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Opacité
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex items-center justify-between text-xs text-dark-500 mt-1">
            <span>0%</span>
            <span className="font-medium text-dark-700">{Math.round(opacity * 100)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Aperçu */}
        <div>
          <label className="block text-sm font-medium text-dark-700 mb-2">
            Aperçu
          </label>
          <div className="bg-dark-50 rounded-lg p-4 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 shadow-sm">
              <svg width="120" height="60" viewBox="0 0 120 60">
                <path
                  d="M 10 30 Q 40 10, 60 30 T 110 30"
                  fill="none"
                  stroke={color}
                  strokeWidth={brushWidth}
                  opacity={opacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-primary-50 rounded-lg p-3 border border-primary-200">
          <p className="text-xs text-primary-700 font-medium mb-1">
            💡 Astuce
          </p>
          <p className="text-xs text-primary-600">
            Cliquez et faites glisser sur le canvas pour dessiner. Appuyez sur Échap pour quitter le mode dessin.
          </p>
        </div>
      </div>
    </div>
  );
}
