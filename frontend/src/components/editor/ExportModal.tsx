import { useState } from 'react';
import { X, Download, FileImage, FileText, Image } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { jsPDF } from 'jspdf';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ExportFormat = 'png' | 'jpg' | 'pdf' | 'svg';

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: typeof FileImage;
  mimeType: string;
}

const exportOptions: ExportOption[] = [
  {
    format: 'png',
    label: 'PNG',
    description: 'Image avec transparence',
    icon: FileImage,
    mimeType: 'image/png',
  },
  {
    format: 'jpg',
    label: 'JPG',
    description: 'Image compressée',
    icon: Image,
    mimeType: 'image/jpeg',
  },
  {
    format: 'pdf',
    label: 'PDF',
    description: 'Document imprimable',
    icon: FileText,
    mimeType: 'application/pdf',
  },
  {
    format: 'svg',
    label: 'SVG',
    description: 'Vectoriel (formes et texte)',
    icon: FileImage,
    mimeType: 'image/svg+xml',
  },
];

const qualityOptions = [
  { value: 1, label: '1x', description: 'Standard' },
  { value: 2, label: '2x', description: 'Haute définition' },
  { value: 3, label: '3x', description: 'Ultra HD' },
];

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { project, canvas } = useEditorStore();
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [includeBackground, setIncludeBackground] = useState(true);

  if (!isOpen || !project) return null;

  const handleExport = async () => {
    if (!canvas || !project) return;

    setIsExporting(true);

    try {
      const multiplier = quality;
      const { width, height } = project.dimensions;

      // Créer un canvas temporaire pour l'export
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width * multiplier;
      tempCanvas.height = height * multiplier;
      const ctx = tempCanvas.getContext('2d');

      if (!ctx) {
        throw new Error('Impossible de créer le contexte canvas');
      }

      // Fond
      if (includeBackground) {
        ctx.fillStyle = project.backgroundColor;
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      }

      // Récupérer les objets du canvas Fabric (sauf le workboard)
      const objects = canvas.getObjects().filter(
        (obj: any) => !obj.data?.isWorkboard
      );

      // Trouver le workboard pour calculer l'offset
      const workboard = canvas.getObjects().find(
        (obj: any) => obj.data?.isWorkboard
      );

      if (!workboard) {
        throw new Error('Workboard non trouvé');
      }

      const workboardLeft = workboard.left || 0;
      const workboardTop = workboard.top || 0;
      const currentZoom = canvas.getZoom();

      // Créer un canvas Fabric temporaire pour le rendu
      const exportFabricCanvas = new (window as any).fabric.StaticCanvas(null, {
        width: width * multiplier,
        height: height * multiplier,
        backgroundColor: includeBackground ? project.backgroundColor : 'transparent',
      });

      // Cloner et ajouter les objets avec les bonnes positions
      for (const obj of objects) {
        const cloned = await new Promise<fabric.Object>((resolve) => {
          obj.clone((clonedObj: fabric.Object) => {
            // Ajuster la position relative au workboard
            const objLeft = ((obj.left || 0) - workboardLeft) / currentZoom;
            const objTop = ((obj.top || 0) - workboardTop) / currentZoom;

            clonedObj.set({
              left: objLeft * multiplier,
              top: objTop * multiplier,
              scaleX: (obj.scaleX || 1) * multiplier / currentZoom,
              scaleY: (obj.scaleY || 1) * multiplier / currentZoom,
            });
            resolve(clonedObj);
          });
        });
        exportFabricCanvas.add(cloned);
      }

      exportFabricCanvas.renderAll();

      let dataUrl: string;
      let filename: string;

      switch (selectedFormat) {
        case 'png':
          dataUrl = exportFabricCanvas.toDataURL({
            format: 'png',
            multiplier: 1,
          });
          filename = `${project.name}.png`;
          break;

        case 'jpg':
          dataUrl = exportFabricCanvas.toDataURL({
            format: 'jpeg',
            quality: 0.9,
            multiplier: 1,
          });
          filename = `${project.name}.jpg`;
          break;

        case 'svg':
          const svgData = exportFabricCanvas.toSVG();
          dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
          filename = `${project.name}.svg`;
          break;

        case 'pdf': {
          // Export PDF avec jsPDF
          const pdfDataUrl = exportFabricCanvas.toDataURL({
            format: 'png',
            multiplier: 1,
          });

          // Déterminer l'orientation du PDF
          const isLandscape = width > height;
          const orientation = isLandscape ? 'landscape' : 'portrait';

          // Créer le PDF avec les dimensions du projet
          const pdf = new jsPDF({
            orientation,
            unit: 'px',
            format: [width, height],
            compress: true,
          });

          // Ajouter l'image au PDF
          pdf.addImage(
            pdfDataUrl,
            'PNG',
            0,
            0,
            width,
            height,
            undefined,
            'FAST'
          );

          // Télécharger le PDF
          pdf.save(`${project.name}.pdf`);

          // Nettoyer
          exportFabricCanvas.dispose();
          onClose();
          setIsExporting(false);
          return;
        }

        default:
          throw new Error('Format non supporté');
      }

      // Télécharger le fichier (pour les autres formats)
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyer
      exportFabricCanvas.dispose();

      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      alert('Une erreur est survenue lors de l\'export');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-200">
          <h2 className="text-lg font-semibold text-dark-900">Exporter le projet</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-dark-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-dark-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-2">
              Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {exportOptions.map((option) => (
                <button
                  key={option.format}
                  onClick={() => setSelectedFormat(option.format)}
                  className={`p-3 rounded-lg border-2 text-left transition-colors ${
                    selectedFormat === option.format
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-dark-200 hover:border-dark-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <option.icon className={`w-5 h-5 ${
                      selectedFormat === option.format ? 'text-primary-600' : 'text-dark-500'
                    }`} />
                    <span className={`font-medium ${
                      selectedFormat === option.format ? 'text-primary-700' : 'text-dark-700'
                    }`}>
                      {option.label}
                    </span>
                  </div>
                  <p className="text-xs text-dark-500 mt-1">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Qualité */}
          {selectedFormat !== 'svg' && (
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Résolution
              </label>
              <div className="flex gap-2">
                {qualityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setQuality(option.value)}
                    className={`flex-1 p-2 rounded-lg border-2 text-center transition-colors ${
                      quality === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-dark-200 hover:border-dark-300'
                    }`}
                  >
                    <span className={`font-medium ${
                      quality === option.value ? 'text-primary-700' : 'text-dark-700'
                    }`}>
                      {option.label}
                    </span>
                    <p className="text-xs text-dark-500">{option.description}</p>
                  </button>
                ))}
              </div>
              <p className="text-xs text-dark-400 mt-2">
                Taille finale : {project.dimensions.width * quality} × {project.dimensions.height * quality}px
              </p>
            </div>
          )}

          {/* Options */}
          {selectedFormat === 'png' && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeBackground}
                  onChange={(e) => setIncludeBackground(e.target.checked)}
                  className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-dark-700">Inclure l'arrière-plan</span>
              </label>
              <p className="text-xs text-dark-400 mt-1 ml-6">
                Décochez pour un fond transparent
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-dark-200 bg-dark-50">
          <button
            onClick={onClose}
            className="btn btn-ghost"
          >
            Annuler
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="btn btn-primary flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Export en cours...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exporter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
