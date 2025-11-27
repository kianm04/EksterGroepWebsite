<script setup lang="ts">
import { computed, onUnmounted, onMounted, ref, shallowRef, watch, nextTick, markRaw } from "vue";
import * as THREE from "three";
import { useGLTF } from "@tresjs/cientos";
import WhiteCubePlaceholder from "./WhiteCubePlaceholder.vue";
import { useCameraControls } from "~/composables/useCameraControls";

const props = defineProps<{
  canvasElement?: HTMLCanvasElement | null;
  loadModel?: boolean;
  scrollControlledRadius?: number | null;
  isScrollingActive?: boolean;
  responsiveMode?: 'desktop' | 'mobile'; // New prop for responsive behavior
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

// Use the shared camera controls composable
const {
  runtimeCamera,
  lookAtTarget,
  sphericalCoords,
  isInteracting,
  initializeFromCamera,
  createDefaultCamera,
  startInteraction,
  updateInteraction,
  endInteraction,
  updateCameraPosition,
  setAutoRotation
} = useCameraControls({
  baseRadius: 45,
  autoRotationSpeed: (2 * Math.PI) / 90,
  sensitivity: props.responsiveMode === 'mobile' ? 0.005 : 0.003, // Higher sensitivity for mobile
  damping: 0.08
});

// Computed effective radius (uses scroll control if provided, otherwise base)
const effectiveRadius = computed(() => {
  return props.scrollControlledRadius ?? sphericalCoords.value.radius;
});

// Mobile camera phi angle adjustment (vertical viewing angle)
// Lower phi = camera higher up looking more downward
// Higher phi = camera lower looking more upward
const mobilePhiAdjustment = computed(() => {
  if (props.responsiveMode !== 'mobile') return 0;

  // Calculate zoom progress based on radius (50 = zoomed out, 22 = zoomed in)
  const maxRadius = 50;
  const minRadius = 22;
  const currentRadius = props.scrollControlledRadius ?? maxRadius;

  // zoomProgress: 0 = zoomed out (start), 1 = zoomed in (scrolled down)
  const zoomProgress = 1 - (currentRadius - minRadius) / (maxRadius - minRadius);
  const clampedProgress = Math.max(0, Math.min(1, zoomProgress));

  // When zoomed OUT: Slight downward tilt for better framing
  // When zoomed IN: Slight phi increase (look slightly more level) → keeps roof visible
  const zoomedOutPhiAdjustment = -0.15; // Subtle downward angle when far
  const zoomedInPhiAdjustment = 0.1;    // Slight upward tilt when close

  // Interpolate between the two adjustments based on zoom progress
  return zoomedOutPhiAdjustment + (zoomedInPhiAdjustment - zoomedOutPhiAdjustment) * clampedProgress;
});

// Check if scroll is actively controlling the camera (user is currently scrolling)
const isScrollControlled = computed(() => {
  // On mobile, disable scroll control when in free drag mode
  if (props.responsiveMode === 'mobile') {
    return props.isScrollingActive ?? false;
  }
  return props.isScrollingActive ?? false;
});

// Animation loop
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

// Mouse event handlers using the composable
const handleMouseDown = (event: MouseEvent) => {
  startInteraction(event.clientX, event.clientY);
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grabbing";
  }
};

const handleMouseUp = () => {
  endInteraction();
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

const handleMouseMove = (event: MouseEvent) => {
  updateInteraction(event.clientX, event.clientY);
};

const handleMouseLeave = () => {
  endInteraction();
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

// Touch event handlers for mobile support
const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1) return;

  const touch = event.touches[0];
  if (!touch) return;

  startInteraction(touch.clientX, touch.clientY);
};

const handleTouchMove = (event: TouchEvent) => {
  if (!isInteracting.value || event.touches.length !== 1) return;

  event.preventDefault();
  const touch = event.touches[0];
  if (!touch) return;

  updateInteraction(touch.clientX, touch.clientY);
};

const handleTouchEnd = () => {
  endInteraction();
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
    const camera = createDefaultCamera();
    emit("camera-ready", camera);
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
  if (foundCamera && foundLookAtTarget) {
    const camera = foundCamera as THREE.PerspectiveCamera;
    const target = foundLookAtTarget as THREE.Object3D;

    // Initialize camera controls from the loaded camera
    initializeFromCamera(camera, target);

    // Remove camera from any parent (no longer attached to rig)
    if (camera.parent) {
      camera.parent.remove(camera);
    }

    // Add camera directly to the scene
    loadedScene.add(camera);

    // Emit camera ready
    emit("camera-ready", camera);

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

// Watch for scroll control state changes to pause/resume auto-rotation
watch(
  isScrollControlled,
  (scrollControlled) => {
    if (scrollControlled) {
      // Scroll is active, pause auto-rotation but keep listeners
      setAutoRotation(false);
    } else {
      // Scroll ended, immediately resume auto-rotation
      setAutoRotation(true);
      // Ensure listeners are initialized
      if (props.canvasElement) {
        initializeListeners();
      }
    }
  }
);

function startLoop() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(loop);
}

function loop() {
  // Update camera position with mobile phi adjustment for viewport angle
  updateCameraPosition(effectiveRadius.value, undefined, mobilePhiAdjustment.value);

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