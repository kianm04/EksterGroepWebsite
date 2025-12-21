import { ref, computed } from 'vue'
import { MODELS, getModelById } from '~/config/models'
import type { ModelConfig } from '~/types/models'

export interface UseModelCarouselConfig {
  autoLoadFirst?: boolean
}

/**
 * Composable for managing multi-model carousel navigation
 * Handles model switching, loading states, and navigation logic
 */
export function useModelCarousel(config: UseModelCarouselConfig = {}) {
  const { autoLoadFirst = true } = config

  // Current model index in the MODELS array
  const currentIndex = ref(0)

  // Loading state
  const isLoading = ref(false)
  const loadingProgress = ref(0)

  // Track which models have been loaded
  const loadedModelIds = ref<string[]>([])

  // Computed: current model configuration
  const currentModel = computed<ModelConfig | undefined>(() => {
    return MODELS[currentIndex.value]
  })

  // Computed: all available models
  const models = computed(() => MODELS)

  // Computed: total number of models
  const totalModels = computed(() => MODELS.length)

  // Navigation state
  const canGoNext = computed(() => {
    return currentIndex.value < MODELS.length - 1
  })

  const canGoPrevious = computed(() => {
    return currentIndex.value > 0
  })

  // Check if a specific model is loaded
  const isModelLoaded = (modelId: string): boolean => {
    return loadedModelIds.value.includes(modelId)
  }

  // Mark a model as loaded
  const markModelLoaded = (modelId: string) => {
    if (!loadedModelIds.value.includes(modelId)) {
      loadedModelIds.value.push(modelId)
    }
  }

  // Navigation functions
  const goNext = () => {
    if (canGoNext.value) {
      currentIndex.value++
    }
  }

  const goPrevious = () => {
    if (canGoPrevious.value) {
      currentIndex.value--
    }
  }

  const goToIndex = (index: number) => {
    if (index >= 0 && index < MODELS.length) {
      currentIndex.value = index
    }
  }

  const goToModel = (modelId: string) => {
    const index = MODELS.findIndex(m => m.id === modelId)
    if (index !== -1) {
      currentIndex.value = index
    }
  }

  // Set loading state
  const setLoading = (loading: boolean, progress = 0) => {
    isLoading.value = loading
    loadingProgress.value = progress
  }

  // Initialize: mark first model for auto-load if configured
  if (autoLoadFirst && MODELS.length > 0) {
    // The actual loading happens in HouseModelRig, we just track state here
  }

  return {
    // State
    currentIndex: computed(() => currentIndex.value),
    currentModel,
    models,
    totalModels,

    // Navigation state
    canGoNext,
    canGoPrevious,

    // Navigation functions
    goNext,
    goPrevious,
    goToIndex,
    goToModel,

    // Loading state
    isLoading: computed(() => isLoading.value),
    loadingProgress: computed(() => loadingProgress.value),
    setLoading,

    // Loaded models tracking
    loadedModelIds: computed(() => loadedModelIds.value),
    isModelLoaded,
    markModelLoaded,
  }
}
