import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Project,
  CanvasElement,
  ProjectType,
  Dimensions,
} from '@create/shared';
import { generatePrefixedId } from '@create/shared';

type EditorMode = 'select' | 'text' | 'shape' | 'draw' | 'pan';
type EditorTab = 'elements' | 'text' | 'edit-image' | 'layers' | 'uploads' | 'photos' | 'templates';

interface EditorState {
  // Projet actuel
  project: Project | null;

  // Éléments sélectionnés
  selectedElementIds: string[];

  // Mode d'édition
  mode: EditorMode;

  // Onglet actif dans la sidebar
  activeTab: EditorTab;

  // Historique pour undo/redo
  history: Project[];
  historyIndex: number;

  // Zoom
  zoom: number;

  // Canvas Fabric.js
  canvas: fabric.Canvas | null;

  // Flag pour savoir si le store a été hydraté depuis le localStorage
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  // Actions
  setProject: (project: Project) => void;
  createProject: (name: string, type: ProjectType, dimensions: Dimensions) => void;
  setCanvas: (canvas: fabric.Canvas | null) => void;
  setMode: (mode: EditorMode) => void;
  setActiveTab: (tab: EditorTab) => void;
  setZoom: (zoom: number) => void;

  // Gestion des éléments
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;

  // Ordre d'empilement (Z-index)
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;

  // Sélection
  selectElement: (id: string, addToSelection?: boolean) => void;
  deselectAll: () => void;

  // Historique
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;

  // Helpers
  getSelectedElements: () => CanvasElement[];
  getElementById: (id: string) => CanvasElement | undefined;
}

