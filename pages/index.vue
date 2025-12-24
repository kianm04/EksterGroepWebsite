<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { TresCanvas } from "@tresjs/core";
import HouseModelRig from "~/components/HouseModelRig.vue";
import PageNavBar from "~/components/PageNavBar.vue";
import PageContent from "~/components/PageContent.vue";
import Navigation from "~/components/Navigation.vue";
import { usePageManager } from "~/composables/usePageManager";
import { useCameraTransition } from "~/composables/useCameraTransition";
import { getModelById } from "~/config/models";

// Page navigation state
const {
  currentPage,
  previousPage,
  isTransitioning,
  transitionProgress,
  setTransitionProgress,
  completeTransition,
  setTransitionCallbacks,
} = usePageManager();

// Camera transition system
const cameraTransition = useCameraTransition();

// 3D scene state
const activeCamera = ref<THREE.PerspectiveCamera | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);
const modelLoaded = ref(false);

// Current model path based on page configuration
const currentModelPath = computed(() => {
  const modelId = currentPage.value?.modelId;
  if (!modelId) return null;
  const model = getModelById(modelId);
  return model?.path ?? null;
});

// Current camera Y offset (page config takes priority, then model config)
const currentCameraYOffset = computed(() => {
  // First check page camera config
  if (currentPage.value?.camera.yOffset !== undefined) {
    return currentPage.value.camera.yOffset;
  }
  // Fall back to model config
  const modelId = currentPage.value?.modelId;
  if (!modelId) return 0;
  const model = getModelById(modelId);
  return model?.camera?.yOffset ?? 0;
});

// Content position for layout direction
const isContentRight = computed(() => {
  return currentPage.value?.content.position === "right";
});

// Camera radius from transition system (or current page default)
const cameraRadius = computed(() => {
  if (cameraTransition.isAnimating.value) {
    return cameraTransition.currentCoords.value.radius;
  }
  return currentPage.value?.camera.radius ?? 50;
});

// Current theta from transition
const cameraTheta = computed(() => {
  if (cameraTransition.isAnimating.value) {
    return cameraTransition.currentCoords.value.theta;
  }
  return currentPage.value?.camera.theta ?? 0;
});

// Current phi from transition
const cameraPhi = computed(() => {
  if (cameraTransition.isAnimating.value) {
    return cameraTransition.currentCoords.value.phi;
  }
  return currentPage.value?.camera.phi ?? Math.PI / 4;
});

// Set up transition callbacks
setTransitionCallbacks({
  onStart: async (fromPage, toPage) => {
    if (!toPage) return;

    // Get current camera coordinates for smooth transition
    const startCoords = {
      radius: fromPage?.camera.radius ?? 50,
      theta: fromPage?.camera.theta ?? 0,
      phi: fromPage?.camera.phi ?? Math.PI / 4,
      yOffset: 0,
    };

    // If we're mid-animation, use current animated position
    if (cameraTransition.isAnimating.value) {
      Object.assign(startCoords, cameraTransition.currentCoords.value);
    }

    // Start camera animation
    await cameraTransition.animateTo(
      toPage.camera,
      toPage.transition,
      startCoords,
      {
        onProgress: (progress) => {
          setTransitionProgress(progress);
        },
        onComplete: () => {
          completeTransition();
        },
      }
    );
  },
});

// Camera ready handler
const onCameraReady = (camera: THREE.PerspectiveCamera) => {
  activeCamera.value = camera;

  // Initialize camera to current page position if first load
  if (currentPage.value && !cameraTransition.isAnimating.value) {
    cameraTransition.setImmediate({
      radius: currentPage.value.camera.radius,
      theta: currentPage.value.camera.theta,
      phi: currentPage.value.camera.phi,
    });
  }
};

// Model loading handlers
const onLoadingStarted = () => {
  console.log("[Index] Loading started");
};

const onLoadingProgress = (progress: number) => {
  console.log(`[Index] Loading progress: ${progress}%`);
};

const onLoadingComplete = () => {
  console.log("[Index] Loading complete!");
  modelLoaded.value = true;
};

// Find canvas element once TresCanvas mounts
onMounted(() => {
  const findCanvas = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvasElement.value = canvas as HTMLCanvasElement;
    }
  };

  // Wait for TresCanvas to create the canvas
  setTimeout(findCanvas, 100);
});
</script>

<template>
  <div class="grid grid-rows-[auto_1fr] h-screen bg-[#f7f9f7] overflow-hidden">
    <!-- Navigation header -->
    <Navigation />

    <!-- Main content area -->
    <main
      class="grid min-h-0 overflow-hidden max-md:grid-cols-1 max-md:grid-rows-[auto_1fr]"
      :class="isContentRight ? 'grid-cols-[1fr_420px] md:max-lg:grid-cols-[1fr_340px] 2xl:grid-cols-[1fr_480px]' : 'grid-cols-[420px_1fr] md:max-lg:grid-cols-[340px_1fr] 2xl:grid-cols-[480px_1fr]'"
    >
      <!-- Page content panel -->
      <PageContent
        :page="currentPage"
        :is-transitioning="isTransitioning"
        :transition-progress="transitionProgress"
        :class="{ 'order-2': isContentRight, 'max-md:order-1': true }"
      />

      <!-- 3D Canvas -->
      <div
        class="canvas-container overflow-hidden bg-[#f7f9f7] max-md:min-h-[300px]"
        :class="{ 'order-1': isContentRight, 'max-md:order-2': true }"
      >
        <TresCanvas
          v-if="currentModelPath"
          clear-color="#F7F9F7"
          :camera="activeCamera || undefined"
          class="w-full h-full"
        >
          <HouseModelRig
            :canvas-element="canvasElement"
            :load-model="true"
            :model-path="currentModelPath"
            :target-radius="cameraRadius"
            :target-theta="cameraTheta"
            :target-phi="cameraPhi"
            :camera-y-offset="currentCameraYOffset"
            :is-transitioning="isTransitioning"
            @camera-ready="onCameraReady"
            @model-ready="(model: THREE.Object3D) => console.log('[Index] Model ready:', model)"
            @loading-started="onLoadingStarted"
            @loading-progress="onLoadingProgress"
            @loading-complete="onLoadingComplete"
          />
        </TresCanvas>

        <!-- Placeholder when no model -->
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center text-gray-400 text-base"
        >
          <p>No 3D model for this page</p>
        </div>
      </div>
    </main>

    <!-- Bottom navigation bar (floating) -->
    <PageNavBar />
  </div>
</template>

<style scoped>
/* Position TresCanvas to fill the grid cell */
.canvas-container {
  position: relative;
}

.canvas-container > :deep(div),
.canvas-container > :deep(canvas) {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 100% !important;
  height: 100% !important;
  outline: none;
  border: none;
}
</style>
