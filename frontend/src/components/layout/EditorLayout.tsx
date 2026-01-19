import { useEditorStore } from '@/stores/editorStore';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Maximize2 } from 'lucide-react';
import EditorHeader from './EditorHeader';
import EditorSidebar from './EditorSidebar';
import EditorCanvas from '../editor/EditorCanvas';
import PropertiesPanel from '../editor/PropertiesPanel';
import DrawingPanel from '../editor/DrawingPanel';

export default function EditorLayout() {
  const { selectedElementIds, mode, canvas, project, setZoom } = useEditorStore();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileProperties, setShowMobileProperties] = useState(false);
  const previousElementsCountRef = useRef(0);

  // Fermer les panneaux mobiles quand un nouvel élément est ajouté
  useEffect(() => {
    if (!project) return;

    const currentCount = project.elements.length;
    const previousCount = previousElementsCountRef.current;

    // Si un élément a été ajouté (le count a augmenté)
    if (currentCount > previousCount) {
      // Fermer les panneaux sur mobile
      if (window.innerWidth < 768) {
        setShowMobileProperties(false);
        setShowMobileSidebar(false);
      }
    }

    previousElementsCountRef.current = currentCount;
  }, [project?.elements.length]);

  const handleResetView = () => {
    if (!canvas || !project) return;

    const containerWidth = canvas.width || 800;
    const containerHeight = canvas.height || 600;
    const isMobile = window.innerWidth < 768;
    const padding = isMobile ? 20 : 100;

    const scaleX = (containerWidth - padding * 2) / project.dimensions.width;
    const scaleY = (containerHeight - padding * 2) / project.dimensions.height;
    const newZoom = Math.min(scaleX, scaleY, 1);

    canvas.setZoom(newZoom);
    canvas.viewportTransform = [newZoom, 0, 0, newZoom,
      (containerWidth - project.dimensions.width * newZoom) / 2,
      (containerHeight - project.dimensions.height * newZoom) / 2
    ];
    canvas.requestRenderAll();
    setZoom(newZoom);
  };

  return (
    <div className="h-screen flex flex-col bg-dark-100 overflow-hidden">
      {/* Header / Toolbar */}
      <EditorHeader />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Bouton menu mobile (visible uniquement sur mobile) */}
        <button
          onClick={() => setShowMobileSidebar(!showMobileSidebar)}
          className="md:hidden absolute top-4 left-4 z-50 bg-white rounded-lg p-2 shadow-lg"
        >
          {showMobileSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Sidebar gauche - responsive */}
        <div className={`
          ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          z-40
          h-full
          transition-transform duration-300
        `}>
          <EditorSidebar />
        </div>

        {/* Overlay mobile pour fermer le sidebar */}
        {showMobileSidebar && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowMobileSidebar(false)}
          />
        )}

        {/* Canvas principal */}
        <main className="flex-1 relative overflow-hidden">
          <EditorCanvas />

          {/* Bouton recentrer (mobile) */}
          <button
            onClick={handleResetView}
            className="md:hidden absolute top-4 right-4 z-50 bg-white rounded-lg p-2 shadow-lg"
            title="Recentrer la vue"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </main>

        {/* Bouton propriétés mobile (visible uniquement sur mobile si élément sélectionné) */}
        {selectedElementIds.length > 0 && (
          <button
            onClick={() => setShowMobileProperties(!showMobileProperties)}
            data-mobile-properties-toggle
            className="md:hidden absolute bottom-4 right-4 z-50 bg-primary-600 text-white rounded-full p-4 shadow-lg"
          >
            {showMobileProperties ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        )}

        {/* Panel propriétés - responsive */}
        {mode === 'draw' ? (
          <div className={`
            ${showMobileProperties ? 'translate-x-0' : 'translate-x-full'}
            md:translate-x-0
            fixed md:relative
            right-0
            z-40
            h-full
            transition-transform duration-300
          `}>
            <DrawingPanel />
          </div>
        ) : selectedElementIds.length > 0 ? (
          <>
            {/* Desktop: Sidebar à droite */}
            <aside className="hidden md:block w-72 bg-white border-l border-dark-200 overflow-y-auto">
              <PropertiesPanel />
            </aside>

            {/* Mobile: Panneau en bas */}
            <aside className={`
              md:hidden
              fixed bottom-0 left-0 right-0
              z-40
              bg-white/50 backdrop-blur-md border-t border-dark-200
              transition-transform duration-300
              ${showMobileProperties ? 'translate-y-0' : 'translate-y-full'}
              max-h-[30vh]
              overflow-y-auto
              rounded-t-2xl
              shadow-2xl
            `}>
              <PropertiesPanel />
            </aside>
          </>
        ) : null}
      </div>
    </div>
  );
}
