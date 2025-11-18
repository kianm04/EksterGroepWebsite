<script setup lang="ts">
import { computed, onUnmounted, onMounted, ref, shallowRef, watch, nextTick, markRaw } from "vue";
import * as THREE from "three";
import { useGLTF } from "@tresjs/cientos";
import WhiteCubePlaceholder from "./WhiteCubePlaceholder.vue";

const props = defineProps<{
  canvasElement?: HTMLCanvasElement | null;
  loadModel?: boolean;
  scrollControlledRadius?: number | null;
}>();

const emit = defineEmits<{
  "camera-ready": [camera: THREE.PerspectiveCamera];
  "model-ready": [model: THREE.Object3D];
  "loading-started": [];
  "loading-progress": [progress: number];
  "loading-complete": [];
}>();

// Always load the GLTF model (Vue 3 Composition API requirement)
// The model will start downloading after a delay
const { state, progress } = useGLTF("/models/ok12b_circle_rig.glb", {
  draco: true
});

// Track loading state
const isModelLoading = ref(false);
const hasEmittedComplete = ref(false);

// House model reference (only used when loading model)
const houseModel = shallowRef<THREE.Object3D | null>(null);

// Fade transition state
const cubeOpacity = ref(1);
const modelOpacity = ref(0);
const showHouseModel = computed(() => props.loadModel && hasEmittedComplete.value);

// Camera and target references
const runtimeCamera = shallowRef<THREE.PerspectiveCamera | null>(null);
const lookAtTarget = shallowRef<THREE.Object3D | null>(null);

// Spherical coordinate system for camera
const baseRadius = 45;
const sphericalCoords = ref({
  radius: baseRadius,
  theta: 0,
  phi: Math.PI / 3,
});

// Computed effective radius (uses scroll control if provided, otherwise base)
const effectiveRadius = computed(() => {
  return props.scrollControlledRadius ?? sphericalCoords.value.radius;
});

// Check if scroll is controlling the camera
const isScrollControlled = computed(() => {
  return props.scrollControlledRadius !== null && props.scrollControlledRadius !== undefined;
});

// Target and current spherical coords for smooth transitions
const targetSpherical = { theta: 0, phi: Math.PI / 3 };
const currentSpherical = { theta: 0, phi: Math.PI / 3 };

// Auto-rotation state
const isAutoRotating = ref(true);
const autoRotationSpeed = (2 * Math.PI) / 90; // Full rotation in 90 seconds

// Animation loop
const clock = markRaw(new THREE.Clock());
let rafId: number | null = null;

// Track if scene is already initialized
let sceneInitialized = false;

// Computed property for the GLTF scene
const scene = computed(() => state.value?.scene ?? null);

// Watch progress for loading updates (always fire events)
watch(progress, (newProgress) => {
  console.log("[HouseModelRig] Progress:", newProgress);

  if (newProgress > 0 && !isModelLoading.value) {
    console.log("[HouseModelRig] Starting load");
    isModelLoading.value = true;
    emit("loading-started");
  }

  if (newProgress > 0 && newProgress < 1) {
    const percentage = Math.round(newProgress * 100);
    console.log(`[HouseModelRig] Progress: ${percentage}%`);
    emit("loading-progress", percentage);
  }
});

// Watch for scene to be loaded (always emit complete event)
watch(
  scene,
  (loadedScene) => {
    console.log(
      "[HouseModelRig] Scene changed:",
      loadedScene ? "loaded" : "null"
    );

    if (loadedScene && !hasEmittedComplete.value) {
      console.log(
        "[HouseModelRig] Scene is loaded! Emitting loading-complete event"
      );
      hasEmittedComplete.value = true;
      isModelLoading.value = false;
      emit("loading-complete");
    }
  },
  { immediate: true }
);

// Watch for transition between cube and house model
watch(showHouseModel, (shouldShow) => {
  if (shouldShow) {
    // Start fade transition - using simple animation approach
    const fadeInterval = setInterval(() => {
      cubeOpacity.value = Math.max(0, cubeOpacity.value - 0.05);
      modelOpacity.value = Math.min(1, modelOpacity.value + 0.05);

      if (cubeOpacity.value <= 0 && modelOpacity.value >= 1) {
        clearInterval(fadeInterval);
      }
    }, 16); // ~60fps
  }
});

// Mouse interaction state
const isInteracting = ref(false);
const previousMousePosition = { x: 0, y: 0 };

// Configuration
const sensitivity = 0.003;
const damping = 0.08;

