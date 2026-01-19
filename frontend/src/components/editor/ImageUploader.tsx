import { useState } from 'react';
import { Upload, X, CheckCircle2 } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';
import { generatePrefixedId, DEFAULT_IMAGE_FILTERS } from '@create/shared';
import type { ImageElement } from '@create/shared';

interface UploadingFile {
  name: string;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

export default function ImageUploader() {
  const { addElement, project } = useEditorStore();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !project) return;

    const fileArray = Array.from(files);

    // Initialiser les fichiers en cours d'upload
    const initialUploads: UploadingFile[] = fileArray.map(file => ({
      name: file.name,
      progress: 0,
      status: 'uploading' as const,
    }));
    setUploadingFiles(initialUploads);

    // Traiter chaque fichier
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      try {
        await processFile(file, i);
      } catch (error) {
        console.error('Error processing file:', error);
        setUploadingFiles(prev =>
          prev.map((f, idx) => idx === i ? { ...f, status: 'error' as const, progress: 100 } : f)
        );
      }
    }

    // Nettoyer après 2 secondes
    setTimeout(() => {
      setUploadingFiles([]);
    }, 2000);

    e.target.value = '';
  };

  const processFile = (file: File, index: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadingFiles(prev =>
            prev.map((f, idx) => idx === index ? { ...f, progress } : f)
          );
        }
      };

      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (!imageUrl) {
          reject(new Error('Failed to read file'));
          return;
        }

        const img = new Image();
        img.onload = () => {
          const maxWidth = 400;
          const maxHeight = 400;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width *= ratio;
            height *= ratio;
          }

          const imageElement: ImageElement = {
            id: generatePrefixedId('img'),
            name: file.name,
            type: 'image',
            src: imageUrl,
            originalSrc: imageUrl,
            filters: DEFAULT_IMAGE_FILTERS,
            transform: {
              x: (project!.dimensions.width - width) / 2,
              y: (project!.dimensions.height - height) / 2,
              width,
              height,
              rotation: 0,
              scaleX: 1,
              scaleY: 1,
            },
            opacity: 1,
            visible: true,
            locked: false,
            zIndex: project!.elements.length,
          };

          addElement(imageElement);

          setUploadingFiles(prev =>
            prev.map((f, idx) => idx === index ? { ...f, status: 'complete' as const, progress: 100 } : f)
          );

          resolve();
        };

        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };

        img.src = imageUrl;
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="p-4">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Importer vos fichiers</h3>

        <label className="block w-full p-8 border-2 border-dashed border-dark-300 rounded-lg text-center hover:border-primary-400 hover:bg-primary-50 transition-colors cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-dark-400" />
          <p className="text-sm text-dark-600 font-medium">
            Cliquez ou déposez vos images
          </p>
          <p className="text-xs text-dark-400 mt-1">
            JPG, PNG, GIF, WebP (max 10 images)
          </p>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>

        {/* Liste des uploads en cours */}
        {uploadingFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider">
              Import en cours
            </p>
            {uploadingFiles.map((file, index) => (
              <div key={index} className="bg-dark-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {file.status === 'complete' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : file.status === 'error' ? (
                      <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                    ) : (
                      <Upload className="w-4 h-4 text-primary-600 flex-shrink-0 animate-pulse" />
                    )}
                    <span className="text-xs text-dark-700 truncate">
                      {file.name}
                    </span>
                  </div>
                  <span className="text-xs text-dark-500 font-medium ml-2">
                    {file.progress}%
                  </span>
                </div>

                {/* Barre de progression */}
                <div className="w-full bg-dark-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      file.status === 'complete'
                        ? 'bg-green-600'
                        : file.status === 'error'
                        ? 'bg-red-600'
                        : 'bg-primary-600'
                    }`}
                    style={{ width: `${file.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-700">
            💡 <strong>Astuce :</strong> Vous pouvez sélectionner plusieurs images à la fois
          </p>
        </div>
      </div>
    </div>
  );
}
