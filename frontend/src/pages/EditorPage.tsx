import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEditorStore } from '@/stores/editorStore';
import EditorLayout from '@/components/layout/EditorLayout';
import type { ProjectType } from '@create/shared';

export default function EditorPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { project, createProject, _hasHydrated } = useEditorStore();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Attendre que le store soit hydraté depuis localStorage
    if (!_hasHydrated) {
      console.log('⏳ En attente de l\'hydratation...');
      return;
    }

    // Ne s'exécuter qu'une seule fois après l'hydratation
    if (hasInitialized.current) {
      console.log('✋ Déjà initialisé, on ne fait rien');
      return;
    }

    console.log('🎬 Initialisation de EditorPage');
    hasInitialized.current = true;

    // Si on a le paramètre "new=true" (nouveau projet depuis HomePage), créer un nouveau projet
    const isNewProject = searchParams.get('new') === 'true';

    if (isNewProject) {
      console.log('🆕 Création d\'un nouveau projet depuis HomePage');
      const type = (searchParams.get('type') || 'design') as ProjectType;
      const width = parseInt(searchParams.get('width') || '1080', 10);
      const height = parseInt(searchParams.get('height') || '1080', 10);
      const name = searchParams.get('name') || 'Nouveau projet';

      createProject(name, type, { width, height });

      // Nettoyer l'URL pour éviter de recréer le projet au prochain refresh
      navigate('/editor', { replace: true });
    } else {
      console.log('🔄 Pas de paramètres URL, projet actuel:', project?.name || 'aucun');
    }
  }, [_hasHydrated, searchParams, createProject, project?.name, navigate]);

  if (!project) {
    return (
      <div className="h-screen flex items-center justify-center bg-dark-100">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-primary-500 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return <EditorLayout />;
}
