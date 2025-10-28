<script lang="ts" setup>
import { useGLTF } from '@tresjs/cientos'
import * as THREE from 'three'
import { inject, shallowRef, onUnmounted, computed, watch } from 'vue'

const { state, isLoading } = useGLTF('/models/ok12b.glb', { draco: true })

// Emit event when camera is ready
const emit = defineEmits<{
  'camera-ready': [camera: THREE.PerspectiveCamera]
}>()

// Inject loading progress update functions from app.vue
const updateModelLoadingProgress = inject<(progress: number) => void>('updateModelLoadingProgress')
const completeModelLoading = inject<() => void>('completeModelLoading')

// Store the found camera reference (stays in scene hierarchy) and animation mixer
const sceneCamera = shallowRef<THREE.PerspectiveCamera | null>(null)
const mixer = shallowRef<THREE.AnimationMixer | null>(null)

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

// Extract camera reference and setup animation from the loaded scene
watch(state, (newState) => {
  if (!newState?.scene) return

  // First, update the entire scene's matrix world to ensure all transforms are current
  newState.scene.updateMatrixWorld(true)

  // Find camera in the scene (but keep it in the hierarchy)
  // The camera remains part of the scene and inherits all parent transforms
  newState.scene.traverse((child) => {
    if (child instanceof THREE.PerspectiveCamera && !sceneCamera.value) {
      console.log("Camera found:", child.name)
      console.log("Camera local position:", child.position)
      console.log("Camera parent:", child.parent?.name)

      // Update world matrix for this specific camera
      child.updateMatrixWorld(true)

      // Get the world position (after parent transforms)
      const worldPosition = new THREE.Vector3()
      child.getWorldPosition(worldPosition)
      console.log("Camera world position:", worldPosition)
      console.log("Camera matrix world:", child.matrixWorld)

      sceneCamera.value = child

      console.log("GLTF camera ready for TresJS")
      console.log("  FOV:", child.fov)
      console.log("  Near:", child.near)
      console.log("  Far:", child.far)

      // Emit the camera so parent component can use it
      emit('camera-ready', child)
    }
  })

  // Setup animation if animations exist
  if (newState.animations && newState.animations.length > 0) {
    console.log(`Found ${newState.animations.length} animations`)

    // Create animation mixer for the scene
    mixer.value = new THREE.AnimationMixer(newState.scene)

    // Find and play camera animations
    newState.animations.forEach((clip: THREE.AnimationClip) => {
      console.log(`Animation clip: ${clip.name}, duration: ${clip.duration}s`)

      // Check if this animation affects the camera
      const hasCameraTrack = clip.tracks.some(track =>
        track.name.includes('Camera') ||
        track.name.includes(sceneCamera.value?.name || '')
      )
      if (hasCameraTrack && mixer.value) {

        // console.log(`Playing camera animation: ${clip.name}`)
        // const action = mixer.value.clipAction(clip)
        // mixer.value.timeScale = 0.1;

        // action.play()
        // Make the animation loop
        // action.setLoop(THREE.LoopRepeat, Infinity)
      }
    })
  }
}, { immediate: true })

// Animation loop with clock for delta time
const clock = new THREE.Clock()
let animationId: number | null = null

const animate = () => {
  if (mixer.value) {
    const delta = clock.getDelta()

    // Update the animation mixer
    mixer.value.update(delta)

    // After updating the animation, ensure the camera's world matrix is updated
    // This is crucial for animations that move the camera or its parents
    if (sceneCamera.value) {
      sceneCamera.value.updateMatrixWorld(true)
    }

    // Also update the entire scene's matrix world
    if (state.value?.scene) {
      state.value.scene.updateMatrixWorld(true)
    }
  }

  animationId = requestAnimationFrame(animate)
}

// Start animation when mixer is ready
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

// Use the entire scene instead of extracting individual objects
// This preserves the hierarchy and relationships between objects
const scene = computed(() => state.value?.scene || null)
</script>

<template>
  <!-- Render the entire scene with all its objects and hierarchy intact -->
  <!-- The GLTF camera stays within the scene to maintain parent transformations -->
  <primitive v-if="scene" :object="scene" />

  <!-- Use the GLTF camera directly as the active camera -->
  <!-- The key is to render it after the scene so it can be found and attached -->
  <primitive
    v-if="sceneCamera"
    :object="sceneCamera"
    attach="camera"
  />

  <!-- Additional lighting for the scene -->
  <TresAmbientLight :intensity="3" />
</template>