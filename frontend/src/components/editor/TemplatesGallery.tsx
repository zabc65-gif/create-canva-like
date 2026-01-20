import { useState } from 'react';
import { TEMPLATES, type Template } from '@/data/templates';
import { useEditorStore } from '@/stores/editorStore';
import { X } from 'lucide-react';

const categories = [
  { id: 'all', label: 'Tous' },
  { id: 'social', label: 'Réseaux sociaux' },
  { id: 'presentation', label: 'Présentation' },
  { id: 'print', label: 'Impression' },
  { id: 'video', label: 'Vidéo' },
] as const;

export default function TemplatesGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const { project, setProject } = useEditorStore();
  const selectElements = useEditorStore((state) => state.selectElements);

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleUseTemplate = (template: Template) => {
    if (!project) return;

    // Calculer le ratio pour adapter le template aux dimensions actuelles du projet
    const scaleX = project.dimensions.width / template.dimensions.width;
    const scaleY = project.dimensions.height / template.dimensions.height;

    // Utiliser le plus petit ratio pour que tout rentre dans le canvas
    const scale = Math.min(scaleX, scaleY);

    // Calculer les dimensions du template mis à l'échelle
    const scaledTemplateWidth = template.dimensions.width * scale;
    const scaledTemplateHeight = template.dimensions.height * scale;

    // Calculer l'offset pour centrer le template
    const offsetX = (project.dimensions.width - scaledTemplateWidth) / 2;
    const offsetY = (project.dimensions.height - scaledTemplateHeight) / 2;

    console.log('📐 Template centering:', {
      projectDims: project.dimensions,
      templateDims: template.dimensions,
      scale,
      scaledDims: { width: scaledTemplateWidth, height: scaledTemplateHeight },
      offset: { x: offsetX, y: offsetY }
    });

    // Créer les nouveaux éléments avec leurs IDs
    const newElements = template.elements.map((el) => {
      const newId = `${el.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...el,
        id: newId,
        // Adapter la position et la taille au nouveau canvas + centrer
        transform: {
          ...el.transform,
          x: el.transform.x * scale + offsetX,
          y: el.transform.y * scale + offsetY,
          width: el.transform.width * scale,
          height: el.transform.height * scale,
        },
      };
    });

    // Ajouter les nouveaux éléments aux éléments existants
    const newProject = {
      ...project,
      // Garder les dimensions actuelles du projet et ajouter les nouveaux éléments
      elements: [...project.elements, ...newElements],
      updatedAt: new Date(),
    };

    setProject(newProject);
    setPreviewTemplate(null);

    // Sélectionner tous les éléments du template d'un coup
    // On utilise setTimeout pour s'assurer que le state est mis à jour
    // Double requestAnimationFrame dans EditorCanvas gère la synchronisation avec le canvas
    setTimeout(() => {
      if (newElements.length > 0) {
        const elementIds = newElements.map(el => el.id);
        console.log('✅ Template inserted, selecting elements:', elementIds);
        selectElements(elementIds);
      }
    }, 150); // Petit délai pour laisser React mettre à jour le state
  };

  const handleReplaceElements = (template: Template) => {
    if (!project) return;

    // Calculer le ratio pour adapter le template aux dimensions actuelles du projet
    const scaleX = project.dimensions.width / template.dimensions.width;
    const scaleY = project.dimensions.height / template.dimensions.height;

    // Utiliser le plus petit ratio pour que tout rentre dans le canvas
    const scale = Math.min(scaleX, scaleY);

    // Calculer les dimensions du template mis à l'échelle
    const scaledTemplateWidth = template.dimensions.width * scale;
    const scaledTemplateHeight = template.dimensions.height * scale;

    // Calculer l'offset pour centrer le template
    const offsetX = (project.dimensions.width - scaledTemplateWidth) / 2;
    const offsetY = (project.dimensions.height - scaledTemplateHeight) / 2;

    // Créer les nouveaux éléments avec leurs IDs
    const newElements = template.elements.map((el) => {
      const newId = `${el.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      return {
        ...el,
        id: newId,
        // Adapter la position et la taille au nouveau canvas + centrer
        transform: {
          ...el.transform,
          x: el.transform.x * scale + offsetX,
          y: el.transform.y * scale + offsetY,
          width: el.transform.width * scale,
          height: el.transform.height * scale,
        },
      };
    });

    // Remplacer tous les éléments du projet actuel par ceux du template
    const newProject = {
      ...project,
      elements: newElements,
      updatedAt: new Date(),
    };

    setProject(newProject);
    setPreviewTemplate(null);

    // Sélectionner tous les éléments du template d'un coup
    setTimeout(() => {
      if (newElements.length > 0) {
        const elementIds = newElements.map(el => el.id);
        console.log('✅ Template replaced, selecting elements:', elementIds);
        selectElements(elementIds);
      }
    }, 150); // Petit délai pour laisser React mettre à jour le state
  };

  return (
    <div className="p-4 pb-20">
      {/* Catégories */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-dark-100 text-dark-700 hover:bg-dark-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Galerie de templates */}
      <div className="space-y-3">
        {filteredTemplates.length === 0 ? (
          <p className="text-sm text-dark-500 text-center py-8">
            Aucun template dans cette catégorie
          </p>
        ) : (
          filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white border border-dark-200 rounded-lg overflow-hidden hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => setPreviewTemplate(template)}
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-dark-50 to-dark-100 flex items-center justify-center relative">
                <span className="text-6xl">{template.thumbnail}</span>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium">
                    Cliquer pour prévisualiser
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <h4 className="text-sm font-semibold text-dark-900 mb-1">
                  {template.name}
                </h4>
                <p className="text-xs text-dark-500 mb-2">{template.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-dark-400">
                    {template.dimensions.width} × {template.dimensions.height}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(template);
                    }}
                    className="text-xs bg-primary-500 text-white px-3 py-1 rounded hover:bg-primary-600 transition-colors"
                  >
                    Utiliser
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de prévisualisation */}
      {previewTemplate && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewTemplate(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-dark-200">
              <div>
                <h3 className="text-lg font-semibold text-dark-900">
                  {previewTemplate.name}
                </h3>
                <p className="text-sm text-dark-500">{previewTemplate.description}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-dark-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview */}
            <div className="p-6">
              <div className="aspect-video bg-gradient-to-br from-dark-50 to-dark-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-8xl">{previewTemplate.thumbnail}</span>
              </div>

              {/* Détails */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-600">Dimensions:</span>
                  <span className="font-medium text-dark-900">
                    {previewTemplate.dimensions.width} × {previewTemplate.dimensions.height} px
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-600">Éléments:</span>
                  <span className="font-medium text-dark-900">
                    {previewTemplate.elements.length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark-600">Catégorie:</span>
                  <span className="font-medium text-dark-900 capitalize">
                    {previewTemplate.category === 'social' && 'Réseaux sociaux'}
                    {previewTemplate.category === 'presentation' && 'Présentation'}
                    {previewTemplate.category === 'print' && 'Impression'}
                    {previewTemplate.category === 'video' && 'Vidéo'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleUseTemplate(previewTemplate)}
                  className="flex-1 btn btn-primary"
                >
                  Utiliser ce template
                </button>
                {project && (
                  <button
                    onClick={() => handleReplaceElements(previewTemplate)}
                    className="flex-1 btn btn-secondary"
                    title="Remplacer les éléments actuels mais garder les dimensions du projet"
                  >
                    Remplacer les éléments
                  </button>
                )}
              </div>

              {/* Note */}
              <p className="text-xs text-dark-500 text-center mt-4">
                💡 Tous les textes et couleurs sont personnalisables après l'import
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
