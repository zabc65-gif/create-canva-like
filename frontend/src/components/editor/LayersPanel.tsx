import { useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Type,
  Image as ImageIcon,
  Square,
  Video,
  Music,
} from 'lucide-react';
import type { CanvasElement } from '@create/shared';

const getElementIcon = (element: CanvasElement) => {
  switch (element.type) {
    case 'text':
      return Type;
    case 'image':
      return ImageIcon;
    case 'shape':
      return Square;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    default:
      return Square;
  }
};

const getElementLabel = (element: CanvasElement) => {
  if (element.name && element.name !== 'Nouvel élément') {
    return element.name;
  }

  switch (element.type) {
    case 'text':
      return (element as any).content?.substring(0, 20) || 'Texte';
    case 'image':
      return 'Image';
    case 'shape':
      return `Forme (${(element as any).shapeType})`;
    case 'video':
      return 'Vidéo';
    case 'audio':
      return 'Audio';
    default:
      return 'Élément';
  }
};

export default function LayersPanel() {
  const {
    project,
    selectedElementIds,
    selectElement,
    updateElement,
    deleteElement,
    duplicateElement,
  } = useEditorStore();

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (!project) return null;

  // Trier les éléments par zIndex (du plus haut au plus bas)
  const sortedElements = [...project.elements].sort((a, b) => b.zIndex - a.zIndex);

  const handleMoveUp = (element: CanvasElement) => {
    const currentIndex = project.elements.findIndex((el) => el.id === element.id);
    if (currentIndex >= project.elements.length - 1) return;

    const newElements = [...project.elements];
    const temp = newElements[currentIndex + 1];
    newElements[currentIndex + 1] = newElements[currentIndex];
    newElements[currentIndex] = temp;

    // Mettre à jour les zIndex
    newElements.forEach((el, idx) => {
      updateElement(el.id, { zIndex: idx });
    });
  };

  const handleMoveDown = (element: CanvasElement) => {
    const currentIndex = project.elements.findIndex((el) => el.id === element.id);
    if (currentIndex <= 0) return;

    const newElements = [...project.elements];
    const temp = newElements[currentIndex - 1];
    newElements[currentIndex - 1] = newElements[currentIndex];
    newElements[currentIndex] = temp;

    // Mettre à jour les zIndex
    newElements.forEach((el, idx) => {
      updateElement(el.id, { zIndex: idx });
    });
  };

  const toggleVisibility = (element: CanvasElement) => {
    updateElement(element.id, { visible: !element.visible });
  };

  const toggleLock = (element: CanvasElement) => {
    updateElement(element.id, { locked: !element.locked });
  };

  return (
    <div className="w-80 border-l border-dark-200 bg-white flex flex-col h-full">
      {/* En-tête */}
      <div className="p-4 border-b border-dark-200">
        <h3 className="text-lg font-semibold text-dark-900">Calques</h3>
        <p className="text-sm text-dark-500">{project.elements.length} élément(s)</p>
      </div>

      {/* Liste des calques */}
      <div className="flex-1 overflow-y-auto">
        {sortedElements.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="w-16 h-16 bg-dark-100 rounded-full flex items-center justify-center mb-4">
              <Square className="w-8 h-8 text-dark-400" />
            </div>
            <p className="text-sm text-dark-600 font-medium mb-1">Aucun calque</p>
            <p className="text-xs text-dark-400">
              Ajoutez des éléments au canvas pour les voir apparaître ici
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {sortedElements.map((element, displayIndex) => {
              const Icon = getElementIcon(element);
              const label = getElementLabel(element);
              const isSelected = selectedElementIds.includes(element.id);
              const isHovered = hoveredId === element.id;
              const isFirst = displayIndex === 0;
              const isLast = displayIndex === sortedElements.length - 1;

              return (
                <div
                  key={element.id}
                  onMouseEnter={() => setHoveredId(element.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => selectElement(element.id)}
                  className={`group relative flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-primary-100 border border-primary-300'
                      : isHovered
                      ? 'bg-dark-50'
                      : 'hover:bg-dark-50'
                  }`}
                >
                  {/* Icône de type */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded flex items-center justify-center ${
                      isSelected ? 'bg-primary-200' : 'bg-dark-100'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${isSelected ? 'text-primary-700' : 'text-dark-600'}`}
                    />
                  </div>

                  {/* Label */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isSelected ? 'text-primary-900' : 'text-dark-900'
                      }`}
                    >
                      {label}
                    </p>
                    <p className="text-xs text-dark-400">
                      z-index: {element.zIndex}
                    </p>
                  </div>

                  {/* Actions (visibles au survol ou si sélectionné) */}
                  <div
                    className={`flex items-center gap-1 ${
                      isHovered || isSelected ? 'opacity-100' : 'opacity-0'
                    } transition-opacity`}
                  >
                    {/* Visibilité */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(element);
                      }}
                      className="p-1 hover:bg-dark-200 rounded"
                      title={element.visible ? 'Masquer' : 'Afficher'}
                    >
                      {element.visible ? (
                        <Eye className="w-4 h-4 text-dark-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-dark-400" />
                      )}
                    </button>

                    {/* Verrouillage */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(element);
                      }}
                      className="p-1 hover:bg-dark-200 rounded"
                      title={element.locked ? 'Déverrouiller' : 'Verrouiller'}
                    >
                      {element.locked ? (
                        <Lock className="w-4 h-4 text-dark-600" />
                      ) : (
                        <Unlock className="w-4 h-4 text-dark-400" />
                      )}
                    </button>

                    {/* Monter */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveUp(element);
                      }}
                      disabled={isFirst}
                      className="p-1 hover:bg-dark-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Monter"
                    >
                      <ChevronUp className="w-4 h-4 text-dark-600" />
                    </button>

                    {/* Descendre */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveDown(element);
                      }}
                      disabled={isLast}
                      className="p-1 hover:bg-dark-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Descendre"
                    >
                      <ChevronDown className="w-4 h-4 text-dark-600" />
                    </button>

                    {/* Dupliquer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateElement(element.id);
                      }}
                      className="p-1 hover:bg-dark-200 rounded"
                      title="Dupliquer"
                    >
                      <Copy className="w-4 h-4 text-dark-600" />
                    </button>

                    {/* Supprimer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteElement(element.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-dark-200 bg-dark-50">
        <p className="text-xs text-dark-600">
          <span className="font-medium">Astuce:</span> Utilisez les boutons ↑ ↓ pour réorganiser
          les calques et modifier leur ordre d'affichage.
        </p>
      </div>
    </div>
  );
}
