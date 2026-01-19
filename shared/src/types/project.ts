/**
 * Types de projets supportés par Create
 */
export type ProjectType = 'design' | 'photo' | 'video';

/**
 * Dimensions d'un canvas/projet
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Formats prédéfinis pour les projets
 */
export interface PresetFormat {
  id: string;
  name: string;
  dimensions: Dimensions;
  category: 'social' | 'print' | 'presentation' | 'video' | 'custom';
}

/**
 * Métadonnées d'un projet
 */
export interface ProjectMeta {
  id: string;
  name: string;
  type: ProjectType;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
}

/**
 * Projet complet
 */
export interface Project extends ProjectMeta {
  dimensions: Dimensions;
  backgroundColor: string;
  elements: CanvasElement[];
}

/**
 * Types d'éléments sur le canvas
 */
export type ElementType = 'text' | 'image' | 'shape' | 'video' | 'audio';

/**
 * Position et transformation d'un élément
 */
export interface Transform {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

/**
 * Élément de base sur le canvas
 */
export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  transform: Transform;
  opacity: number;
  visible: boolean;
  locked: boolean;
  zIndex: number;
}

/**
 * Élément texte
 */
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  color: string;
  lineHeight: number;
  letterSpacing: number;
}

/**
 * Élément image
 */
export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  originalSrc: string;
  filters: ImageFilters;
  cropArea?: CropArea;
}

/**
 * Filtres d'image
 */
export interface ImageFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
}

/**
 * Zone de recadrage
 */
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Types de formes
 */
export type ShapeType = 'rectangle' | 'circle' | 'triangle' | 'line' | 'polygon' | 'star';

/**
 * Élément forme
 */
export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius?: number;
  points?: number; // Pour polygone et étoile
}

/**
 * Élément vidéo
 */
export interface VideoElement extends BaseElement {
  type: 'video';
  src: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  muted: boolean;
  loop: boolean;
}

/**
 * Élément audio
 */
export interface AudioElement extends BaseElement {
  type: 'audio';
  src: string;
  duration: number;
  startTime: number;
  endTime: number;
  volume: number;
  fadeIn: number;
  fadeOut: number;
}

/**
 * Union de tous les types d'éléments
 */
export type CanvasElement =
  | TextElement
  | ImageElement
  | ShapeElement
  | VideoElement
  | AudioElement;

/**
 * Formats prédéfinis courants
 */
export const PRESET_FORMATS: PresetFormat[] = [
  // Social Media
  { id: 'instagram-post', name: 'Post Instagram', dimensions: { width: 1080, height: 1080 }, category: 'social' },
  { id: 'instagram-story', name: 'Story Instagram', dimensions: { width: 1080, height: 1920 }, category: 'social' },
  { id: 'facebook-post', name: 'Post Facebook', dimensions: { width: 1200, height: 630 }, category: 'social' },
  { id: 'twitter-post', name: 'Post Twitter/X', dimensions: { width: 1200, height: 675 }, category: 'social' },
  { id: 'linkedin-post', name: 'Post LinkedIn', dimensions: { width: 1200, height: 627 }, category: 'social' },
  { id: 'youtube-thumbnail', name: 'Miniature YouTube', dimensions: { width: 1280, height: 720 }, category: 'social' },

  // Vidéo
  { id: 'video-landscape', name: 'Vidéo 16:9', dimensions: { width: 1920, height: 1080 }, category: 'video' },
  { id: 'video-portrait', name: 'Vidéo 9:16', dimensions: { width: 1080, height: 1920 }, category: 'video' },
  { id: 'video-square', name: 'Vidéo carrée', dimensions: { width: 1080, height: 1080 }, category: 'video' },

  // Présentation
  { id: 'presentation-16-9', name: 'Présentation 16:9', dimensions: { width: 1920, height: 1080 }, category: 'presentation' },
  { id: 'presentation-4-3', name: 'Présentation 4:3', dimensions: { width: 1024, height: 768 }, category: 'presentation' },

  // Print
  { id: 'a4-portrait', name: 'A4 Portrait', dimensions: { width: 2480, height: 3508 }, category: 'print' },
  { id: 'a4-landscape', name: 'A4 Paysage', dimensions: { width: 3508, height: 2480 }, category: 'print' },
  { id: 'business-card', name: 'Carte de visite', dimensions: { width: 1050, height: 600 }, category: 'print' },
];

/**
 * Valeurs par défaut pour les filtres d'image
 */
export const DEFAULT_IMAGE_FILTERS: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
};
