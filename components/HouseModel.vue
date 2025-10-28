<script lang="ts" setup>
import { useGLTF } from '@tresjs/cientos'
import * as THREE from 'three'
import { inject, shallowRef, onUnmounted, computed, watch } from 'vue'

const { state, isLoading } = useGLTF('/models/ok12b.glb', { draco: true })

// Inject loading progress update functions from app.vue
const updateModelLoadingProgress = inject<(progress: number) => void>('updateModelLoadingProgress')
const completeModelLoading = inject<() => void>('completeModelLoading')

// Store the camera and animation mixer
const camera = shallowRef<THREE.PerspectiveCamera | null>(null)
const mixer = shallowRef<THREE.AnimationMixer | null>(null)
const clock = new THREE.Clock()

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

// Extract camera and setup animation from the loaded scene
watch(state, (newState) => {
  if (!newState?.scene) return

  // Find camera in the scene
  newState.scene.traverse((child) => {
    if (child instanceof THREE.PerspectiveCamera && !camera.value) {
      console.log("Camera found:", child.name)
      console.log(child)
      camera.value = child
    }
  })

  // Setup animation if animations exist
  if (newState.animations && newState.animations.length > 0 && camera.value) {
    console.log(`Found ${newState.animations.length} animations`)

    // Create animation mixer for the scene
    mixer.value = new THREE.AnimationMixer(newState.scene)

    // Find and play camera animations
    newState.animations.forEach((clip: THREE.AnimationClip) => {
      console.log(`Animation clip: ${clip.name}, duration: ${clip.duration}s`)

      // Check if this animation affects the camera
      const hasCameraTrack = clip.tracks.some(track =>
        track.name.includes('Camera') ||
        track.name.includes(camera.value?.name || '')
      )
      if (hasCameraTrack && mixer.value) {

        console.log(`Playing camera animation: ${clip.name}`)
        const action = mixer.value.clipAction(clip)
        mixer.value.timeScale = 0.1;

        action.play()
        // Make the animation loop
        // action.setLoop(THREE.LoopRepeat, Infinity)
      }
    })
  }
}, { immediate: true })

// Animation loop
let animationId: number | null = null

const animate = () => {
  if (mixer.value) {
    const delta = clock.getDelta()
    mixer.value.update(delta)
  }
  animationId = requestAnimationFrame(animate)
}

// Start animation loop when mixer is ready
watch(mixer, (newMixer) => {
  if (newMixer && !animationId) {
    animate()
  }
})

// Cleanup on unmount
onUnmounted(() => {
  // Stop animation loop
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  // Clean up mixer
  if (mixer.value) {
    mixer.value.stopAllAction()
    mixer.value.uncacheRoot(mixer.value.getRoot())
  }
})

// Dynamically find the first mesh/object that isn't a camera
const mesh = computed(() => {
  if (!state.value?.scene) return null

  for (const child of state.value.scene.children) {
    // Skip cameras
    if (child instanceof THREE.Camera) continue

    // Return first mesh or group
    if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
      return child
    }
  }
  return null
})
</script>

<template>
  <!-- Use the camera directly from the GLB file -->
  <primitive v-if="camera" :object="camera" />

  <!-- Model will appear when loaded -->
  <primitive v-if="mesh" :object="mesh" />

  <TresAmbientLight :intensity="3" />

</template>