// Utility functions for spherical coordinates
const sphericalToCartesian = (radius: number, theta: number, phi: number): THREE.Vector3 => {
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const clampPhi = (phi: number): number => {
  return Math.max(0.05, Math.min(Math.PI / 2 - 0.05, phi));
};

// Mouse event handlers
const handleMouseDown = (event: MouseEvent) => {
  isInteracting.value = true;
  isAutoRotating.value = false;
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;

  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grabbing";
  }
};

const handleMouseUp = () => {
  isInteracting.value = false;
  setTimeout(() => {
    isAutoRotating.value = true;
  }, 1000);
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isInteracting.value) return;

  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  targetSpherical.theta -= deltaX * sensitivity;
  targetSpherical.phi += deltaY * sensitivity;

  targetSpherical.phi = clampPhi(targetSpherical.phi);

  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
};

const handleMouseLeave = () => {
  isInteracting.value = false;
  setTimeout(() => {
    isAutoRotating.value = true;
  }, 1000);
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

// Touch event handlers for mobile support
const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1) return;

  isInteracting.value = true;
  isAutoRotating.value = false;
  const touch = event.touches[0];
  if (!touch) return;

  previousMousePosition.x = touch.clientX;
  previousMousePosition.y = touch.clientY;
};

const handleTouchMove = (event: TouchEvent) => {
  if (!isInteracting.value || event.touches.length !== 1) return;

  event.preventDefault();
  const touch = event.touches[0];
  if (!touch) return;

  const deltaX = touch.clientX - previousMousePosition.x;
  const deltaY = touch.clientY - previousMousePosition.y;

  targetSpherical.theta -= deltaX * sensitivity;
  targetSpherical.phi += deltaY * sensitivity;

  targetSpherical.phi = clampPhi(targetSpherical.phi);

  previousMousePosition.x = touch.clientX;
  previousMousePosition.y = touch.clientY;
};

const handleTouchEnd = () => {
  isInteracting.value = false;
  setTimeout(() => {
    isAutoRotating.value = true;
  }, 1000);
};

