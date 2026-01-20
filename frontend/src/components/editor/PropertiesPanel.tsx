import { useEditorStore } from '@/stores/editorStore';
import { useEffect, useState } from 'react';
import {
  Trash2,
  Copy,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Link,
  Unlink,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter,
  Maximize2,
} from 'lucide-react';
import type { TextElement, ShapeElement, ImageElement } from '@create/shared';
import ImageFiltersPanel from './ImageFilters';
import { RotateCw, FlipHorizontal, FlipVertical } from 'lucide-react';

export default function PropertiesPanel() {
  const {
    updateElement,
    deleteElement,
    duplicateElement,
    bringToFront,
    sendToBack,
    bringForward,
    sendBackward,
    project,
    selectedElementIds,
    setProject,
  } = useEditorStore();

  // State local pour forcer le re-render
  const [renderCount, setRenderCount] = useState(0);

  // Récupérer l'élément sélectionné
  const element = project && selectedElementIds.length > 0
    ? project.elements.find(el => el.id === selectedElementIds[0]) || null
    : null;

  // State pour le verrouillage du ratio (aspect ratio lock)
  // Initialisé depuis l'élément si c'est une image, sinon true par défaut
  const [lockAspectRatio, setLockAspectRatio] = useState(
    element?.type === 'image' ? (element.lockAspectRatio ?? true) : true
  );

  // Synchroniser lockAspectRatio avec l'élément quand il change
  useEffect(() => {
    if (element?.type === 'image') {
      setLockAspectRatio(element.lockAspectRatio ?? true);
    }
  }, [element?.id, element?.type]);

  // Forcer un re-render quand project.elements change
  useEffect(() => {
    if (element) {
      console.log('🟢 PropertiesPanel re-render, element transform:', {
        x: element.transform.x,
        y: element.transform.y,
        width: element.transform.width,
        height: element.transform.height,
        rotation: element.transform.rotation,
      });
    }
    setRenderCount(prev => prev + 1);
  }, [project?.elements, element?.transform.x, element?.transform.y, element?.transform.width, element?.transform.height, element?.transform.rotation]);

  // Si aucun élément n'est sélectionné, afficher les propriétés du canvas
  if (!element) {
    return (
      <div className="p-3 md:p-4 space-y-3 md:space-y-6">
        {/* Poignée de déplacement mobile */}
        <div className="md:hidden flex justify-center -mt-1 mb-2">
          <div className="w-12 h-1 bg-dark-300 rounded-full"></div>
        </div>

        <h3 className="text-lg font-semibold text-dark-800">Propriétés du canvas</h3>

        {/* Couleur de fond */}
        <div className="space-y-3">
          <h4 className="sidebar-title">Couleur de fond</h4>
          <input
            type="color"
            value={project?.backgroundColor || '#ffffff'}
            onChange={(e) => {
              if (project) {
                setProject({
                  ...project,
                  backgroundColor: e.target.value,
                });
              }
            }}
            className="w-full h-10 rounded border border-dark-300 cursor-pointer"
          />
          <input
            type="text"
            value={project?.backgroundColor || '#ffffff'}
            onChange={(e) => {
              if (project) {
                setProject({
                  ...project,
                  backgroundColor: e.target.value,
                });
              }
            }}
            className="input text-sm font-mono"
            placeholder="#ffffff"
          />
        </div>

        {/* Dimensions du canvas */}
        <div className="space-y-3">
          <h4 className="sidebar-title">Dimensions</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-dark-500">Largeur</label>
              <input
                type="number"
                value={project?.dimensions.width || 0}
                readOnly
                className="input text-sm bg-dark-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs text-dark-500">Hauteur</label>
              <input
                type="number"
                value={project?.dimensions.height || 0}
                readOnly
                className="input text-sm bg-dark-100 cursor-not-allowed"
              />
            </div>
          </div>
          <p className="text-xs text-dark-500">
            Les dimensions du canvas ne peuvent pas être modifiées après la création.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (key: string, value: unknown) => {
    updateElement(element.id, { [key]: value } as any);
  };

  const handleTransformChange = (key: string, value: number) => {
    // Si on change la largeur ou hauteur et que le ratio est verrouillé
    if ((key === 'width' || key === 'height') && lockAspectRatio && element.type === 'image') {
      const currentRatio = element.transform.width / element.transform.height;

      if (key === 'width') {
        // Ajuster la hauteur proportionnellement
        const newHeight = value / currentRatio;
        updateElement(element.id, {
          transform: {
            ...element.transform,
            width: value,
            height: newHeight,
          },
        } as any);
      } else {
        // Ajuster la largeur proportionnellement
        const newWidth = value * currentRatio;
        updateElement(element.id, {
          transform: {
            ...element.transform,
            width: newWidth,
            height: value,
          },
        } as any);
      }
    } else {
      updateElement(element.id, {
        transform: {
          ...element.transform,
          [key]: value,
        },
      } as any);
    }
  };

  // Fonctions de centrage
  const centerHorizontally = () => {
    if (!project) return;
    const newX = (project.dimensions.width - element.transform.width) / 2;
    updateElement(element.id, {
      transform: {
        ...element.transform,
        x: newX,
      },
    } as any);
  };

  const centerVertically = () => {
    if (!project) return;
    const newY = (project.dimensions.height - element.transform.height) / 2;
    updateElement(element.id, {
      transform: {
        ...element.transform,
        y: newY,
      },
    } as any);
  };

  const centerBoth = () => {
    if (!project) return;
    const newX = (project.dimensions.width - element.transform.width) / 2;
    const newY = (project.dimensions.height - element.transform.height) / 2;
    updateElement(element.id, {
      transform: {
        ...element.transform,
        x: newX,
        y: newY,
      },
    } as any);
  };

  return (
    <div className="p-3 md:p-4 space-y-3 md:space-y-6">
      {/* Poignée de déplacement mobile */}
      <div className="md:hidden flex justify-center -mt-1 mb-2">
        <div className="w-12 h-1 bg-dark-300 rounded-full"></div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-dark-900 capitalize">{element.type}</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => duplicateElement(element.id)}
            className="tool-button"
            title="Dupliquer"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleChange('locked', !element.locked)}
            className="tool-button"
            title={element.locked ? 'Déverrouiller' : 'Verrouiller'}
          >
            {element.locked ? (
              <Lock className="w-4 h-4" />
            ) : (
              <Unlock className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => handleChange('visible', !element.visible)}
            className="tool-button"
            title={element.visible ? 'Masquer' : 'Afficher'}
          >
            {element.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => deleteElement(element.id)}
            className="tool-button text-red-500 hover:bg-red-50"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Position & Taille */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="sidebar-title">Position & Taille</h4>
          {element.type === 'image' && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={lockAspectRatio}
                onChange={(e) => {
                  const newValue = e.target.checked;
                  setLockAspectRatio(newValue);
                  // Sauvegarder dans l'élément si c'est une image
                  if (element.type === 'image') {
                    updateElement(element.id, {
                      lockAspectRatio: newValue,
                    } as any);
                  }
                }}
                className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs text-dark-600">Conserver les proportions</span>
            </label>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-dark-500">X</label>
            <input
              type="number"
              value={Math.round(element.transform.x)}
              onChange={(e) => handleTransformChange('x', parseFloat(e.target.value))}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-dark-500">Y</label>
            <input
              type="number"
              value={Math.round(element.transform.y)}
              onChange={(e) => handleTransformChange('y', parseFloat(e.target.value))}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-dark-500">Largeur</label>
            <input
              type="number"
              value={Math.round(element.transform.width)}
              onChange={(e) => handleTransformChange('width', parseFloat(e.target.value))}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-dark-500">Hauteur</label>
            <input
              type="number"
              value={Math.round(element.transform.height)}
              onChange={(e) => handleTransformChange('height', parseFloat(e.target.value))}
              className="input text-sm"
            />
          </div>
        </div>

        {/* Boutons de centrage */}
        <div className="flex gap-2">
          <button
            onClick={centerHorizontally}
            className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"
            title="Centrer horizontalement"
          >
            <AlignHorizontalJustifyCenter size={14} />
            <span className="hidden sm:inline">Centrer H</span>
          </button>
          <button
            onClick={centerVertically}
            className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"
            title="Centrer verticalement"
          >
            <AlignVerticalJustifyCenter size={14} />
            <span className="hidden sm:inline">Centrer V</span>
          </button>
          <button
            onClick={centerBoth}
            className="flex-1 btn-secondary text-xs py-2 flex items-center justify-center gap-1"
            title="Centrer complètement"
          >
            <Maximize2 size={14} />
            <span className="hidden sm:inline">Centrer</span>
          </button>
        </div>

        <div>
          <label className="text-xs text-dark-500">Rotation</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={element.transform.rotation}
            onChange={(e) => handleTransformChange('rotation', parseFloat(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-dark-500">{Math.round(element.transform.rotation)}°</span>
        </div>
      </div>

      {/* Opacité */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Opacité</h4>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={element.opacity}
          onChange={(e) => handleChange('opacity', parseFloat(e.target.value))}
          className="w-full"
        />
        <span className="text-xs text-dark-500">{Math.round(element.opacity * 100)}%</span>
      </div>

      {/* Ordre d'empilement (Z-index) */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Ordre d'empilement</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => bringToFront(element.id)}
            className="btn-secondary text-xs py-2 flex items-center justify-center gap-1"
            title="Mettre au premier plan"
          >
            <ChevronsUp className="w-4 h-4" />
            Premier plan
          </button>
          <button
            onClick={() => sendToBack(element.id)}
            className="btn-secondary text-xs py-2 flex items-center justify-center gap-1"
            title="Mettre à l'arrière-plan"
          >
            <ChevronsDown className="w-4 h-4" />
            Arrière-plan
          </button>
          <button
            onClick={() => bringForward(element.id)}
            className="btn-secondary text-xs py-2 flex items-center justify-center gap-1"
            title="Avancer d'un niveau"
          >
            <ArrowUp className="w-4 h-4" />
            Avancer
          </button>
          <button
            onClick={() => sendBackward(element.id)}
            className="btn-secondary text-xs py-2 flex items-center justify-center gap-1"
            title="Reculer d'un niveau"
          >
            <ArrowDown className="w-4 h-4" />
            Reculer
          </button>
        </div>
      </div>

      {/* Propriétés spécifiques aux images */}
      {element.type === 'image' && (
        <ImageProperties
          element={element as ImageElement}
          onChange={(key, value) => updateElement(element.id, { [key]: value } as any)}
        />
      )}

      {/* Propriétés spécifiques au texte */}
      {element.type === 'text' && (
        <TextProperties
          element={element as TextElement}
          onChange={(key, value) => updateElement(element.id, { [key]: value } as any)}
        />
      )}

      {/* Propriétés spécifiques aux formes */}
      {element.type === 'shape' && (
        <ShapeProperties
          element={element as ShapeElement}
          onChange={(key, value) => updateElement(element.id, { [key]: value } as any)}
        />
      )}
    </div>
  );
}

function TextProperties({
  element,
  onChange,
}: {
  element: TextElement;
  onChange: (key: string, value: unknown) => void;
}) {
  const alignOptions = [
    { value: 'left', icon: AlignLeft },
    { value: 'center', icon: AlignCenter },
    { value: 'right', icon: AlignRight },
    { value: 'justify', icon: AlignJustify },
  ] as const;

  return (
    <>
      {/* Police */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Police</h4>
        <select
          value={element.fontFamily}
          onChange={(e) => onChange('fontFamily', e.target.value)}
          className="input text-sm"
        >
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Georgia">Georgia</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>
        <div className="flex gap-2">
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) => onChange('fontSize', parseInt(e.target.value))}
            className="input text-sm flex-1"
            min="8"
            max="200"
          />
          <button
            onClick={() =>
              onChange('fontWeight', element.fontWeight === 700 ? 400 : 700)
            }
            className={`tool-button ${element.fontWeight === 700 ? 'active' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              onChange('fontStyle', element.fontStyle === 'italic' ? 'normal' : 'italic')
            }
            className={`tool-button ${element.fontStyle === 'italic' ? 'active' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alignement */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Alignement</h4>
        <div className="flex gap-1">
          {alignOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange('textAlign', opt.value)}
              className={`tool-button flex-1 ${
                element.textAlign === opt.value ? 'active' : ''
              }`}
            >
              <opt.icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>

      {/* Couleur */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Couleur</h4>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={element.color}
            onChange={(e) => onChange('color', e.target.value)}
            className="input text-sm flex-1"
          />
        </div>
      </div>
    </>
  );
}

function ShapeProperties({
  element,
  onChange,
}: {
  element: ShapeElement;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <>
      {/* Remplissage */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Remplissage</h4>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.fill}
            onChange={(e) => onChange('fill', e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={element.fill}
            onChange={(e) => onChange('fill', e.target.value)}
            className="input text-sm flex-1"
          />
        </div>
      </div>

      {/* Contour */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Contour</h4>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.stroke}
            onChange={(e) => onChange('stroke', e.target.value)}
            className="w-10 h-10 rounded cursor-pointer"
          />
          <input
            type="number"
            value={element.strokeWidth}
            onChange={(e) => onChange('strokeWidth', parseInt(e.target.value))}
            className="input text-sm w-20"
            min="0"
            max="50"
          />
        </div>
      </div>

      {/* Coins arrondis (rectangle) */}
      {element.shapeType === 'rectangle' && (
        <div className="space-y-3">
          <h4 className="sidebar-title">Coins arrondis</h4>
          <input
            type="range"
            min="0"
            max="100"
            value={element.cornerRadius || 0}
            onChange={(e) => onChange('cornerRadius', parseInt(e.target.value))}
            className="w-full"
          />
          <span className="text-xs text-dark-500">{element.cornerRadius || 0}px</span>
        </div>
      )}
    </>
  );
}

function ImageProperties({
  element,
  onChange,
}: {
  element: ImageElement;
  onChange: (key: string, value: unknown) => void;
}) {
  const handleRotate90 = () => {
    const currentRotation = element.transform.rotation || 0;
    onChange('transform', {
      ...element.transform,
      rotation: currentRotation + 90,
    });
  };

  const handleFlipHorizontal = () => {
    onChange('transform', {
      ...element.transform,
      scaleX: -(element.transform.scaleX || 1),
    });
  };

  const handleFlipVertical = () => {
    onChange('transform', {
      ...element.transform,
      scaleY: -(element.transform.scaleY || 1),
    });
  };

  return (
    <>
      {/* Transformations */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Transformations</h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleRotate90}
            className="btn-secondary text-xs py-2 flex flex-col items-center justify-center gap-1"
            title="Rotation 90°"
          >
            <RotateCw className="w-4 h-4" />
            <span className="text-[10px]">Rotation</span>
          </button>
          <button
            onClick={handleFlipHorizontal}
            className="btn-secondary text-xs py-2 flex flex-col items-center justify-center gap-1"
            title="Miroir horizontal"
          >
            <FlipHorizontal className="w-4 h-4" />
            <span className="text-[10px]">Miroir H</span>
          </button>
          <button
            onClick={handleFlipVertical}
            className="btn-secondary text-xs py-2 flex flex-col items-center justify-center gap-1"
            title="Miroir vertical"
          >
            <FlipVertical className="w-4 h-4" />
            <span className="text-[10px]">Miroir V</span>
          </button>
        </div>
      </div>

      {/* Filtres d'image */}
      {element.filters && (
        <ImageFiltersPanel
          currentFilters={element.filters}
          onFiltersChange={(filters) => onChange('filters', filters)}
        />
      )}
    </>
  );
}
