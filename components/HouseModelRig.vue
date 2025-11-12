<script setup lang="ts">
import { computed, onUnmounted, ref, shallowRef, watch, nextTick, markRaw } from "vue";
import * as THREE from "three";
import { useGLTF } from "@tresjs/cientos";

const { state } = useGLTF("/models/ok12b_circle_rig.glb", { draco: true });

const props = defineProps<{
  canvasElement?: HTMLCanvasElement | null;
}>();

const emit = defineEmits<{
  "camera-ready": [camera: THREE.PerspectiveCamera];
  "model-ready": [model: THREE.Object3D];
}>();

const scene = computed(() => state.value?.scene ?? null);
// Use shallowRef for Three.js objects to prevent deep reactivity
const pathMover = shallowRef<THREE.Object3D | null>(null);

// 🚨 start as null so the template does NOT try to attach too early
const runtimeCamera = shallowRef<THREE.PerspectiveCamera | null>(null);

const lookAtTarget = shallowRef<THREE.Object3D | null>(null);

const cameraCircle = shallowRef<THREE.Object3D | null>(null);

// Rotation wrapper for the house model - use shallowRef to avoid deep reactivity
const modelRotationWrapper = shallowRef<THREE.Group | null>(null);

const mixer = shallowRef<THREE.AnimationMixer | null>(null);
const clock = markRaw(new THREE.Clock());
let rafId: number | null = null;

// Track if scene is already initialized
let sceneInitialized = false;

// Mouse rotation state - use non-reactive values for rotation
const isInteracting = ref(false);
const previousMousePosition = { x: 0, y: 0 };
const targetRotation = { x: 0, y: 0 };
const currentRotation = { x: 0, y: 0 };

// Configuration
const sensitivity = 0.003;
const damping = 0.15;

// Mouse event handlers
const handleMouseDown = (event: MouseEvent) => {
  isInteracting.value = true;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;

  // Add cursor style
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grabbing";
  }
};

const handleMouseUp = () => {
  isInteracting.value = false;
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isInteracting.value || !modelRotationWrapper.value) return;

  // Calculate mouse delta
  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  // Update target rotation based on mouse movement
  targetRotation.y += deltaX * sensitivity;
  targetRotation.x += deltaY * sensitivity;

  // Clamp X rotation to prevent flipping
  targetRotation.x = Math.max(-Math.PI / 32, Math.min(Math.PI / 32, targetRotation.x));
  console.log(targetRotation)

  // Update previous mouse position
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
};

const handleMouseLeave = () => {
  isInteracting.value = false;
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

// Touch event handlers for mobile support
const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1) return;

  isInteracting.value = true;
  const touch = event.touches[0];
  if (!touch) return;

  previousMousePosition.x = touch.clientX;
  previousMousePosition.y = touch.clientY;
};

const handleTouchMove = (event: TouchEvent) => {
  if (!isInteracting.value || !modelRotationWrapper.value || event.touches.length !== 1) return;

  event.preventDefault(); // Prevent scrolling
  const touch = event.touches[0];
  if (!touch) return;

  // Calculate touch delta
  const deltaX = touch.clientX - previousMousePosition.x;
  const deltaY = touch.clientY - previousMousePosition.y;

  // Update target rotation
  targetRotation.y += deltaX * sensitivity;
  targetRotation.x += deltaY * sensitivity;

  // Clamp X rotation
  targetRotation.x = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, targetRotation.x));

  // Update previous position
  previousMousePosition.x = touch.clientX;
  previousMousePosition.y = touch.clientY;
};

const handleTouchEnd = () => {
  isInteracting.value = false;
};

// Initialize event listeners
const initializeListeners = () => {
  if (!props.canvasElement) return;

  const canvas = props.canvasElement;

  // Set initial cursor
  canvas.style.cursor = "grab";

  // Mouse events
  canvas.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);

  // Touch events for mobile
  canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
  canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
  canvas.addEventListener("touchend", handleTouchEnd);
};

// Cleanup event listeners
const cleanupListeners = () => {
  if (props.canvasElement) {
    const canvas = props.canvasElement;
    canvas.removeEventListener("mousedown", handleMouseDown);
    canvas.removeEventListener("mouseleave", handleMouseLeave);
    canvas.removeEventListener("touchstart", handleTouchStart);
    canvas.removeEventListener("touchmove", handleTouchMove);
    canvas.removeEventListener("touchend", handleTouchEnd);
  }
  window.removeEventListener("mouseup", handleMouseUp);
  window.removeEventListener("mousemove", handleMouseMove);
};

