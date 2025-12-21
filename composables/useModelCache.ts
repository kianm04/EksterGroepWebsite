import * as THREE from 'three'
import { markRaw } from 'vue'

/**
 * Global model cache - persists across component instances
 * Stores loaded GLTF scenes to enable instant switching
 */
const modelCache = new Map<string, THREE.Group>()

/**
 * Composable for caching loaded 3D models in memory
 * Enables instant switching between previously loaded models
 */
export function useModelCache() {
  /**
   * Get a cached model by its path
   */
  const getCachedModel = (path: string): THREE.Group | undefined => {
    return modelCache.get(path)
  }

  /**
   * Cache a loaded model scene
   * Uses markRaw to prevent Vue reactivity overhead on Three.js objects
   */
  const setCachedModel = (path: string, scene: THREE.Group): void => {
    modelCache.set(path, markRaw(scene))
  }

  /**
   * Check if a model is already cached
   */
  const isModelCached = (path: string): boolean => {
    return modelCache.has(path)
  }

  /**
   * Clear a specific model from cache
   */
  const clearCachedModel = (path: string): boolean => {
    return modelCache.delete(path)
  }

  /**
   * Clear all cached models
   */
  const clearAllCached = (): void => {
    modelCache.clear()
  }

  /**
   * Get the number of cached models
   */
  const getCacheSize = (): number => {
    return modelCache.size
  }

  return {
    getCachedModel,
    setCachedModel,
    isModelCached,
    clearCachedModel,
    clearAllCached,
    getCacheSize,
  }
}
