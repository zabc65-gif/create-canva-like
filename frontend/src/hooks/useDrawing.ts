import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '@/stores/editorStore';
import { generatePrefixedId } from '@create/shared';
import type { ShapeElement } from '@create/shared';

interface DrawingConfig {
  color: string;
  width: number;
  opacity: number;
}

export function useDrawing(config: DrawingConfig) {
  const { canvas, mode, addElement, project } = useEditorStore();
  const isDrawingRef = useRef(false);
  const pathRef = useRef<fabric.Path | null>(null);

  useEffect(() => {
    if (!canvas || !project) return;

    // Activer/désactiver le mode dessin
    if (mode === 'draw') {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = config.color;
      canvas.freeDrawingBrush.width = config.width;

      // Événement de fin de dessin
      const handlePathCreated = (e: any) => {
        const path = e.path;
        if (!path) return;

        // Convertir le path en élément de projet
        const pathData = path.path;
        const pathString = pathData
          .map((segment: any[]) => segment.join(' '))
          .join(' ');

        // Calculer les bounds du path
        const bounds = path.getBoundingRect();

        // Créer un élément de forme avec le path
        const element: ShapeElement = {
          id: generatePrefixedId('el'),
          name: 'Dessin',
          type: 'shape',
          shapeType: 'line',
          transform: {
            x: bounds.left,
            y: bounds.top,
            width: bounds.width,
            height: bounds.height,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
          },
          fill: 'transparent',
          stroke: config.color,
          strokeWidth: config.width,
          opacity: config.opacity,
          visible: true,
          locked: false,
          zIndex: project.elements.length,
        };

        // Supprimer le path temporaire
        canvas.remove(path);

        // Ajouter l'élément au projet
        addElement(element);
      };

      canvas.on('path:created', handlePathCreated);

      return () => {
        canvas.off('path:created', handlePathCreated);
        canvas.isDrawingMode = false;
      };
    } else {
      canvas.isDrawingMode = false;
    }
  }, [canvas, mode, config, addElement, project]);

  return {
    isDrawing: isDrawingRef.current,
  };
}