export const useEditorStore = create<EditorState>()(
  persist(
    (set, get) => ({
      project: null,
      selectedElementIds: [],
      mode: 'select',
      activeTab: 'elements',
      history: [],
      historyIndex: -1,
      zoom: 1,
      canvas: null,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setProject: (project) => {
        set({ project, history: [project], historyIndex: 0 });
      },

  createProject: (name, type, dimensions) => {
    const project: Project = {
      id: generatePrefixedId('proj'),
      name,
      type,
      dimensions,
      backgroundColor: '#ffffff',
      elements: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Créer le nouveau projet (persist se chargera de le sauvegarder automatiquement)
    set({ project, history: [project], historyIndex: 0 });
  },

  setCanvas: (canvas) => set({ canvas }),

  setMode: (mode) => set({ mode }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(5, zoom)) }),

  addElement: (element) => {
    const { project } = get();
    if (!project) return;

    const newElement = {
      ...element,
      id: element.id || generatePrefixedId('el'),
      zIndex: project.elements.length,
    };

    const updatedProject = {
      ...project,
      elements: [...project.elements, newElement],
      updatedAt: new Date(),
    };

    set({ project: updatedProject });
    get().saveToHistory();
  },

  updateElement: (id, updates) => {
    const { project } = get();
    if (!project) return;

    console.log('Store updateElement:', { id, updates });

    const updatedProject = {
      ...project,
      elements: project.elements.map((el) => {
        if (el.id !== id) return el;

        // Merger intelligemment les updates avec l'élément existant
        const updated = { ...el };

        // Si on met à jour transform, merger avec l'ancien transform
        if (updates.transform) {
          updated.transform = {
            ...el.transform,
            ...updates.transform,
          };
          console.log('Updated transform:', updated.transform);
          // Supprimer transform de updates pour éviter le double merge
          const { transform, ...otherUpdates } = updates as any;
          Object.assign(updated, otherUpdates);
        } else {
          Object.assign(updated, updates);
        }

        return updated;
      }),
      updatedAt: new Date(),
    };

    set({ project: updatedProject });
  },

  deleteElement: (id) => {
    const { project, selectedElementIds } = get();
    if (!project) return;

    const updatedProject = {
      ...project,
      elements: project.elements.filter((el) => el.id !== id),
      updatedAt: new Date(),
    };

    set({
      project: updatedProject,
      selectedElementIds: selectedElementIds.filter((eid) => eid !== id),
    });
    get().saveToHistory();
  },

  duplicateElement: (id) => {
    const { project } = get();
    if (!project) return;

    const element = project.elements.find((el) => el.id === id);
    if (!element) return;

    const duplicated = {
      ...element,
      id: generatePrefixedId('el'),
      name: `${element.name} (copie)`,
      transform: {
        ...element.transform,
        x: element.transform.x + 20,
        y: element.transform.y + 20,
      },
    };

    get().addElement(duplicated);
  },

  selectElement: (id, addToSelection = false) => {
    const { selectedElementIds } = get();

    if (addToSelection) {
      if (selectedElementIds.includes(id)) {
        set({ selectedElementIds: selectedElementIds.filter((eid) => eid !== id) });
      } else {
        set({ selectedElementIds: [...selectedElementIds, id] });
      }
    } else {
      set({ selectedElementIds: [id] });
    }
  },

  deselectAll: () => set({ selectedElementIds: [] }),

  // Ordre d'empilement (Z-index)
  bringToFront: (id) => {
    const { project } = get();
    if (!project) return;

    const elementIndex = project.elements.findIndex((el) => el.id === id);
    if (elementIndex === -1 || elementIndex === project.elements.length - 1) return;

    const newElements = [...project.elements];
    const [element] = newElements.splice(elementIndex, 1);
    newElements.push(element);

    // Mettre à jour les zIndex
    newElements.forEach((el, idx) => {
      el.zIndex = idx;
    });

    set({
      project: {
        ...project,
        elements: newElements,
        updatedAt: new Date(),
      },
    });
    get().saveToHistory();
  },

  sendToBack: (id) => {
    const { project } = get();
    if (!project) return;

    const elementIndex = project.elements.findIndex((el) => el.id === id);
    if (elementIndex === -1 || elementIndex === 0) return;

    const newElements = [...project.elements];
    const [element] = newElements.splice(elementIndex, 1);
    newElements.unshift(element);

    // Mettre à jour les zIndex
    newElements.forEach((el, idx) => {
      el.zIndex = idx;
    });

    set({
      project: {
        ...project,
        elements: newElements,
        updatedAt: new Date(),
      },
    });
    get().saveToHistory();
  },

  bringForward: (id) => {
    const { project } = get();
    if (!project) return;

    const elementIndex = project.elements.findIndex((el) => el.id === id);
    if (elementIndex === -1 || elementIndex === project.elements.length - 1) return;

    const newElements = [...project.elements];
    [newElements[elementIndex], newElements[elementIndex + 1]] = [
      newElements[elementIndex + 1],
      newElements[elementIndex],
    ];

    // Mettre à jour les zIndex
    newElements.forEach((el, idx) => {
      el.zIndex = idx;
    });

    set({
      project: {
        ...project,
        elements: newElements,
        updatedAt: new Date(),
      },
    });
    get().saveToHistory();
  },

  sendBackward: (id) => {
    const { project } = get();
    if (!project) return;

    const elementIndex = project.elements.findIndex((el) => el.id === id);
    if (elementIndex === -1 || elementIndex === 0) return;

    const newElements = [...project.elements];
    [newElements[elementIndex], newElements[elementIndex - 1]] = [
      newElements[elementIndex - 1],
      newElements[elementIndex],
    ];

    // Mettre à jour les zIndex
    newElements.forEach((el, idx) => {
      el.zIndex = idx;
    });

    set({
      project: {
        ...project,
        elements: newElements,
        updatedAt: new Date(),
      },
    });
    get().saveToHistory();
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        project: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        project: history[newIndex],
        historyIndex: newIndex,
      });
    }
  },

  saveToHistory: () => {
    const { project, history, historyIndex } = get();
    if (!project) return;

    // Supprimer l'historique après l'index actuel
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ ...project });

    // Limiter l'historique à 50 états
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  getSelectedElements: () => {
    const { project, selectedElementIds } = get();
    if (!project) return [];
    return project.elements.filter((el) => selectedElementIds.includes(el.id));
  },

  getElementById: (id) => {
    const { project } = get();
    if (!project) return undefined;
    return project.elements.find((el) => el.id === id);
  },
}),
    {
      name: 'create-editor-storage',
      partialize: (state) => ({
        project: state.project,
        history: state.history,
        historyIndex: state.historyIndex,
      }),
      onRehydrateStorage: () => (state) => {
        // Callback appelé après la restauration depuis le localStorage
        if (state) {
          // IMPORTANT: Marquer comme hydraté même si pas de projet
          state.setHasHydrated(true);
          if (state.project) {
            console.log('💾 Projet restauré depuis localStorage:', state.project.name);
          } else {
            console.log('💾 Hydratation terminée, aucun projet sauvegardé');
          }
        }
      },
    }
  )
);
