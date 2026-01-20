import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useEditorStore } from '@/stores/editorStore';
import { api } from '@/services/api';

const generateUniqueProjectName = async (baseName: string): Promise<string> => {
  try {
    const result = await api.getProjects();
    const existingNames = result.projects.map((p: any) => p.name);

    // Si le nom de base n'existe pas déjà, le retourner tel quel
    if (!existingNames.includes(baseName)) {
      return baseName;
    }

    // Chercher un numéro unique
    let counter = 1;
    let newName = `${baseName} ${counter}`;

    while (existingNames.includes(newName)) {
      counter++;
      newName = `${baseName} ${counter}`;
    }

    return newName;
  } catch (error) {
    console.error('Erreur lors de la génération du nom unique:', error);
    return baseName;
  }
};

export function useAutoSave(intervalMs: number = 30000, onSaveComplete?: () => void) {
  const { isAuthenticated } = useAuthStore();
  const { project, setProject } = useEditorStore();
  const lastSavedRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const projectCreatedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated || !project) {
      return;
    }

    const projectJson = JSON.stringify(project);

    // Ne sauvegarder que si le projet a changé
    if (projectJson === lastSavedRef.current) {
      return;
    }

    // Annuler le timeout précédent
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Sauvegarder après un délai
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const isCreated = projectCreatedRef.current.has(project.id);
        let projectToSave = project;

        if (!isCreated) {
          // Première sauvegarde: générer un nom unique si c'est "Nouveau projet"
          if (project.name === 'Nouveau projet' || project.name.startsWith('Nouveau projet')) {
            const uniqueName = await generateUniqueProjectName('Nouveau projet');
            projectToSave = {
              ...project,
              name: uniqueName,
              updatedAt: new Date(),
            };
            // Mettre à jour le projet dans le store avec le nouveau nom
            setProject(projectToSave);
          }

          // Créer le projet
          await api.createProject(projectToSave);
          projectCreatedRef.current.add(project.id);
          console.log('✅ Projet créé sur le serveur:', projectToSave.name);
        } else {
          // Sauvegardes suivantes: mettre à jour
          await api.updateProject(project.id, projectToSave);
          console.log('✅ Projet sauvegardé automatiquement');
        }

        lastSavedRef.current = JSON.stringify(projectToSave);

        // Notifier que la sauvegarde est terminée
        if (onSaveComplete) {
          onSaveComplete();
        }
      } catch (error) {
        console.error('❌ Erreur sauvegarde automatique:', error);
      }
    }, intervalMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [project, isAuthenticated, intervalMs, setProject, onSaveComplete]);
}
