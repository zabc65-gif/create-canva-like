import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from '@/stores/editorStore';
import type { VideoElement } from '@create/shared';

interface VideoOverlayProps {
  canvas: fabric.Canvas | null;
  project: any;
}

interface VideoElementOverlayProps {
  element: VideoElement;
  isSelected: boolean;
  fabricObject: fabric.Object | null;
  zoom: number;
  viewportTransform: number[];
}

function VideoElementOverlay({
  element,
  isSelected,
  fabricObject,
  zoom,
  viewportTransform,
}: VideoElementOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStyle, setVideoStyle] = useState<React.CSSProperties>({});
  const { updateElement } = useEditorStore();

  // Fonction pour calculer le transform CSS à partir de l'objet Fabric
  const calculateTransform = () => {
    if (!fabricObject) return {};

    const left = fabricObject.left || 0;
    const top = fabricObject.top || 0;
    const angle = fabricObject.angle || 0;
    const scaleX = fabricObject.scaleX || 1;
    const scaleY = fabricObject.scaleY || 1;
    const width = element.transform.width;
    const height = element.transform.height;

    // Appliquer le viewport transform (zoom/pan)
    const vpt = viewportTransform;
    const transformedLeft = left * vpt[0] + vpt[4];
    const transformedTop = top * vpt[3] + vpt[5];
    const transformedWidth = width * scaleX * vpt[0];
    const transformedHeight = height * scaleY * vpt[3];

    return {
      position: 'absolute' as const,
      left: `${transformedLeft}px`,
      top: `${transformedTop}px`,
      width: `${transformedWidth}px`,
      height: `${transformedHeight}px`,
      transform: `rotate(${angle}deg)`,
      transformOrigin: 'center center',
      opacity: element.opacity,
      display: element.visible ? 'block' : 'none',
      zIndex: element.zIndex + 1000,
      pointerEvents: 'none' as any, // Toujours none pour permettre le drag via Fabric
      outline: isSelected ? '2px solid #8b5cf6' : 'none',
      outlineOffset: '-2px',
      transition: 'outline 0.15s ease',
    };
  };

  // Synchroniser le style avec l'objet Fabric
  useEffect(() => {
    if (!fabricObject) return;

    const updateStyle = () => {
      requestAnimationFrame(() => {
        setVideoStyle(calculateTransform());
      });
    };

    // Mettre à jour immédiatement
    updateStyle();

    // Observer les changements
    const intervalId = setInterval(updateStyle, 16); // 60fps

    return () => clearInterval(intervalId);
  }, [fabricObject, element, isSelected, zoom, viewportTransform]);

  // Gérer le trim de la vidéo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // Empêcher la lecture avant startTime
      if (video.currentTime < element.startTime) {
        video.currentTime = element.startTime;
      }

      // Gérer la fin du trim
      if (video.currentTime >= element.endTime) {
        if (element.loop) {
          video.currentTime = element.startTime;
        } else {
          video.pause();
        }
      }
    };

    const handleLoadedMetadata = () => {
      // Démarrer au début du trim
      video.currentTime = element.startTime;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [element.startTime, element.endTime, element.loop]);

  // Appliquer volume et muted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = element.volume;
    video.muted = element.muted;
  }, [element.volume, element.muted]);

  // Cleanup au démontage
  useEffect(() => {
    return () => {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }

      // Révoquer les blob URLs si applicable
      if (element.src.startsWith('blob:')) {
        URL.revokeObjectURL(element.src);
      }
    };
  }, [element.id]);

  // Pause automatique quand caché
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!element.visible) {
      video.pause();
    }
  }, [element.visible]);

  return (
    <video
      ref={videoRef}
      id={`video-${element.id}`}
      src={element.src}
      style={videoStyle}
      preload="metadata"
      playsInline
      className="select-none"
    />
  );
}

export default function VideoOverlay({ canvas, project }: VideoOverlayProps) {
  const { selectedElementIds, zoom } = useEditorStore();
  const [viewportTransform, setViewportTransform] = useState<number[]>([1, 0, 0, 1, 0, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mettre à jour le viewport transform
  useEffect(() => {
    if (!canvas) return;

    const updateViewport = () => {
      const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
      setViewportTransform([...vpt]);
    };

    // Mettre à jour immédiatement
    updateViewport();

    // Écouter les événements de canvas
    canvas.on('after:render', updateViewport);

    return () => {
      canvas.off('after:render', updateViewport);
    };
  }, [canvas]);

  if (!project) return null;

  // Filtrer les éléments vidéo
  const videoElements = project.elements.filter(
    (el: any) => el.type === 'video'
  ) as VideoElement[];

  if (videoElements.length === 0) return null;

  // Créer une map des objets Fabric
  const fabricObjects = new Map<string, fabric.Object>();
  if (canvas) {
    canvas.getObjects().forEach((obj: any) => {
      if (obj.data?.id) {
        fabricObjects.set(obj.data.id, obj);
      }
    });
  }

  return (
    <div
      ref={containerRef}
      className="video-overlay-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {videoElements.map((video) => (
        <VideoElementOverlay
          key={video.id}
          element={video}
          isSelected={selectedElementIds.includes(video.id)}
          fabricObject={fabricObjects.get(video.id) || null}
          zoom={zoom}
          viewportTransform={viewportTransform}
        />
      ))}
    </div>
  );
}
