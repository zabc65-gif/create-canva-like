import { useEditorStore } from '@/stores/editorStore';
import {
  LayoutGrid,
  Type,
  Upload,
  ImageIcon,
  Layers,
  Square,
  Circle,
  Triangle,
  Star,
  Minus,
  FileStack,
  Palette,
} from 'lucide-react';
import type { ShapeType, TextElement, ShapeElement } from '@create/shared';
import { generatePrefixedId } from '@create/shared';
import LayersPanel from '../editor/LayersPanel';
import PhotoLibrary from '../editor/PhotoLibrary';
import ImageUploader from '../editor/ImageUploader';
import TemplatesGallery from '../editor/TemplatesGallery';

const tabs = [
  { id: 'canvas', icon: Palette, label: 'Fond' },
  { id: 'elements', icon: LayoutGrid, label: 'Éléments' },
  { id: 'text', icon: Type, label: 'Texte' },
  { id: 'layers', icon: FileStack, label: 'Calques' },
  { id: 'uploads', icon: Upload, label: 'Imports' },
  { id: 'photos', icon: ImageIcon, label: 'Photos' },
  { id: 'templates', icon: Layers, label: 'Templates' },
] as const;

const shapes: { type: ShapeType; icon: typeof Square; label: string }[] = [
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Cercle' },
  { type: 'triangle', icon: Triangle, label: 'Triangle' },
  { type: 'line', icon: Minus, label: 'Ligne' },
  { type: 'star', icon: Star, label: 'Étoile' },
];

const textPresets = [
  { label: 'Titre', fontSize: 48, fontWeight: 700 },
  { label: 'Sous-titre', fontSize: 32, fontWeight: 600 },
  { label: 'Paragraphe', fontSize: 16, fontWeight: 400 },
  { label: 'Légende', fontSize: 12, fontWeight: 400 },
];

export default function EditorSidebar() {
  const { activeTab, setActiveTab, addElement, project } = useEditorStore();

  const handleAddText = (preset: (typeof textPresets)[number]) => {
    if (!project) return;

    const textElement: TextElement = {
      id: generatePrefixedId('txt'),
      type: 'text',
      name: preset.label,
      content: 'Nouveau texte',
      fontFamily: 'Inter',
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#000000',
      lineHeight: 1.4,
      letterSpacing: 0,
      transform: {
        x: project.dimensions.width / 2 - 100,
        y: project.dimensions.height / 2 - preset.fontSize / 2,
        width: 200,
        height: preset.fontSize * 1.4,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 0,
    };

    addElement(textElement);
  };

  const handleAddShape = (shapeType: ShapeType) => {
    if (!project) return;

    const size = 100;
    const shapeElement: ShapeElement = {
      id: generatePrefixedId('shp'),
      type: 'shape',
      name: shapeType.charAt(0).toUpperCase() + shapeType.slice(1),
      shapeType,
      fill: '#3b82f6',
      stroke: '#1d4ed8',
      strokeWidth: 0,
      cornerRadius: shapeType === 'rectangle' ? 8 : undefined,
      points: shapeType === 'star' ? 5 : shapeType === 'polygon' ? 6 : undefined,
      transform: {
        x: project.dimensions.width / 2 - size / 2,
        y: project.dimensions.height / 2 - size / 2,
        width: size,
        height: shapeType === 'line' ? 4 : size,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
      opacity: 1,
      visible: true,
      locked: false,
      zIndex: 0,
    };

    addElement(shapeElement);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'canvas':
        return (
          <div className="p-4">
            <div className="sidebar-section space-y-4">
              <h3 className="sidebar-title">Propriétés du canvas</h3>

              {/* Couleur de fond */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-700">Couleur de fond</label>
                <input
                  type="color"
                  value={project?.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    if (project) {
                      const updatedProject = {
                        ...project,
                        backgroundColor: e.target.value,
                      };
                      useEditorStore.setState({ project: updatedProject });
                    }
                  }}
                  className="w-full h-12 rounded border border-dark-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={project?.backgroundColor || '#ffffff'}
                  onChange={(e) => {
                    if (project) {
                      const updatedProject = {
                        ...project,
                        backgroundColor: e.target.value,
                      };
                      useEditorStore.setState({ project: updatedProject });
                    }
                  }}
                  className="w-full px-3 py-2 border border-dark-300 rounded-lg font-mono text-sm"
                  placeholder="#ffffff"
                />
              </div>

              {/* Dimensions */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-700">Dimensions</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-dark-500">Largeur</label>
                    <input
                      type="number"
                      value={project?.dimensions.width || 0}
                      readOnly
                      className="w-full px-3 py-2 border border-dark-300 rounded-lg bg-dark-100 cursor-not-allowed text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-dark-500">Hauteur</label>
                    <input
                      type="number"
                      value={project?.dimensions.height || 0}
                      readOnly
                      className="w-full px-3 py-2 border border-dark-300 rounded-lg bg-dark-100 cursor-not-allowed text-sm"
                    />
                  </div>
                </div>
                <p className="text-xs text-dark-500">
                  Les dimensions ne peuvent pas être modifiées après la création du projet.
                </p>
              </div>
            </div>
          </div>
        );

      case 'elements':
        return (
          <div className="p-4">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Formes</h3>
              <div className="grid grid-cols-3 gap-2">
                {shapes.map((shape) => (
                  <button
                    key={shape.type}
                    onClick={() => handleAddShape(shape.type)}
                    className="aspect-square bg-dark-50 rounded-lg flex flex-col items-center justify-center gap-1 hover:bg-dark-100 transition-colors"
                    title={shape.label}
                  >
                    <shape.icon className="w-6 h-6 text-dark-600" />
                    <span className="text-xs text-dark-500">{shape.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="p-4">
            <div className="sidebar-section">
              <h3 className="sidebar-title">Styles de texte</h3>
              <div className="space-y-2">
                {textPresets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleAddText(preset)}
                    className="w-full p-3 bg-dark-50 rounded-lg text-left hover:bg-dark-100 transition-colors"
                  >
                    <span
                      style={{
                        fontSize: `${Math.min(preset.fontSize, 24)}px`,
                        fontWeight: preset.fontWeight,
                      }}
                    >
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'uploads':
        return <ImageUploader />;

      case 'photos':
        return <PhotoLibrary />;

      case 'layers':
        return <LayersPanel />;

      case 'templates':
        return <TemplatesGallery />;

      default:
        return null;
    }
  };

  return (
    <aside className="sidebar">
      {/* Tabs */}
      <div className="flex flex-wrap border-b border-dark-200 flex-shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 min-w-[calc(33.333%-2px)] p-2 flex flex-col items-center gap-1 text-xs transition-colors ${
              activeTab === tab.id
                ? 'text-primary-600 border-b-2 border-primary-500 bg-primary-50'
                : 'text-dark-500 hover:text-dark-700 hover:bg-dark-50'
            }`}
            title={tab.label}
          >
            <tab.icon className="w-4 h-4" />
            <span className="whitespace-nowrap text-[10px] leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">{renderTabContent()}</div>
    </aside>
  );
}
