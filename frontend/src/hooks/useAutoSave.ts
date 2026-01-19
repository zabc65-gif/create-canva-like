import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useEditorStore } from '@/stores/editorStore';
import { api } from '@/services/api';

export function useAutoSave(intervalMs: number = 30000) {
  const { isAuthenticated } = useAuthStore();
  const { project } = useEditorStore();
  const lastSavedRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

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
        await api.updateProject(project.id, project);
        lastSavedRef.current = projectJson;
        console.log('✅ Projet sauvegardé automatiquement');
      } catch (error) {
        console.error('❌ Erreur sauvegarde automatique:', error);
      }
    }, intervalMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [project, isAuthenticated, intervalMs]);
}
