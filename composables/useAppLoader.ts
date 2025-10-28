import { ref, computed } from 'vue'

interface LoadingItem {
  id: string
  progress: number
  label?: string
}

// Global loading state
const isLoading = ref(true)
const loadingProgress = ref(0)
const loadingItems = ref<Map<string, LoadingItem>>(new Map())
const minimumLoadingTime = 1200 // Minimum display time in ms
const loadingStartTime = ref(Date.now())

export function useAppLoader() {
  // Register a loading item (e.g., 3D model, assets, etc.)
  const registerLoadingItem = (id: string, label?: string) => {
    loadingItems.value.set(id, {
      id,
      progress: 0,
      label
    })
    updateOverallProgress()
  }

  // Update progress for a specific item
  const updateItemProgress = (id: string, progress: number) => {
    const item = loadingItems.value.get(id)
    if (item) {
      item.progress = Math.min(100, Math.max(0, progress))
      loadingItems.value.set(id, item)
      updateOverallProgress()
    }
  }

  // Mark an item as complete
  const completeLoadingItem = (id: string) => {
    updateItemProgress(id, 100)
  }

  // Calculate overall progress
  const updateOverallProgress = () => {
    if (loadingItems.value.size === 0) {
      loadingProgress.value = 0
      return
    }

    const totalProgress = Array.from(loadingItems.value.values())
      .reduce((sum, item) => sum + item.progress, 0)

    loadingProgress.value = Math.round(totalProgress / loadingItems.value.size)
  }

  // Check if all items are loaded
  const isFullyLoaded = computed(() => {
    if (loadingItems.value.size === 0) return false
    return Array.from(loadingItems.value.values())
      .every(item => item.progress === 100)
  })

  // Finish loading with minimum display time
  const finishLoading = async () => {
    // Ensure all items are at 100%
    if (!isFullyLoaded.value) {
      // Force complete any remaining items
      loadingItems.value.forEach((item) => {
        item.progress = 100
      })
      loadingProgress.value = 100
    }

    // Calculate remaining time to meet minimum display time
    const elapsedTime = Date.now() - loadingStartTime.value
    const remainingTime = Math.max(0, minimumLoadingTime - elapsedTime)

    // Wait for minimum time if needed
    if (remainingTime > 0) {
      await new Promise(resolve => setTimeout(resolve, remainingTime))
    }

    // Add a small delay for the exit animation
    await new Promise(resolve => setTimeout(resolve, 200))

    isLoading.value = false
  }

  // Force hide loading (emergency skip)
  const forceHideLoading = () => {
    loadingProgress.value = 100
    isLoading.value = false
  }

  // Reset loading state (useful for page transitions)
  const resetLoading = () => {
    isLoading.value = true
    loadingProgress.value = 0
    loadingItems.value.clear()
    loadingStartTime.value = Date.now()
  }

  // Initialize app loading
  const initializeAppLoading = () => {
    // Register default loading items
    registerLoadingItem('app', 'Initializing app')
    registerLoadingItem('3d-model', 'Loading 3D model')
    registerLoadingItem('assets', 'Loading assets')

    // Simulate app initialization progress
    setTimeout(() => updateItemProgress('app', 50), 100)
    setTimeout(() => updateItemProgress('app', 100), 300)

    // Simulate asset loading
    setTimeout(() => updateItemProgress('assets', 30), 200)
    setTimeout(() => updateItemProgress('assets', 60), 400)
    setTimeout(() => updateItemProgress('assets', 100), 600)
  }

  return {
    // State
    isLoading,
    loadingProgress,
    loadingItems,
    isFullyLoaded,

    // Methods
    registerLoadingItem,
    updateItemProgress,
    completeLoadingItem,
    finishLoading,
    forceHideLoading,
    resetLoading,
    initializeAppLoading
  }
}