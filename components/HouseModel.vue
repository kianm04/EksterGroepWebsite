<script lang="ts" setup>
import { useGLTF } from '@tresjs/cientos'
import * as THREE from 'three'
import { inject } from 'vue'

const { state, isLoading } = useGLTF('/models/ok10b.glb', { draco: true })

// Inject loading progress update functions from app.vue
const updateModelLoadingProgress = inject<(progress: number) => void>('updateModelLoadingProgress')
const completeModelLoading = inject<() => void>('completeModelLoading')

const cameraProps = ref<{
  position: [number, number, number]
  rotation: [number, number, number]
  fov: number
} | null>(null)

// Track loading state
let hasCalledComplete = false
watch(isLoading, (loading) => {
  if (updateModelLoadingProgress) {
    // Simulate progress based on loading state
    if (loading) {
      updateModelLoadingProgress(50) // Model is loading
    } else {
      updateModelLoadingProgress(100) // Model loaded
      // Call complete once model is done loading
      if (!hasCalledComplete && completeModelLoading) {
        hasCalledComplete = true
        completeModelLoading()
      }
    }
  }
}, { immediate: true })

// Extract camera properties and find meshes from the loaded scene
watch(state, (newState) => {
  if (!newState?.scene) return

  // Find camera in the scene
  let camera: THREE.PerspectiveCamera | null = null
  newState.scene.traverse((child) => {
    console.log(child);
    if (child instanceof THREE.PerspectiveCamera && !camera) {
      console.log("camera found")
      camera = child
    }
  })

  if (camera) {
    // Type assertion needed because TypeScript loses track of the type after the traverse callback
    const cam = camera as THREE.PerspectiveCamera
    cameraProps.value = {
      position: [cam.position.x, cam.position.y, cam.position.z],
      rotation: [cam.rotation.x, cam.rotation.y, cam.rotation.z],
      fov: cam.fov
    }
  }
}, { immediate: true })

// Dynamically find the first mesh/object that isn't a camera
const mesh = computed(() => {
  if (!state.value?.scene) return null

  for (const child of state.value.scene.children) {
    if (child instanceof THREE.Mesh) {
      return child
    }
  }
  return null
})
</script>

<template>
  <TresPerspectiveCamera
    v-if="cameraProps"
    :position="cameraProps.position"
    :rotation="cameraProps.rotation"
    :fov="cameraProps.fov"
  />
  <!-- Model will appear when loaded -->
  <primitive v-if="mesh" :object="mesh" />

  <TresAmbientLight :intensity="3" />

</template>