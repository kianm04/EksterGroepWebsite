/**
 * Composable for loading 3D models with configuration support
 */

import { ref, computed, watch, type Ref } from 'vue';
import * as THREE from 'three';
import { useGLTF } from '@tresjs/cientos';
import type { ModelConfig, ModelLoadingState, ModelSceneData } from '~/types/models';
import { getModelWithDefaults, STORAGE_KEYS } from '~/config/models';

export interface UseModelLoaderOptions {
  /** Model configuration */
  modelConfig: ModelConfig;

  /** Whether to start loading immediately */
  autoLoad?: boolean;

  /** Callback when loading starts */
  onLoadingStart?: () => void;

  /** Callback for loading progress */
  onProgress?: (progress: number) => void;

  /** Callback when loading completes */
  onLoadingComplete?: (sceneData: ModelSceneData) => void;

  /** Callback on loading error */
  onError?: (error: Error) => void;
}

export interface UseModelLoaderReturn {
  /** Current loading state */
  loadingState: Ref<ModelLoadingState>;

  /** The loaded scene data */
  sceneData: Ref<ModelSceneData | null>;

  /** Progress (0-1) */
  progress: Ref<number>;

  /** Is currently loading */
  isLoading: Ref<boolean>;

  /** Has finished loading */
  isLoaded: Ref<boolean>;

  /** Loading error if any */
  error: Ref<Error | null>;

  /** Start loading the model */
  load: () => void;

  /** Reset the loader state */
  reset: () => void;

  /** Check if model is cached */
  isCached: () => boolean;

  /** Clear cache for this model */
  clearCache: () => void;
}

/**
 * Composable for loading 3D models
 */
export function useModelLoader(
  options: UseModelLoaderOptions
): UseModelLoaderReturn {
  const { modelConfig, autoLoad = false, onLoadingStart, onProgress, onLoadingComplete, onError } = options;

  // Get model with defaults
  const configWithDefaults = getModelWithDefaults(modelConfig.id);
  if (!configWithDefaults) {
    throw new Error(`Model configuration not found for ID: ${modelConfig.id}`);
  }

  // Loading state
  const loadingState = ref<ModelLoadingState>({
    modelId: modelConfig.id,
    progress: 0,
    isLoading: false,
    isLoaded: false,
    error: null,
  });

  // Scene data after loading
  const sceneData = ref<ModelSceneData | null>(null);

  // Error state
  const error = ref<Error | null>(null);

  // Use GLTF loader - always loads (Vue 3 requirement)
  const { state, isLoading: gltfIsLoading } = useGLTF(modelConfig.path, {
    draco: configWithDefaults.loading.useDraco,
  });

  // Computed properties
  const progress = computed(() => loadingState.value.progress);
  const isLoading = computed(() => loadingState.value.isLoading);
  const isLoaded = computed(() => loadingState.value.isLoaded);

  // Track if we should process the scene
  const shouldProcess = ref(autoLoad);

  // Watch GLTF loading state
  watch(gltfIsLoading, (loading) => {
    if (!shouldProcess.value) return;

    if (loading && !loadingState.value.isLoading) {
      loadingState.value.isLoading = true;
      onLoadingStart?.();
    }
  });

  // Watch for scene to be loaded
  watch(
    () => state.value?.scene,
    (loadedScene) => {
      if (!loadedScene || !shouldProcess.value) return;

      try {
        // Extract scene objects based on configuration
        const extractedData = extractSceneObjects(loadedScene, configWithDefaults);

        // Store scene data
        sceneData.value = extractedData;

        // Update loading state
        loadingState.value.isLoading = false;
        loadingState.value.isLoaded = true;
        loadingState.value.progress = 1;

        // Save to cache
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            `${STORAGE_KEYS.MODEL_LOADED}_${modelConfig.id}`,
            'true'
          );
        }

        // Callback
        onLoadingComplete?.(extractedData);
      } catch (err) {
        const errorObj = err as Error;
        error.value = errorObj;
        loadingState.value.error = errorObj.message;
        loadingState.value.isLoading = false;
        onError?.(errorObj);
      }
    },
    { immediate: true }
  );

  /**
   * Extract scene objects based on configuration
   */
  function extractSceneObjects(
    scene: THREE.Object3D,
    config: NonNullable<typeof configWithDefaults>
  ): ModelSceneData {
    let camera: THREE.PerspectiveCamera | undefined;
    let lookAtTarget: THREE.Object3D | undefined;
    let mesh: THREE.Object3D | undefined;
    const animations: THREE.AnimationClip[] = [];

    // Traverse the scene
    scene.traverse((child) => {
      // Find camera
      if (config.sceneObjects.cameraName && child.name === config.sceneObjects.cameraName) {
        camera = child as THREE.PerspectiveCamera;
      }

      // Find look-at target
      if (config.sceneObjects.lookAtTargetName && child.name === config.sceneObjects.lookAtTargetName) {
        lookAtTarget = child as THREE.Object3D;
      }

      // Find main mesh
      if (config.sceneObjects.meshName && child.name === config.sceneObjects.meshName) {
        mesh = child as THREE.Object3D;
      }
    });

    // Check for animations (if the GLTF contains any)
    if (state.value?.animations) {
      animations.push(...state.value.animations);
    }

    return {
      scene,
      camera,
      lookAtTarget,
      mesh,
      animations,
    };
  }

  /**
   * Start loading the model
   */
  function load() {
    if (isLoaded.value || isLoading.value) return;
    shouldProcess.value = true;

    // If already loaded, trigger callbacks
    if (state.value?.scene) {
      const scene = state.value.scene;
      const extractedData = extractSceneObjects(scene, configWithDefaults!);
      sceneData.value = extractedData;
      loadingState.value.isLoaded = true;
      onLoadingComplete?.(extractedData);
    }
  }

  /**
   * Reset the loader state
   */
  function reset() {
    shouldProcess.value = false;
    loadingState.value = {
      modelId: modelConfig.id,
      progress: 0,
      isLoading: false,
      isLoaded: false,
      error: null,
    };
    sceneData.value = null;
    error.value = null;
  }

  /**
   * Check if model is cached
   */
  function isCached(): boolean {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem(`${STORAGE_KEYS.MODEL_LOADED}_${modelConfig.id}`) === 'true';
  }

  /**
   * Clear cache for this model
   */
  function clearCache() {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`${STORAGE_KEYS.MODEL_LOADED}_${modelConfig.id}`);
    }
  }

  // Auto-load if requested
  if (autoLoad) {
    load();
  }

  return {
    loadingState,
    sceneData,
    progress,
    isLoading,
    isLoaded,
    error,
    load,
    reset,
    isCached,
    clearCache,
  };
}