// Initialize event listeners
const initializeListeners = () => {
  if (!props.canvasElement) return;

  const canvas = props.canvasElement;
  canvas.style.cursor = "grab";

  canvas.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mouseup", handleMouseUp);
  window.addEventListener("mousemove", handleMouseMove);
  canvas.addEventListener("mouseleave", handleMouseLeave);

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

// Initialize camera system immediately when component mounts
const initializeCameraSystem = async () => {
  if (sceneInitialized) return;
  sceneInitialized = true;

  // If we're not loading a model, or model isn't ready yet, create default camera
  if (!props.loadModel || !runtimeCamera.value) {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(30, 20, 30);
    runtimeCamera.value = markRaw(camera);

    // Create a default look-at target at origin
    const target = new THREE.Object3D();
    target.position.set(0, 0, 0);
    lookAtTarget.value = markRaw(target);

    // Initialize spherical coordinates based on default camera position
    sphericalCoords.value.radius = baseRadius;
    sphericalCoords.value.theta = Math.atan2(30, 30);
    sphericalCoords.value.phi = Math.PI / 3;

    targetSpherical.theta = sphericalCoords.value.theta;
    targetSpherical.phi = sphericalCoords.value.phi;
    currentSpherical.theta = sphericalCoords.value.theta;
    currentSpherical.phi = sphericalCoords.value.phi;

    emit("camera-ready", runtimeCamera.value);
    await nextTick();
  }

  // Start the render loop
  startLoop();
};

// Function to process the loaded scene
const processScene = async (loadedScene: THREE.Object3D) => {
  let foundHouseModel: THREE.Object3D | undefined = undefined;
  let foundCamera: THREE.PerspectiveCamera | undefined = undefined;
  let foundLookAtTarget: THREE.Object3D | undefined = undefined;

  // Find the specific objects we need
  loadedScene.traverse((child) => {
    console.log(`Object: ${child.name}, Type: ${child.type}`);

    if (child.name === "EmptyLookAtTarget") {
      foundLookAtTarget = child as THREE.Object3D;
    } else if (child.name === "Camera") {
      foundCamera = child as THREE.PerspectiveCamera;
    } else if (child.name === "ok10b11291") {
      // Found the house mesh!
      foundHouseModel = child as THREE.Object3D;
      console.log("Found house model:", child.name);
    }
  });

  // Store the house model reference
  if (foundHouseModel) {
    houseModel.value = markRaw(foundHouseModel);
    emit("model-ready", foundHouseModel);
  }

  // Update look-at target if found in scene
  if (foundLookAtTarget) {
    lookAtTarget.value = markRaw(foundLookAtTarget);
  }

  // Set up the camera with new spherical positioning
  if (foundCamera && lookAtTarget.value) {
    const camera = foundCamera as THREE.PerspectiveCamera;
    runtimeCamera.value = markRaw(camera);

    // Calculate initial radius from camera's current position
    const targetPos = new THREE.Vector3();
    lookAtTarget.value.getWorldPosition(targetPos);
    const cameraPos = new THREE.Vector3();
    camera.getWorldPosition(cameraPos);

    // Calculate initial spherical angles from camera position
    const offset = cameraPos.clone().sub(targetPos);
    sphericalCoords.value.theta = Math.atan2(offset.z, offset.x);

    // Safely calculate phi with fallback
    const yRatio = offset.y / sphericalCoords.value.radius;
    const clampedRatio = Math.max(-1, Math.min(1, yRatio)); // Clamp to valid acos range
    sphericalCoords.value.phi = Math.acos(clampedRatio);

    // Initialize target and current to match
    targetSpherical.theta = sphericalCoords.value.theta;
    targetSpherical.phi = sphericalCoords.value.phi;
    currentSpherical.theta = sphericalCoords.value.theta;
    currentSpherical.phi = sphericalCoords.value.phi;

    // Remove camera from any parent (no longer attached to rig)
    if (camera.parent) {
      camera.parent.remove(camera);
    }

    // Add camera directly to the scene
    loadedScene.add(camera);

    // Emit camera ready
    emit("camera-ready", runtimeCamera.value);

    // await one tick so Vue/Tres can mount scene first
    await nextTick();
  }
};

// Watch for scene changes to extract camera and model from GLTF
watch(
  scene,
  async (loadedScene) => {
    if (!loadedScene) return;

    // Don't process the scene until user initiates load
    if (!props.loadModel) return;

    await processScene(loadedScene);
  },
  { immediate: true }
);

// Initialize camera system on mount
onMounted(() => {
  initializeCameraSystem();
});

// Watch for loadModel prop changes to process scene when user initiates load
watch(
  () => props.loadModel,
  (shouldLoad) => {
    if (shouldLoad && scene.value) {
      // Re-trigger scene processing when user initiates load
      processScene(scene.value);
    }
  }
);

// Watch for canvas element to initialize listeners (only if not scroll-controlled)
watch(
  () => props.canvasElement,
  (canvas) => {
    if (canvas && !isScrollControlled.value) {
      initializeListeners();
    }
  },
  { immediate: true }
);

// Watch for scroll control state changes to enable/disable mouse controls
watch(
  isScrollControlled,
  (scrollControlled) => {
    if (scrollControlled) {
      // Scroll is taking control, disable mouse/touch
      cleanupListeners();
      isAutoRotating.value = false;
    } else if (props.canvasElement) {
      // Scroll released control, re-enable mouse/touch
      initializeListeners();
      isAutoRotating.value = true;
    }
  }
);

function startLoop() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(loop);
}

const targetWorldPos = markRaw(new THREE.Vector3());

function loop() {
  const delta = clock.getDelta();

  // Handle auto-rotation
  if (isAutoRotating.value && !isInteracting.value) {
    targetSpherical.theta += autoRotationSpeed * delta;
  }

  // Smooth interpolation of spherical coordinates
  currentSpherical.theta += (targetSpherical.theta - currentSpherical.theta) * damping;
  currentSpherical.phi += (targetSpherical.phi - currentSpherical.phi) * damping;

  // Update camera position based on spherical coordinates
  if (runtimeCamera.value && lookAtTarget.value) {
    // Get look-at target world position
    lookAtTarget.value.getWorldPosition(targetWorldPos);

    // Calculate camera position from spherical coordinates
    // Use effectiveRadius to support scroll control
    const cameraOffset = sphericalToCartesian(
      effectiveRadius.value,
      currentSpherical.theta,
      currentSpherical.phi
    );

    // Set camera position relative to look-at target
    runtimeCamera.value.position.copy(targetWorldPos).add(cameraOffset);

    // Make camera look at the target
    runtimeCamera.value.lookAt(targetWorldPos);
    runtimeCamera.value.updateMatrixWorld();
  }

  rafId = requestAnimationFrame(loop);
}

onUnmounted(() => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  cleanupListeners();
});
</script>

<template>
  <!-- White cube placeholder with fade transition -->
  <WhiteCubePlaceholder
    v-if="cubeOpacity > 0"
    :opacity="cubeOpacity"
  />

  <!-- House model - only show when button clicked and model is loaded -->
  <primitive
    v-if="scene && showHouseModel"
    :object="scene"
  />

  <!-- Always render the camera -->
  <primitive v-if="runtimeCamera" :object="runtimeCamera" attach="camera" />

  <TresAmbientLight :intensity="3" />
</template>