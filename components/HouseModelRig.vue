<script setup lang="ts">
import { computed, onUnmounted, onMounted, ref, shallowRef, watch, nextTick, markRaw } from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import WhiteCubePlaceholder from "./WhiteCubePlaceholder.vue";
import { useCameraControls } from "~/composables/useCameraControls";
import { useModelCache } from "~/composables/useModelCache";

const props = withDefaults(defineProps<{
  canvasElement?: HTMLCanvasElement | null;
  loadModel?: boolean;
  modelPath?: string;
  scrollControlledRadius?: number | null;
  isScrollingActive?: boolean;
  responsiveMode?: 'desktop' | 'mobile';
  cameraYOffset?: number;
}>(), {
  modelPath: '/models/ok10b_circle.glb',
  cameraYOffset: 0
});

const emit = defineEmits<{
  "camera-ready": [camera: THREE.PerspectiveCamera];
  "model-ready": [model: THREE.Object3D];
  "loading-started": [];
  "loading-progress": [progress: number];
  "loading-complete": [];
}>();

// Model cache for instant switching
const { getCachedModel, setCachedModel, isModelCached } = useModelCache();

// Current scene being displayed
const currentScene = shallowRef<THREE.Group | null>(null);

// Loading state
const isLoadingModel = ref(false);
const hasLoadedFirstModel = ref(false);

// House model reference (only used when loading model)
const houseModel = shallowRef<THREE.Object3D | null>(null);

// Fade transition state
const cubeOpacity = ref(1);
const modelOpacity = ref(0);
const showHouseModel = computed(() => props.loadModel && hasLoadedFirstModel.value);

// GLTF loader instances (created once, reused)
let gltfLoader: GLTFLoader | null = null;
let dracoLoader: DRACOLoader | null = null;

const getLoader = (): GLTFLoader => {
  if (!gltfLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/libs/draco/');
    gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);
  }
  return gltfLoader;
};

/**
 * Load a model from path, using cache if available
 * NOTE: Does NOT set currentScene - caller must do that after processing
 */
const loadModel = async (path: string): Promise<THREE.Group | null> => {
  // Check cache first for instant switching
  if (isModelCached(path)) {
    console.log(`[HouseModelRig] Using cached model: ${path}`);
    const cachedScene = getCachedModel(path);
    if (cachedScene) {
      return cachedScene;
    }
  }

  // Load new model
  console.log(`[HouseModelRig] Loading model: ${path}`);
  isLoadingModel.value = true;
  emit("loading-started");

  try {
    const loader = getLoader();
    const gltf = await loader.loadAsync(path);
    const scene = gltf.scene;

    // Cache the loaded scene (but don't display yet)
    setCachedModel(path, scene);

    console.log(`[HouseModelRig] Model loaded and cached: ${path}`);
    isLoadingModel.value = false;
    emit("loading-complete");

    return scene;
  } catch (error) {
    console.error(`[HouseModelRig] Failed to load model: ${path}`, error);
    isLoadingModel.value = false;
    return null;
  }
};

// Use the shared camera controls composable
const {
  runtimeCamera,
  lookAtTarget,
  sphericalCoords,
  isInteracting,
  initializeFromCamera,
  updateCameraReference,
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

// Watch for modelPath changes to load/switch models
watch(
  () => props.modelPath,
  async (newPath, oldPath) => {
    if (!newPath) return;

    // Skip if same path and we already have a scene
    if (newPath === oldPath && currentScene.value) return;

    console.log(`[HouseModelRig] Model path changed: ${oldPath} -> ${newPath}`);

    // Load the model (from cache or network) - does NOT display yet
    const scene = await loadModel(newPath);

    if (scene && props.loadModel) {
      // Always process scene to ensure camera references are correct
      // This is fast (just traverses scene) and ensures proper camera setup
      await processScene(scene);

      // Display the scene after camera is properly set up
      currentScene.value = scene;
      hasLoadedFirstModel.value = true;
      console.log(`[HouseModelRig] Scene displayed: ${newPath}`);
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
    } else if (child.type === "Mesh" && !foundHouseModel) {
      // Use the first mesh found as the house model
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

    // First load: initialize camera angles from scene
    // Model switch: preserve current viewing angles for smooth transition
    if (!hasLoadedFirstModel.value) {
      initializeFromCamera(camera, target);
    } else {
      updateCameraReference(camera, target);
    }

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

// Initialize camera system on mount
onMounted(() => {
  initializeCameraSystem();
});

// Watch for loadModel prop changes to process scene when user initiates load
watch(
  () => props.loadModel,
  async (shouldLoad) => {
    if (shouldLoad && currentScene.value) {
      // Re-trigger scene processing when user initiates load
      await processScene(currentScene.value);
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
  // Update camera position with mobile phi adjustment and model-specific Y offset
  updateCameraPosition(effectiveRadius.value, undefined, mobilePhiAdjustment.value, props.cameraYOffset);

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
  <!-- Key forces primitive remount when model changes, ensuring proper scene graph update -->
  <primitive
    v-if="currentScene && showHouseModel"
    :key="props.modelPath"
    :object="currentScene"
  />

  <!-- Always render the camera - key ensures proper update when model changes -->
  <primitive v-if="runtimeCamera" :key="`camera-${props.modelPath}`" :object="runtimeCamera" attach="camera" />

  <TresAmbientLight :intensity="3" />
</template>