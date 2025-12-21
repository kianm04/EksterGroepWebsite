/**
 * TypeScript interfaces for the modular 3D model loading system
 */

/**
 * Configuration for a single 3D model
 */
export interface ModelConfig {
  /** Unique identifier for the model */
  id: string;

  /** Display name for the model */
  name: string;

  /** Path to the GLTF/GLB file */
  path: string;

  /** Button label for loading this model */
  buttonLabel: string;

  /** Optional description for the model */
  description?: string;

  /** Optional thumbnail image path */
  thumbnail?: string;

  /** Scene object identifiers */
  sceneObjects?: {
    /** Name of the main mesh in the scene */
    meshName?: string;

    /** Name of the camera object in the scene */
    cameraName?: string;

    /** Name of the look-at target object */
    lookAtTargetName?: string;
  };

  /** Camera configuration */
  camera?: {
    /** Default camera position [x, y, z] */
    position?: [number, number, number];

    /** Field of view in degrees */
    fov?: number;

    /** Spherical coordinate radius for orbit controls */
    sphericalRadius?: number;

    /** Initial theta angle (horizontal rotation) */
    initialTheta?: number;

    /** Initial phi angle (vertical rotation) */
    initialPhi?: number;

    /** Y offset to adjust camera height (compensates for different lookAtTarget positions) */
    yOffset?: number;
  };

  /** Placeholder configuration */
  placeholder?: {
    /** Box dimensions [width, height, depth] */
    dimensions?: [number, number, number];

    /** Initial rotation [x, y, z] in radians */
    rotation?: [number, number, number];

    /** Placeholder color (hex string) */
    color?: string;
  };

  /** Loading hints */
  loading?: {
    /** Estimated file size for display */
    fileSize?: string;

    /** Loading message to display */
    loadingMessage?: string;

    /** Use Draco compression */
    useDraco?: boolean;
  };

  /** Optional tags for categorization */
  tags?: string[];

  /** Optional metadata */
  metadata?: Record<string, any>;
}

/**
 * Model loading state
 */
export interface ModelLoadingState {
  /** Current model being loaded */
  modelId: string | null;

  /** Loading progress (0-1) */
  progress: number;

  /** Is currently loading */
  isLoading: boolean;

  /** Has finished loading */
  isLoaded: boolean;

  /** Error message if loading failed */
  error: string | null;
}

/**
 * Model scene data after loading
 */
export interface ModelSceneData {
  /** The loaded THREE.js scene */
  scene: THREE.Object3D;

  /** Extracted camera (if found) */
  camera?: THREE.PerspectiveCamera;

  /** Extracted look-at target (if found) */
  lookAtTarget?: THREE.Object3D;

  /** Main mesh object (if found) */
  mesh?: THREE.Object3D;

  /** Any animations in the scene */
  animations?: THREE.AnimationClip[];
}

/**
 * Events emitted during model loading
 */
export interface ModelEvents {
  'loading-started': [];
  'loading-progress': [progress: number];
  'loading-complete': [];
  'loading-error': [error: Error];
  'model-ready': [model: THREE.Object3D];
  'camera-ready': [camera: THREE.PerspectiveCamera];
  'scene-ready': [scene: ModelSceneData];
}

/**
 * Default values for model configuration
 */
export const MODEL_DEFAULTS = {
  camera: {
    position: [30, 20, 30] as [number, number, number],
    fov: 50,
    sphericalRadius: 45,
    initialTheta: Math.atan2(30, 30),
    initialPhi: Math.PI / 3,
  },
  placeholder: {
    dimensions: [15, 12, 15] as [number, number, number],
    rotation: [0, Math.PI / 6, 0] as [number, number, number],
    color: '#FFFFFF',
  },
  sceneObjects: {
    cameraName: 'Camera',
    lookAtTargetName: 'EmptyLookAtTarget',
  },
  loading: {
    useDraco: true,
    loadingMessage: 'Loading 3D model...',
  },
} as const;

/**
 * Type helper for creating model configs with defaults
 */
export type ModelConfigWithDefaults = ModelConfig & {
  camera: Required<ModelConfig['camera']>;
  placeholder: Required<ModelConfig['placeholder']>;
  sceneObjects: Required<ModelConfig['sceneObjects']>;
  loading: Required<ModelConfig['loading']>;
};