<script lang="ts" setup>
import { useGLTF } from '@tresjs/cientos'
import * as THREE from 'three'
import { inject, shallowRef, onUnmounted, computed, watch, nextTick } from 'vue'

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

// Store camera's world transforms to preserve Blender positioning
const cameraWorldPosition = shallowRef<THREE.Vector3 | null>(null)
const cameraWorldQuaternion = shallowRef<THREE.Quaternion | null>(null)
const cameraWorldScale = shallowRef<THREE.Vector3 | null>(null)

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

      // Get and store the world transforms (after parent transforms)
      const worldPosition = new THREE.Vector3()
      const worldQuaternion = new THREE.Quaternion()
      const worldScale = new THREE.Vector3()

      child.getWorldPosition(worldPosition)
      child.getWorldQuaternion(worldQuaternion)
      child.getWorldScale(worldScale)

      console.log("Camera world position:", worldPosition)
      console.log("Camera world quaternion:", worldQuaternion)
      console.log("Camera world scale:", worldScale)
      console.log("Camera matrix world:", child.matrixWorld)

      // Store the world transforms for later application
      cameraWorldPosition.value = worldPosition.clone()
      cameraWorldQuaternion.value = worldQuaternion.clone()
      cameraWorldScale.value = worldScale.clone()

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

        console.log(`Playing camera animation: ${clip.name}`)
        const action = mixer.value.clipAction(clip)
        mixer.value.timeScale = 0.1;

        action.play()
        // Make the animation loop
        action.setLoop(THREE.LoopRepeat, Infinity)
      }
    })
  }
}, { immediate: true })

// Animation and render loop with clock for delta time
const clock = new THREE.Clock()
let animationId: number | null = null

const animate = () => {
  // Always apply stored transforms to maintain camera position
  if (sceneCamera.value && cameraWorldPosition.value) {
    // Ensure camera maintains its stored world transforms
    applyStoredTransforms()

    // Update the camera's world matrix
    sceneCamera.value.updateMatrixWorld(true)
  }

  // Update animation mixer if it exists
  if (mixer.value) {
    const delta = clock.getDelta()
    mixer.value.update(delta)
  }

  // Update the entire scene's matrix world
  if (state.value?.scene) {
    state.value.scene.updateMatrixWorld(true)
  }

  animationId = requestAnimationFrame(animate)
}

// Apply stored world transforms to the camera
let hasLoggedTransforms = false
const applyStoredTransforms = (shouldLog = false) => {
  if (sceneCamera.value && cameraWorldPosition.value && cameraWorldQuaternion.value && cameraWorldScale.value) {
    // Apply the stored world transforms
    sceneCamera.value.position.copy(cameraWorldPosition.value)
    sceneCamera.value.quaternion.copy(cameraWorldQuaternion.value)
    sceneCamera.value.scale.copy(cameraWorldScale.value)

    // Force matrix update
    sceneCamera.value.updateMatrixWorld(true)

    // Only log once or when explicitly requested
    if ((shouldLog || !hasLoggedTransforms) && shouldLog !== false) {
      console.log("Applied stored camera transforms")
      console.log("  Position:", sceneCamera.value.position)
      console.log("  Quaternion:", sceneCamera.value.quaternion)
      console.log("  Scale:", sceneCamera.value.scale)
      hasLoggedTransforms = true
    }
  }
}

// Watch for camera attachment, apply transforms, and start render loop
watch(sceneCamera, async (newCamera) => {
  if (newCamera) {
    // Wait for next tick to ensure camera is attached to TresJS
    await nextTick()

    // Apply the stored transforms after attachment (with logging)
    applyStoredTransforms(true)

    // Apply again after a short delay to ensure it sticks
    setTimeout(() => {
      applyStoredTransforms(true)
    }, 100)

    // Start the render loop to continuously maintain camera transforms
    if (!animationId) {
      animate()
    }
  }
})

// Also start animation when mixer is ready (for actual animations)
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