watch(
  scene,
  async (loadedScene) => {
    if (!loadedScene || sceneInitialized) return;

    // Mark as initialized to prevent duplicate setup
    sceneInitialized = true;

    // Create rotation wrapper for the house model - mark as raw to exclude from reactivity
    const wrapper = markRaw(new THREE.Group());
    wrapper.name = "ModelRotationWrapper";
    modelRotationWrapper.value = wrapper;

    let houseModel: THREE.Object3D | undefined = undefined;

    // Find the specific objects we need
    loadedScene.traverse((child) => {
      console.log(`Object: ${child.name}, Type: ${child.type}`);

      if (child.name === "EmptyCameraRig") {
        pathMover.value = markRaw(child as THREE.Object3D);
      } else if (child.name === "EmptyLookAtTarget") {
        lookAtTarget.value = markRaw(child as THREE.Object3D);
      } else if (child.name === "Camera") {
        runtimeCamera.value = markRaw(child as THREE.PerspectiveCamera);
      } else if (child.name === "CameraCircle") {
        cameraCircle.value = markRaw(child as THREE.Object3D);
      } else if (child.name === "ok10b11291") {
        // Found the house mesh! (name might vary)
        houseModel = child as THREE.Object3D;
        console.log("Found house model:", child.name);
      }
    });

    // Wrap the house model for rotation
    if (houseModel && modelRotationWrapper.value) {
      const model = houseModel as THREE.Object3D;
      // Get the original parent
      const parent = model.parent;

      if (parent) {
        // Remove from original parent and add to wrapper
        parent.remove(model);
        modelRotationWrapper.value.add(model);

        // Add the wrapper back to the original parent
        parent.add(modelRotationWrapper.value);

        // Emit the rotation wrapper for external control
        emit("model-ready", modelRotationWrapper.value);
      }
    }

    // only now create the camera, when we actually have the rig
    if (pathMover.value && runtimeCamera.value) {
      // parent under rig so it follows the baked animation
      pathMover.value.add(runtimeCamera.value);

      // tell parent
      emit("camera-ready", runtimeCamera.value);

      // await one tick so Vue/Tres can mount scene first
      await nextTick();
    }

    // set up animation
    if (state.value?.animations?.length) {
      const _mixer = markRaw(new THREE.AnimationMixer(loadedScene));
      _mixer.timeScale = 0.1;
      console.log(state.value.animations);

      state.value.animations.forEach((clip) => {
        if (clip.name == "CircleMove.001") {
          _mixer.clipAction(clip).play();
        }
      });

      mixer.value = _mixer;
    }

    startLoop();
  },
  { immediate: true }
);

// Watch for canvas element to initialize listeners
watch(
  () => props.canvasElement,
  (canvas) => {
    if (canvas) {
      initializeListeners();
    }
  },
  { immediate: true }
);

function startLoop() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(loop);
}

const tempVec = markRaw(new THREE.Vector3());

function loop() {
  const delta = clock.getDelta();

  if (mixer.value) mixer.value.update(delta);

  // Apply smooth rotation to the model
  if (modelRotationWrapper.value) {
    // Smoothly interpolate current rotation to target rotation
    currentRotation.x += (targetRotation.x - currentRotation.x) * damping;
    currentRotation.y += (targetRotation.y - currentRotation.y) * damping;

    // Apply rotation to the wrapper
    modelRotationWrapper.value.rotation.x = currentRotation.x;
    modelRotationWrapper.value.rotation.y = currentRotation.y;
  }

  if (scene.value) scene.value.updateMatrixWorld(true);

  // Camera look-at logic
  if (runtimeCamera.value && lookAtTarget.value) {
    // get target's world position
    lookAtTarget.value.getWorldPosition(tempVec);
    // make the camera look at it (this sets camera's local rotation
    // relative to its parent, so it's fine that it's parented to the rig)
    runtimeCamera.value.lookAt(tempVec);
    runtimeCamera.value.updateMatrixWorld();
  }

  rafId = requestAnimationFrame(loop);
}

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (mixer.value) mixer.value.stopAllAction();
  cleanupListeners();
});
</script>

<template>
  <!-- draw gltf -->
  <primitive v-if="scene" :object="scene" />

  <primitive v-if="runtimeCamera" :object="runtimeCamera" attach="camera" />

  <TresAmbientLight :intensity="3" />
</template>
