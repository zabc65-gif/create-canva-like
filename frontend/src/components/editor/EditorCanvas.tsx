import { useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { useEditorStore } from '@/stores/editorStore';
import type { CanvasElement, TextElement, ShapeElement, ImageElement, ImageFilters } from '@create/shared';

// Fonction pour appliquer les filtres Fabric.js à une image
const applyFabricFilters = (img: fabric.Image, filters: ImageFilters) => {
  const fabricFilters: any[] = [];

  // Brightness
  if (filters.brightness !== 100) {
    fabricFilters.push(new fabric.Image.filters.Brightness({
      brightness: (filters.brightness - 100) / 100,
    }));
  }

  // Contrast
  if (filters.contrast !== 100) {
    fabricFilters.push(new fabric.Image.filters.Contrast({
      contrast: (filters.contrast - 100) / 100,
    }));
  }

  // Saturation
  if (filters.saturation !== 100) {
    fabricFilters.push(new fabric.Image.filters.Saturation({
      saturation: (filters.saturation - 100) / 100,
    }));
  }

  // Blur
  if (filters.blur > 0) {
    fabricFilters.push(new fabric.Image.filters.Blur({
      blur: filters.blur / 100,
    }));
  }

  // Grayscale
  if (filters.grayscale > 0) {
    const grayscaleFilter = new fabric.Image.filters.Grayscale();
    if (filters.grayscale < 100) {
      // Pour un grayscale partiel, on utilise saturation
      fabricFilters.push(new fabric.Image.filters.Saturation({
        saturation: -(filters.grayscale / 100),
      }));
    } else {
      fabricFilters.push(grayscaleFilter);
    }
  }

  // Sepia
  if (filters.sepia > 0) {
    fabricFilters.push(new fabric.Image.filters.Sepia());
  }

  // HueRotation
  if (filters.hueRotate !== 0) {
    fabricFilters.push(new fabric.Image.filters.HueRotation({
      rotation: filters.hueRotate / 360,
    }));
  }

  img.filters = fabricFilters;
  img.applyFilters();
};

export default function EditorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const isUpdatingFromStoreRef = useRef(false);
  const isUpdatingSelectionFromStoreRef = useRef(false);

  const {
    project,
    zoom,
    setZoom,
    setCanvas,
    selectElement,
    deselectAll,
    updateElement,
    selectedElementIds,
    selectElements,
  } = useEditorStore();

  // Créer un objet Fabric à partir d'un élément
  const createFabricObject = useCallback((element: CanvasElement): fabric.Object | null => {
    let obj: fabric.Object | null = null;

    switch (element.type) {
      case 'text': {
        const textEl = element as TextElement;
        obj = new fabric.IText(textEl.content, {
          left: textEl.transform.x,
          top: textEl.transform.y,
          fontFamily: textEl.fontFamily,
          fontSize: textEl.fontSize,
          fontWeight: textEl.fontWeight,
          fontStyle: textEl.fontStyle,
          textAlign: textEl.textAlign,
          fill: textEl.color,
          lineHeight: textEl.lineHeight,
          charSpacing: textEl.letterSpacing * 10,
          angle: textEl.transform.rotation,
          scaleX: textEl.transform.scaleX,
          scaleY: textEl.transform.scaleY,
          opacity: textEl.opacity,
          visible: textEl.visible,
          selectable: !textEl.locked,
        });
        break;
      }

      case 'shape': {
        const shapeEl = element as ShapeElement;
        const { x, y, width, height, rotation, scaleX, scaleY } = shapeEl.transform;

        switch (shapeEl.shapeType) {
          case 'rectangle':
            obj = new fabric.Rect({
              left: x,
              top: y,
              width,
              height,
              fill: shapeEl.fill,
              stroke: shapeEl.stroke,
              strokeWidth: shapeEl.strokeWidth,
              rx: shapeEl.cornerRadius || 0,
              ry: shapeEl.cornerRadius || 0,
            });
            break;

          case 'circle':
            obj = new fabric.Circle({
              left: x,
              top: y,
              radius: Math.min(width, height) / 2,
              fill: shapeEl.fill,
              stroke: shapeEl.stroke,
              strokeWidth: shapeEl.strokeWidth,
            });
            break;

          case 'triangle':
            obj = new fabric.Triangle({
              left: x,
              top: y,
              width,
              height,
              fill: shapeEl.fill,
              stroke: shapeEl.stroke,
              strokeWidth: shapeEl.strokeWidth,
            });
            break;

          case 'line':
            obj = new fabric.Line([x, y, x + width, y], {
              stroke: shapeEl.fill,
              strokeWidth: shapeEl.strokeWidth || 4,
            });
            break;

          case 'star': {
            const points = shapeEl.points || 5;
            const outerRadius = Math.min(width, height) / 2;
            const innerRadius = outerRadius / 2;
            const starPoints: { x: number; y: number }[] = [];

            for (let i = 0; i < points * 2; i++) {
              const radius = i % 2 === 0 ? outerRadius : innerRadius;
              const angle = (Math.PI / points) * i - Math.PI / 2;
              starPoints.push({
                x: x + width / 2 + radius * Math.cos(angle),
                y: y + height / 2 + radius * Math.sin(angle),
              });
            }

            obj = new fabric.Polygon(starPoints, {
              fill: shapeEl.fill,
              stroke: shapeEl.stroke,
              strokeWidth: shapeEl.strokeWidth,
            });
            break;
          }
        }

        if (obj) {
          obj.set({
            angle: rotation,
            scaleX,
            scaleY,
            opacity: shapeEl.opacity,
            visible: shapeEl.visible,
            selectable: !shapeEl.locked,
          });
        }
        break;
      }

      case 'image': {
        // Pour les images, on utilise fabric.Image.fromURL
        // qui est asynchrone, donc on retourne null ici
        // et on gère ce cas séparément
        break;
      }
    }

    if (obj) {
      obj.set('data', { id: element.id });
    }

    return obj;
  }, []);

  // Initialiser le canvas
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !project) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Créer le canvas Fabric
    const isMobile = window.innerWidth < 768;
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: '#f1f5f9',
      selection: true,
      preserveObjectStacking: true,
      enableRetinaScaling: true,
      allowTouchScrolling: isMobile,
      stopContextMenu: true,
      fireRightClick: false,
      uniformScaling: false,
    });

    fabricCanvasRef.current = canvas;
    setCanvas(canvas);

    // Calculer le zoom initial pour que le projet tienne dans la vue
    // Réduire le padding sur mobile
    const padding = isMobile ? 20 : 100;
    const scaleX = (containerWidth - padding * 2) / project.dimensions.width;
    const scaleY = (containerHeight - padding * 2) / project.dimensions.height;
    const initialZoom = Math.min(scaleX, scaleY, 1);

    // Créer le "workboard" (zone de travail) à la position (0, 0)
    const workboard = new fabric.Rect({
      left: 0,
      top: 0,
      width: project.dimensions.width,
      height: project.dimensions.height,
      fill: project.backgroundColor,
      selectable: false,
      evented: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0,0,0,0.15)',
        blur: 20,
        offsetX: 0,
        offsetY: 4,
      }),
    });
    workboard.set('data', { isWorkboard: true });
    canvas.add(workboard);

    // Centrer le viewport sur le workboard
    const offsetX = (containerWidth - project.dimensions.width * initialZoom) / 2;
    const offsetY = (containerHeight - project.dimensions.height * initialZoom) / 2;
    canvas.setViewportTransform([
      initialZoom, 0, 0, initialZoom,
      offsetX, offsetY
    ]);

    // Support tactile: pan et zoom
    let isPanning = false;
    let lastPosX = 0;
    let lastPosY = 0;
    let isDraggingObject = false;
    let lastDistance = 0;
    let lastCenter = { x: 0, y: 0 };

    // Calculer la distance entre deux points tactiles
    const getTouchDistance = (touch1: Touch, touch2: Touch) => {
      const dx = touch1.clientX - touch2.clientX;
      const dy = touch1.clientY - touch2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Calculer le centre entre deux points tactiles
    const getTouchCenter = (touch1: Touch, touch2: Touch) => {
      return {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
      };
    };

    // Gestion du pan (déplacement) avec la souris ou le toucher
    canvas.on('mouse:down', function(opt) {
      const evt = opt.e;
      const target = opt.target;
      const touches = (evt as any).touches;

      // Zoom + Pan avec 2 doigts sur mobile
      if (touches && touches.length === 2) {
        isPanning = true;
        isDraggingObject = false;
        canvas.selection = false;
        lastDistance = getTouchDistance(touches[0], touches[1]);
        lastCenter = getTouchCenter(touches[0], touches[1]);
        return;
      }

      // Si on clique sur un objet, on ne panne pas
      if (target && (target as any).data?.id) {
        isDraggingObject = true;
        isPanning = false;
        canvas.selection = true;
        return;
      }

      // Avec Alt sur PC ou mode pan, activer le pan
      if (evt.altKey === true || mode === 'pan') {
        isPanning = true;
        isDraggingObject = false;
        canvas.selection = false;
        lastPosX = evt.clientX;
        lastPosY = evt.clientY;
        return;
      }

      // Sinon, comportement par défaut (sélection)
      isPanning = false;
      isDraggingObject = false;
      canvas.selection = true;
    });

    canvas.on('mouse:move', function(opt) {
      const evt = opt.e;
      const touches = (evt as any).touches;

      // Gestion du pinch-to-zoom + pan avec 2 doigts
      if (touches && touches.length === 2 && isPanning) {
        const currentDistance = getTouchDistance(touches[0], touches[1]);
        const currentCenter = getTouchCenter(touches[0], touches[1]);

        if (lastDistance > 0 && lastCenter.x > 0) {
          // Calculer le facteur de zoom (ralenti pour plus de contrôle)
          const scale = currentDistance / lastDistance;
          const zoomChange = (scale - 1) * 0.5; // Ralentir le zoom de 50%
          let newZoom = canvas.getZoom() * (1 + zoomChange);

          // Limiter le zoom
          if (newZoom > 5) newZoom = 5;
          if (newZoom < 0.1) newZoom = 0.1;

          // Zoomer vers le centre du pinch
          const rect = (evt.target as HTMLCanvasElement)?.getBoundingClientRect();
          if (rect) {
            const zoomPoint = {
              x: currentCenter.x - rect.left,
              y: currentCenter.y - rect.top,
            };
            canvas.zoomToPoint(zoomPoint, newZoom);
            setZoom(newZoom);
          }

          // Pan avec 2 doigts
          const vpt = canvas.viewportTransform;
          if (vpt) {
            vpt[4] += currentCenter.x - lastCenter.x;
            vpt[5] += currentCenter.y - lastCenter.y;
          }
        }

        lastDistance = currentDistance;
        lastCenter = currentCenter;
        canvas.requestRenderAll();
        return;
      }

      // Gestion du pan normal (souris avec Alt/mode pan)
      if (isPanning && !isDraggingObject && !touches) {
        const currentX = evt.clientX;
        const currentY = evt.clientY;

        const vpt = canvas.viewportTransform;
        if (vpt) {
          vpt[4] += currentX - lastPosX;
          vpt[5] += currentY - lastPosY;
          canvas.requestRenderAll();
        }
        lastPosX = currentX;
        lastPosY = currentY;
      }
    });

    canvas.on('mouse:up', function() {
      canvas.setViewportTransform(canvas.viewportTransform);
      isPanning = false;
      isDraggingObject = false;
      lastDistance = 0;
      canvas.selection = true;
    });

    // Zoom avec la molette ou le pinch
    canvas.on('mouse:wheel', function(opt) {
      const delta = opt.e.deltaY;
      let newZoom = canvas.getZoom();
      newZoom *= 0.999 ** delta;

      if (newZoom > 5) newZoom = 5;
      if (newZoom < 0.1) newZoom = 0.1;

      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, newZoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();

      setZoom(newZoom);
    });

    // Événements de sélection
    canvas.on('selection:created', (e: any) => {
      // Ignorer si la sélection vient du store
      if (isUpdatingSelectionFromStoreRef.current) {
        return;
      }

      // Gérer les sélections multiples
      if (e.selected && e.selected.length > 0) {
        const ids = e.selected
          .map((obj: any) => obj.data?.id)
          .filter((id: string | undefined) => id !== undefined);

        if (ids.length > 0) {
          // Utiliser selectElements pour les sélections multiples
          selectElements(ids);
        }
      }
    });

    canvas.on('selection:updated', (e: any) => {
      // Ignorer si la sélection vient du store
      if (isUpdatingSelectionFromStoreRef.current) {
        return;
      }

      // Gérer les sélections multiples
      if (e.selected && e.selected.length > 0) {
        const ids = e.selected
          .map((obj: any) => obj.data?.id)
          .filter((id: string | undefined) => id !== undefined);

        if (ids.length > 0) {
          // Utiliser selectElements pour les sélections multiples
          selectElements(ids);
        }
      }
    });

    canvas.on('selection:cleared', () => {
      // Ignorer si la sélection vient du store
      if (isUpdatingSelectionFromStoreRef.current) {
        return;
      }
      deselectAll();
    });

    // Fonction pour mettre à jour les transformations dans le store
    const updateTransform = (obj: any) => {
      console.log('🔴 updateTransform appelé!', obj);

      // Ignorer si la mise à jour vient du store
      if (isUpdatingFromStoreRef.current) {
        console.log('⚠️ Ignoré car isUpdatingFromStoreRef.current = true');
        return;
      }

      const id = (obj as any).data?.id;
      if (!id) {
        console.log('⚠️ Pas d\'ID sur l\'objet');
        return;
      }

      // IMPORTANT: Utiliser getState() pour obtenir le state à jour
      // au lieu de la closure qui peut être obsolète
      const currentProject = useEditorStore.getState().project;
      if (!currentProject) {
        console.log('⚠️ Pas de projet');
        return;
      }

      const element = currentProject.elements.find(el => el.id === id);
      if (!element) {
        console.log('⚠️ Element non trouvé:', id, 'dans', currentProject.elements.map(e => e.id));
        return;
      }

      // Calculer les nouvelles dimensions réelles
      const newWidth = Math.round((obj.width || 0) * (obj.scaleX || 1));
      const newHeight = Math.round((obj.height || 0) * (obj.scaleY || 1));
      const newX = Math.round(obj.left || 0);
      const newY = Math.round(obj.top || 0);
      const newRotation = Math.round(obj.angle || 0);

      // Vérifier si les valeurs ont vraiment changé pour éviter les boucles infinies
      const hasChanged =
        element.transform.x !== newX ||
        element.transform.y !== newY ||
        element.transform.width !== newWidth ||
        element.transform.height !== newHeight ||
        element.transform.rotation !== newRotation;

      if (!hasChanged) return;

      console.log('🔵 Canvas updateTransform called:', {
        id,
        type: element.type,
        newX,
        newY,
        newWidth,
        newHeight,
        newRotation,
      });

      // Pour les images, garder les scales
      if (element.type === 'image') {
        updateElement(id, {
          transform: {
            ...element.transform,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            rotation: newRotation,
            scaleX: obj.scaleX || 1,
            scaleY: obj.scaleY || 1,
          },
        });
      } else {
        // Pour les autres éléments, normaliser les scales
        updateElement(id, {
          transform: {
            ...element.transform,
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight,
            rotation: newRotation,
            scaleX: 1,
            scaleY: 1,
          },
        });
      }
    };

    // Événements de modification d'objet
    canvas.on('object:modified', (e: any) => {
      if (e.target) updateTransform(e.target);
    });

    // Mise à jour en temps réel pendant le scaling
    canvas.on('object:scaling', (e: any) => {
      if (e.target) updateTransform(e.target);
    });

    // Mise à jour en temps réel pendant la rotation
    canvas.on('object:rotating', (e: any) => {
      if (e.target) updateTransform(e.target);
    });

    // Mise à jour en temps réel pendant le déplacement
    canvas.on('object:moving', (e: any) => {
      if (e.target) updateTransform(e.target);
    });

    // Événement de modification de texte
    canvas.on('text:changed', (e: any) => {
      const obj = e.target as fabric.IText;
      if (!obj) return;

      const id = (obj as any).data?.id;
      if (!id) return;

      updateElement(id, {
        content: obj.text || '',
      } as Partial<TextElement>);
    });

    // Nettoyage
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
      setCanvas(null);
    };
  }, [project?.id]); // Seulement quand le projet change

  // Synchroniser les éléments avec le canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !project) return;

    const objects = canvas.getObjects();
    const elementIds = new Set(project.elements.map(el => el.id));
    const objectMap = new Map<string, fabric.Object>();

    // Créer une map des objets existants
    objects.forEach((obj: any) => {
      if (!obj.data?.isWorkboard && obj.data?.id) {
        objectMap.set(obj.data.id, obj);
      }
    });

    // Supprimer les objets qui n'existent plus dans le projet
    objects.forEach((obj: any) => {
      if (!obj.data?.isWorkboard && obj.data?.id && !elementIds.has(obj.data.id)) {
        canvas.remove(obj);
      }
    });

    // Ajouter ou mettre à jour les éléments
    project.elements.forEach((element) => {
      const existingObj = objectMap.get(element.id);

      if (existingObj) {
        // Mettre à jour l'objet existant sans le recréer
        // Vérifier si les valeurs ont changé avant de mettre à jour
        const currentLeft = Math.round(existingObj.left || 0);
        const currentTop = Math.round(existingObj.top || 0);
        const currentAngle = existingObj.angle || 0;

        const needsUpdate =
          currentLeft !== Math.round(element.transform.x) ||
          currentTop !== Math.round(element.transform.y) ||
          Math.abs(currentAngle - element.transform.rotation) > 0.1 ||
          existingObj.opacity !== element.opacity ||
          existingObj.visible !== element.visible ||
          existingObj.selectable === element.locked;

        if (needsUpdate) {
          // Activer le flag pour éviter les boucles de mise à jour
          isUpdatingFromStoreRef.current = true;

          existingObj.set({
            left: element.transform.x,
            top: element.transform.y,
            angle: element.transform.rotation,
            opacity: element.opacity,
            visible: element.visible,
            selectable: !element.locked,
          });

          // Désactiver le flag après un court délai
          setTimeout(() => {
            isUpdatingFromStoreRef.current = false;
          }, 50);
        }

        // Mise à jour des propriétés spécifiques selon le type
        if (element.type === 'text') {
          const textEl = element as TextElement;
          (existingObj as fabric.IText).set({
            text: textEl.content,
            fontFamily: textEl.fontFamily,
            fontSize: textEl.fontSize,
            fontWeight: textEl.fontWeight,
            fontStyle: textEl.fontStyle,
            textAlign: textEl.textAlign,
            fill: textEl.color,
            lineHeight: textEl.lineHeight,
            charSpacing: textEl.letterSpacing * 10,
          });
        } else if (element.type === 'shape') {
          const shapeEl = element as ShapeElement;
          existingObj.set({
            fill: shapeEl.fill,
            stroke: shapeEl.stroke,
            strokeWidth: shapeEl.strokeWidth,
          });

          if (shapeEl.shapeType === 'rectangle' && existingObj.type === 'rect') {
            (existingObj as fabric.Rect).set({
              rx: shapeEl.cornerRadius || 0,
              ry: shapeEl.cornerRadius || 0,
            });
          }
        } else if (element.type === 'image') {
          const imgEl = element as ImageElement;

          // Pour les images, calculer les scales en fonction des dimensions
          if (existingObj.width && existingObj.height) {
            const newScaleX = imgEl.transform.width / existingObj.width;
            const newScaleY = imgEl.transform.height / existingObj.height;

            const currentScaleX = existingObj.scaleX || 1;
            const currentScaleY = existingObj.scaleY || 1;

            // Ne mettre à jour que si les scales ont vraiment changé
            if (Math.abs(currentScaleX - newScaleX) > 0.01 || Math.abs(currentScaleY - newScaleY) > 0.01) {
              isUpdatingFromStoreRef.current = true;

              existingObj.set({
                scaleX: newScaleX,
                scaleY: newScaleY,
              });

              setTimeout(() => {
                isUpdatingFromStoreRef.current = false;
              }, 50);
            }
          } else {
            // Fallback si width/height ne sont pas disponibles
            existingObj.set({
              scaleX: imgEl.transform.scaleX,
              scaleY: imgEl.transform.scaleY,
            });
          }

          // Appliquer les filtres
          if (imgEl.filters && existingObj.type === 'image') {
            applyFabricFilters(existingObj as fabric.Image, imgEl.filters);
            existingObj.dirty = true;
          }
        } else {
          // Mettre à jour les dimensions pour les autres types (text, shape)
          if (existingObj.width && existingObj.height) {
            const currentWidth = existingObj.width * (existingObj.scaleX || 1);
            const currentHeight = existingObj.height * (existingObj.scaleY || 1);

            if (Math.abs(currentWidth - element.transform.width) > 1 ||
                Math.abs(currentHeight - element.transform.height) > 1) {
              existingObj.set({
                scaleX: element.transform.width / existingObj.width,
                scaleY: element.transform.height / existingObj.height,
              });
            }
          }
        }

        // Mettre à jour l'ordre Z si nécessaire
        const currentIndex = canvas.getObjects().indexOf(existingObj);
        const desiredIndex = element.zIndex + 1; // +1 car le workboard est à l'index 0

        if (currentIndex !== desiredIndex) {
          existingObj.moveTo(desiredIndex);
        }

        // Forcer le rendu après les changements
        existingObj.setCoords();
        canvas.renderAll();
      } else {
        // Créer un nouvel objet
        if (element.type === 'image') {
          const imgElement = element as ImageElement;

          fabric.Image.fromURL(
            imgElement.src,
            (img) => {
              if (!img) return;

              // Calculer le scale nécessaire pour atteindre la largeur/hauteur voulue
              const scaleX = imgElement.transform.width / (img.width || 1);
              const scaleY = imgElement.transform.height / (img.height || 1);

              img.set({
                left: imgElement.transform.x,
                top: imgElement.transform.y,
                scaleX,
                scaleY,
                angle: imgElement.transform.rotation,
                opacity: imgElement.opacity,
                selectable: !imgElement.locked,
                visible: imgElement.visible,
                lockScalingFlip: true,
                lockUniScaling: false,
              });

              // Appliquer les filtres si présents
              if (imgElement.filters) {
                applyFabricFilters(img, imgElement.filters);
              }

              img.set('data', { id: imgElement.id });
              canvas.add(img);
              canvas.renderAll();
            },
            {
              crossOrigin: 'anonymous',
            }
          );
        } else {
          const obj = createFabricObject(element);
          if (obj) {
            canvas.add(obj);
          }
        }
      }
    });

    canvas.renderAll();
  }, [project?.elements, createFabricObject]);

  // Mettre à jour le zoom
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.setZoom(zoom);
    canvas.renderAll();
  }, [zoom]);

  // Mettre à jour la couleur de fond du workboard
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !project) return;

    // Trouver le workboard
    const workboard = canvas.getObjects().find((obj: any) => obj.data?.isWorkboard);
    if (workboard) {
      workboard.set('fill', project.backgroundColor);
      canvas.renderAll();
    }
  }, [project?.backgroundColor]);

  // Synchroniser la sélection du store vers le canvas
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !project) return;

    // Double requestAnimationFrame pour s'assurer que les objets sont complètement rendus
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Activer le flag pour ignorer les events canvas pendant la mise à jour
        isUpdatingSelectionFromStoreRef.current = true;

        // Trouver les objets Fabric correspondant aux IDs sélectionnés
        const objectsToSelect: fabric.Object[] = [];

        canvas.getObjects().forEach((obj: any) => {
          if (obj.data?.id && selectedElementIds.includes(obj.data.id)) {
            objectsToSelect.push(obj);
          }
        });

        console.log('🎯 Selection sync:', {
          selectedElementIds,
          canvasObjects: canvas.getObjects().length,
          objectsFound: objectsToSelect.length,
          allObjectIds: canvas.getObjects().map((obj: any) => obj.data?.id).filter(Boolean)
        });

        if (objectsToSelect.length === 0) {
          // Déselectionner tout si aucun élément sélectionné dans le store
          if (selectedElementIds.length === 0) {
            canvas.discardActiveObject();
          }
        } else if (objectsToSelect.length === 1) {
          // Sélectionner un seul objet
          canvas.setActiveObject(objectsToSelect[0]);
        } else {
          // Sélection multiple
          const selection = new fabric.ActiveSelection(objectsToSelect, {
            canvas: canvas,
          });
          canvas.setActiveObject(selection);
        }

        canvas.requestRenderAll();

        // Désactiver le flag après un court délai
        setTimeout(() => {
          isUpdatingSelectionFromStoreRef.current = false;
        }, 100);
      });
    });
  }, [selectedElementIds, project?.elements.length]);

  return (
    <div ref={containerRef} className="canvas-area w-full h-full">
      <canvas ref={canvasRef} />
    </div>
  );
}
