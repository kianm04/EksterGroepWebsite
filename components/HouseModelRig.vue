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

// Camera and target references
const runtimeCamera = shallowRef<THREE.PerspectiveCamera | null>(null);
const lookAtTarget = shallowRef<THREE.Object3D | null>(null);

// House model reference (no wrapper needed anymore)
const houseModel = shallowRef<THREE.Object3D | null>(null);

// Spherical coordinate system for camera
const sphericalCoords = ref({
  radius: 45, // Will be calculated from initial camera position
  theta: 0, // Horizontal angle (radians)
  phi: Math.PI / 3, // Vertical angle (60 degrees from horizontal)
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

// Mouse interaction state
const isInteracting = ref(false);
const previousMousePosition = { x: 0, y: 0 };

// Configuration
const sensitivity = 0.003; // Adjusted for smooth camera control
const damping = 0.08; // Smoother transitions for fluid movement

// Utility functions for spherical coordinates
const sphericalToCartesian = (radius: number, theta: number, phi: number): THREE.Vector3 => {
  // phi is angle from vertical axis (0 = top, π/2 = horizontal, π = bottom)
  // theta is horizontal rotation angle
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

const clampPhi = (phi: number): number => {
  // Clamp phi between 0 (directly above) and π/2 (ground level)
  return Math.max(0.05, Math.min(Math.PI / 2 - 0.05, phi));
};

// Mouse event handlers
const handleMouseDown = (event: MouseEvent) => {
  isInteracting.value = true;
  isAutoRotating.value = false; // Pause auto-rotation
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;

  // Add cursor style
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grabbing";
  }
};

const handleMouseUp = () => {
  isInteracting.value = false;
  setTimeout(() => {
    isAutoRotating.value = true; // Resume auto-rotation after delay
  }, 1000);
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

const handleMouseMove = (event: MouseEvent) => {
  if (!isInteracting.value) return;

  // Calculate mouse delta
  const deltaX = event.clientX - previousMousePosition.x;
  const deltaY = event.clientY - previousMousePosition.y;

  // Update spherical coordinates based on mouse movement
  targetSpherical.theta -= deltaX * sensitivity; // Negative for natural rotation
  targetSpherical.phi += deltaY * sensitivity;

  // Clamp vertical angle
  targetSpherical.phi = clampPhi(targetSpherical.phi);

  // Update previous mouse position
  previousMousePosition.x = event.clientX;
  previousMousePosition.y = event.clientY;
};

const handleMouseLeave = () => {
  isInteracting.value = false;
  setTimeout(() => {
    isAutoRotating.value = true; // Resume auto-rotation after delay
  }, 1000);
  if (props.canvasElement) {
    props.canvasElement.style.cursor = "grab";
  }
};

// Touch event handlers for mobile support
const handleTouchStart = (event: TouchEvent) => {
  if (event.touches.length !== 1) return;

  isInteracting.value = true;
  isAutoRotating.value = false; // Pause auto-rotation
  const touch = event.touches[0];
  if (!touch) return;

  previousMousePosition.x = touch.clientX;
  previousMousePosition.y = touch.clientY;
};

const handleTouchMove = (event: TouchEvent) => {
  if (!isInteracting.value || event.touches.length !== 1) return;

  event.preventDefault(); // Prevent scrolling
  const touch = event.touches[0];
  if (!touch) return;

  // Calculate touch delta
  const deltaX = touch.clientX - previousMousePosition.x;
  const deltaY = touch.clientY - previousMousePosition.y;

  // Update spherical coordinates
  targetSpherical.theta -= deltaX * sensitivity;
  targetSpherical.phi += deltaY * sensitivity;

  // Clamp vertical angle
  targetSpherical.phi = clampPhi(targetSpherical.phi);

  // Update previous position
  previousMousePosition.x = touch.clientX;
  previousMousePosition.y = touch.clientY;
};

const handleTouchEnd = () => {
  isInteracting.value = false;
  setTimeout(() => {
    isAutoRotating.value = true; // Resume auto-rotation after delay
  }, 1000);
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

    let foundHouseModel: THREE.Object3D | undefined = undefined;
    let foundCamera: THREE.PerspectiveCamera | undefined = undefined;

    // Find the specific objects we need
    loadedScene.traverse((child) => {
      console.log(`Object: ${child.name}, Type: ${child.type}`);

      if (child.name === "EmptyLookAtTarget") {
        lookAtTarget.value = markRaw(child as THREE.Object3D);
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

    // Set up the camera with new spherical positioning
    if (foundCamera && lookAtTarget.value) {
      const camera = foundCamera as THREE.PerspectiveCamera;
      runtimeCamera.value = markRaw(camera);

      // Calculate initial radius from camera's current position
      const targetPos = new THREE.Vector3();
      lookAtTarget.value.getWorldPosition(targetPos);
      const cameraPos = new THREE.Vector3();
      camera.getWorldPosition(cameraPos);

      // const distance = cameraPos.distanceTo(targetPos);
      // sphericalCoords.value.radius = distance > 0 ? distance : 15;

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

    // Start the render loop
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
    const cameraOffset = sphericalToCartesian(
      sphericalCoords.value.radius,
      currentSpherical.theta,
      currentSpherical.phi
    );

    // Set camera position relative to look-at target
    runtimeCamera.value.position.copy(targetWorldPos).add(cameraOffset);

    // Make camera look at the target
    runtimeCamera.value.lookAt(targetWorldPos);
    runtimeCamera.value.updateMatrixWorld();
  }

  if (scene.value) scene.value.updateMatrixWorld(true);

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
  <!-- draw gltf -->
  <primitive v-if="scene" :object="scene" />

  <primitive v-if="runtimeCamera" :object="runtimeCamera" attach="camera" />

  <TresAmbientLight :intensity="3" />
</template>
