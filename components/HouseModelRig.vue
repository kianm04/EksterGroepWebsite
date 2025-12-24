<script setup lang="ts">
import {
  computed,
  onUnmounted,
  onMounted,
  ref,
  shallowRef,
  watch,
  nextTick,
  markRaw,
} from "vue";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import WhiteCubePlaceholder from "./WhiteCubePlaceholder.vue";
import { useCameraControls } from "~/composables/useCameraControls";
import { useModelCache } from "~/composables/useModelCache";

const props = withDefaults(
  defineProps<{
    canvasElement?: HTMLCanvasElement | null;
    loadModel?: boolean;
    modelPath?: string;
    targetRadius?: number;
    targetTheta?: number;
    targetPhi?: number;
    cameraYOffset?: number;
    isTransitioning?: boolean;
  }>(),
  {
    modelPath: "/models/ok10b_circle.glb",
    targetRadius: 50,
    targetTheta: 0,
    targetPhi: Math.PI / 4,
    cameraYOffset: 0,
    isTransitioning: false,
  }
);

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
const showHouseModel = computed(
  () => props.loadModel && hasLoadedFirstModel.value
);

// GLTF loader instances (created once, reused)
let gltfLoader: GLTFLoader | null = null;
let dracoLoader: DRACOLoader | null = null;

const getLoader = (): GLTFLoader => {
  if (!gltfLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/libs/draco/");
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
      // Always process color space even for cached models
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
  setAutoRotation,
  setTargetCoordinates,
  setImmediateCoordinates,
} = useCameraControls({
  baseRadius: 50,
  autoRotationSpeed: (2 * Math.PI) / 90,
  sensitivity: 0.004,
  damping: 0.08,
});

// Watch for target coordinate changes and update camera controls
watch(
  () => [props.targetRadius, props.targetTheta, props.targetPhi],
  ([radius, theta, phi]) => {
    // During transitions, directly update coordinates for smooth animation
    if (props.isTransitioning) {
      setImmediateCoordinates({
        radius: radius as number,
        theta: theta as number,
        phi: phi as number,
      });
    } else {
      // When not transitioning, use target for smooth interpolation
      setTargetCoordinates({
        radius: radius as number,
        theta: theta as number,
        phi: phi as number,
      });
    }
  },
  { immediate: true }
);

// Disable auto-rotation during transitions
watch(
  () => props.isTransitioning,
  (transitioning) => {
    setAutoRotation(!transitioning);
  }
);

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

      // Hide the placeholder cube immediately when model is ready
      cubeOpacity.value = 0;

      console.log(`[HouseModelRig] Scene displayed: ${newPath}`);
    }
  },
  { immediate: true }
);

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

function loop() {
  // Update camera position with target radius and Y offset
  updateCameraPosition(
    props.targetRadius,
    undefined,
    undefined,
    props.cameraYOffset
  );

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
  <WhiteCubePlaceholder v-if="cubeOpacity > 0" :opacity="cubeOpacity" />

  <!-- House model - only show when button clicked and model is loaded -->
  <!-- Key forces primitive remount when model changes, ensuring proper scene graph update -->
  <primitive
    v-if="currentScene && showHouseModel"
    :key="props.modelPath"
    :object="currentScene"
  />

  <!-- Always render the camera - key ensures proper update when model changes -->
  <primitive
    v-if="runtimeCamera"
    :key="`camera-${props.modelPath}`"
    :object="runtimeCamera"
    attach="camera"
  />

  <!-- Lighting setup for proper PBR material rendering -->
  <TresAmbientLight :intensity="1" />
  <TresDirectionalLight
    :position="[10, 20, 15]"
    :intensity="2"
    :cast-shadow="false"
  />
  <TresDirectionalLight
    :position="[-10, 15, -10]"
    :intensity="1"
    :cast-shadow="false"
  />
</template>
