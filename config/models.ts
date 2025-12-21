/**
 * Model configuration for the Ekster Group website
 * Defines all available 3D models and their settings
 */

import type { ModelConfig, ModelConfigWithDefaults, MODEL_DEFAULTS } from '~/types/models';

/**
 * Available 3D models
 */
export const MODELS: ModelConfig[] = [
  {
    id: 'ok10b',
    name: 'Ekster House',
    path: '/models/ok10b_circle.glb',
    buttonLabel: 'Huis 1',
    description: 'Primary architectural visualization',

    sceneObjects: {
      cameraName: 'Camera',
      lookAtTargetName: 'EmptyLookAtTarget',
    },

    camera: {
      position: [30, 20, 30],
      fov: 50,
      sphericalRadius: 45,
      initialTheta: Math.atan2(30, 30),
      initialPhi: Math.PI / 3,
    },

    placeholder: {
      dimensions: [15, 12, 15],
      rotation: [0, Math.PI / 6, 0],
      color: '#FFFFFF',
    },

    loading: {
      fileSize: '~25 MB',
      loadingMessage: 'Loading house model...',
      useDraco: true,
    },

    tags: ['architecture', 'residential', 'main'],
  },
  {
    id: 'br62b',
    name: 'Ekster House 2',
    path: '/models/br62b_circle.glb',
    buttonLabel: 'Huis 2',
    description: 'Secondary architectural visualization',

    sceneObjects: {
      cameraName: 'Camera',
      lookAtTargetName: 'EmptyLookAtTarget',
    },

    camera: {
      position: [30, 20, 30],
      fov: 50,
      sphericalRadius: 45,
      initialTheta: Math.atan2(30, 30),
      initialPhi: Math.PI / 3,
    },

    placeholder: {
      dimensions: [15, 12, 15],
      rotation: [0, Math.PI / 6, 0],
      color: '#FFFFFF',
    },

    loading: {
      fileSize: '~25 MB',
      loadingMessage: 'Loading house model...',
      useDraco: true,
    },

    tags: ['architecture', 'residential'],
  },
];

/**
 * Get a model configuration by ID
 */
export function getModelById(id: string): ModelConfig | undefined {
  return MODELS.find(model => model.id === id);
}

/**
 * Get a model configuration with defaults applied
 */
export function getModelWithDefaults(id: string): ModelConfigWithDefaults | undefined {
  const model = getModelById(id);
  if (!model) return undefined;

  return {
    ...model,
    camera: {
      ...MODEL_DEFAULTS.camera,
      ...model.camera,
    },
    placeholder: {
      ...MODEL_DEFAULTS.placeholder,
      ...model.placeholder,
    },
    sceneObjects: {
      ...MODEL_DEFAULTS.sceneObjects,
      ...model.sceneObjects,
    },
    loading: {
      ...MODEL_DEFAULTS.loading,
      ...model.loading,
    },
  };
}

/**
 * Get all models with a specific tag
 */
export function getModelsByTag(tag: string): ModelConfig[] {
  return MODELS.filter(model => model.tags?.includes(tag) ?? false);
}

/**
 * Get the default model (first in the list)
 */
export function getDefaultModel(): ModelConfig | undefined {
  return MODELS[0];
}

/**
 * Check if a model exists by ID
 */
export function modelExists(id: string): boolean {
  return MODELS.some(model => model.id === id);
}

/**
 * Get all available model IDs
 */
export function getModelIds(): string[] {
  return MODELS.map(model => model.id);
}

/**
 * Storage keys for model state persistence
 */
export const STORAGE_KEYS = {
  MODEL_LOADED: 'ekster_model_loaded',
  USER_INITIATED: 'ekster_user_initiated',
  SELECTED_MODEL: 'ekster_selected_model',
} as const;