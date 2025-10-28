<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'

const { initializeAppLoading, completeLoadingItem, finishLoading, updateItemProgress } = useAppLoader()

// State to track if model has completed
const modelLoaded = ref(false)

// Initialize loading when app mounts
onMounted(async () => {
  // Start loading process
  initializeAppLoading()

  // Mark app as initialized after a short delay
  setTimeout(() => {
    completeLoadingItem('app')
  }, 300)

  // Mark assets as loaded after a bit more time
  setTimeout(() => {
    completeLoadingItem('assets')
  }, 600)

  // Wait a bit to ensure HouseModel component has mounted and started loading
  // If model hasn't loaded after 10 seconds, force finish (fallback)
  setTimeout(async () => {
    if (!modelLoaded.value) {
      completeLoadingItem('3d-model')
      await finishLoading()
    }
  }, 10000)
})

// Provide a way for child components to update loading progress
provide('updateModelLoadingProgress', (progress: number) => {
  updateItemProgress('3d-model', progress)
})

provide('completeModelLoading', async () => {
  modelLoaded.value = true
  completeLoadingItem('3d-model')
  await finishLoading()
})
</script>

<template>
  <div>
    <!-- Loading component -->
    <AppLoader />

    <!-- Main app content -->
    <NuxtPage />
  </div>
</template>