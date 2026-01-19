import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditorStore } from '@/stores/editorStore';
import { useAuthStore } from '@/stores/authStore';
import { api } from '@/services/api';
import { useAutoSave } from '@/hooks/useAutoSave';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Download,
  Share2,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Type,
  Square,
  Pencil,
  Hand,
  Menu,
  X,
  Save,
  Cloud,
} from 'lucide-react';
import ExportModal from '@/components/editor/ExportModal';

const tools = [
  { id: 'select', icon: MousePointer2, label: 'Sélection (V)' },
  { id: 'text', icon: Type, label: 'Texte (T)' },
  { id: 'shape', icon: Square, label: 'Formes (S)' },
  { id: 'draw', icon: Pencil, label: 'Dessin (D)' },
  { id: 'pan', icon: Hand, label: 'Déplacer (H)' },
] as const;

export default function EditorHeader() {
  const navigate = useNavigate();
  const { project, mode, setMode, zoom, setZoom, undo, redo, historyIndex, history } =
    useEditorStore();
  const { isAuthenticated } = useAuthStore();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto-save toutes les 30 secondes si authentifié
  useAutoSave(30000);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleZoomIn = () => setZoom(zoom + 0.1);
  const handleZoomOut = () => setZoom(zoom - 0.1);

  const handleSaveManual = async () => {
    if (!isAuthenticated || !project) return;

    setSaving(true);
    try {
      await api.updateProject(project.id, project);
      console.log('✅ Projet sauvegardé manuellement');
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde du projet');
    } finally {
      setSaving(false);
    }
  };

  return (
    <header className="h-14 flex items-center px-2 md:px-4 gap-1 md:gap-2 bg-white border-b border-dark-200 justify-between min-w-0">
      {/* Gauche - Navigation et nom du projet */}
      <div className="flex items-center gap-1 md:gap-2 min-w-0 flex-shrink">
        <button
          onClick={() => navigate('/')}
          className="tool-button flex-shrink-0 p-1.5 md:p-2"
          title="Retour à l'accueil"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <div className="min-w-0">
            <input
              type="text"
              value={project?.name || ''}
              className="text-sm font-medium text-dark-900 bg-transparent border-none outline-none focus:ring-0 w-32 lg:w-48"
              placeholder="Nom du projet"
            />
            <p className="text-xs text-dark-400 whitespace-nowrap overflow-hidden text-ellipsis">
              {project?.dimensions.width} × {project?.dimensions.height}px
            </p>
          </div>
        </div>
      </div>

      {/* Centre - Outils */}
      <div className="hidden lg:flex items-center gap-1 bg-dark-50 rounded-lg p-1 flex-shrink-0">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setMode(tool.id as typeof mode)}
            className={`tool-button ${mode === tool.id ? 'active' : ''}`}
            title={tool.label}
          >
            <tool.icon className="w-5 h-5" />
          </button>
        ))}
      </div>

      {/* Menu mobile pour les outils (petit écran) */}
      <button
        onClick={() => setShowMobileMenu(!showMobileMenu)}
        className="lg:hidden tool-button flex-shrink-0"
        title="Menu des outils"
      >
        {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Droite - Actions */}
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        {/* Undo / Redo */}
        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="tool-button disabled:opacity-30"
            title="Annuler (Cmd+Z)"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="tool-button disabled:opacity-30"
            title="Rétablir (Cmd+Shift+Z)"
          >
            <Redo2 className="w-5 h-5" />
          </button>
        </div>

        {/* Zoom */}
        <div className="hidden sm:flex items-center gap-1 bg-dark-50 rounded-lg px-2 py-1">
          <button onClick={handleZoomOut} className="tool-button p-1">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-dark-600 w-14 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={handleZoomIn} className="tool-button p-1">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        {isAuthenticated && (
          <button
            onClick={handleSaveManual}
            disabled={saving}
            className="hidden md:flex btn btn-ghost items-center gap-2"
            title="Sauvegarder"
          >
            {saving ? (
              <Cloud className="w-4 h-4 animate-pulse" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="hidden lg:inline">{saving ? 'Sauvegarde...' : 'Sauvegarder'}</span>
          </button>
        )}
        <button className="hidden md:flex btn btn-ghost items-center gap-2">
          <Share2 className="w-4 h-4" />
          <span className="hidden lg:inline">Partager</span>
        </button>
        <button
          onClick={() => setShowExportModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden lg:inline">Exporter</span>
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {showMobileMenu && (
        <div className="lg:hidden absolute top-14 left-0 right-0 bg-white border-b border-dark-200 shadow-lg z-50 p-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-3">
              Outils
            </p>
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setMode(tool.id as typeof mode);
                    setShowMobileMenu(false);
                  }}
                  className={`p-3 rounded-lg border-2 flex items-center gap-2 ${
                    mode === tool.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-dark-200 hover:border-dark-300'
                  }`}
                >
                  <tool.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{tool.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Actions supplémentaires sur mobile */}
            <div className="pt-4 border-t border-dark-200 mt-4 space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    undo();
                    setShowMobileMenu(false);
                  }}
                  disabled={!canUndo}
                  className="flex-1 btn btn-secondary disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Undo2 className="w-4 h-4" />
                  Annuler
                </button>
                <button
                  onClick={() => {
                    redo();
                    setShowMobileMenu(false);
                  }}
                  disabled={!canRedo}
                  className="flex-1 btn btn-secondary disabled:opacity-30 flex items-center justify-center gap-2"
                >
                  <Redo2 className="w-4 h-4" />
                  Rétablir
                </button>
              </div>

              <div className="flex items-center gap-2 justify-between bg-dark-50 rounded-lg px-3 py-2">
                <button onClick={handleZoomOut} className="tool-button p-1">
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium text-dark-600">
                  {Math.round(zoom * 100)}%
                </span>
                <button onClick={handleZoomIn} className="tool-button p-1">
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'export */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </header>
  );
}
