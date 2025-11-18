<script setup lang="ts">
import { computed, onUnmounted, onMounted, ref, shallowRef, watch, nextTick, markRaw } from "vue";
import * as THREE from "three";

const props = defineProps<{
  canvasElement?: HTMLCanvasElement | null;
}>();

const emit = defineEmits<{
  "camera-ready": [camera: THREE.PerspectiveCamera];
}>();

// Camera and target references
const runtimeCamera = shallowRef<THREE.PerspectiveCamera | null>(null);
const lookAtTarget = shallowRef<THREE.Object3D | null>(null);

// Spherical coordinate system for camera
const sphericalCoords = ref({
  radius: 45,
  theta: 0,
  phi: Math.PI / 3,
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

  // Create a default camera
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
  camera.position.set(30, 20, 30);
  runtimeCamera.value = markRaw(camera);

  // Create a default look-at target at origin
  const target = new THREE.Object3D();
  target.position.set(0, 0, 0);
  lookAtTarget.value = markRaw(target);

  // Initialize spherical coordinates based on default camera position
  sphericalCoords.value.radius = 45;
  sphericalCoords.value.theta = Math.atan2(30, 30);
  sphericalCoords.value.phi = Math.PI / 3;

  targetSpherical.theta = sphericalCoords.value.theta;
  targetSpherical.phi = sphericalCoords.value.phi;
  currentSpherical.theta = sphericalCoords.value.theta;
  currentSpherical.phi = sphericalCoords.value.phi;

  emit("camera-ready", runtimeCamera.value);
  await nextTick();

  // Start the render loop
  startLoop();
};

// Initialize camera system on mount
onMounted(() => {
  initializeCameraSystem();
});

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
  <!-- Just the camera, no model -->
  <primitive v-if="runtimeCamera" :object="runtimeCamera" attach="camera" />

  <TresAmbientLight :intensity="3" />
</template>