<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import * as THREE from "three";
import { TresCanvas } from "@tresjs/core";
import HouseModelRig from "~/components/HouseModelRig.vue";
import HouseModelRigLazy from "~/components/HouseModelRigLazy.vue";
import WhiteCubePlaceholder from "~/components/WhiteCubePlaceholder.vue";
import Navigation from "~/components/Navigation.vue";

const activeCamera = ref<THREE.PerspectiveCamera | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);

// Model loading state
const showModel = ref(false);
const isLoadingModel = ref(false);
const modelLoaded = ref(false);

// Check localStorage for cached state
const checkCachedModelState = () => {
  if (typeof window !== "undefined") {
    const cached = localStorage.getItem("ekster_model_loaded");
    if (cached === "true") {
      showModel.value = true;
      modelLoaded.value = true;
    }
  }
};

const onCameraReady = (camera: THREE.PerspectiveCamera) => {
  activeCamera.value = camera;
};

const onLoadingStarted = () => {
  console.log("[Index] Loading started");
  isLoadingModel.value = true;
};

const onLoadingProgress = (progress: number) => {
  // Could display progress if needed
  console.log(`[Index] Loading progress: ${progress}%`);
};

const onLoadingComplete = () => {
  console.log("[Index] Loading complete! Setting modelLoaded = true");
  isLoadingModel.value = false;
  modelLoaded.value = true;
  console.log("[Index] modelLoaded value:", modelLoaded.value);
  // Save to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("ekster_model_loaded", "true");
  }
};

const loadHouseModel = () => {
  if (!isLoadingModel.value && !modelLoaded.value) {
    showModel.value = true;
  }
};

// Watch for modelLoaded changes
watch(modelLoaded, (newValue) => {
  console.log("[Index] modelLoaded changed to:", newValue);
  console.log("[Index] Cube should now be:", newValue ? "hidden" : "visible");
});

// Set up canvas reference
onMounted(() => {
  // Check for cached model state
  checkCachedModelState();

  console.log(
    "[Index] Initial state - showModel:",
    showModel.value,
    "modelLoaded:",
    modelLoaded.value
  );

  // Find canvas element once TresCanvas is mounted
  const findCanvas = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvasElement.value = canvas as HTMLCanvasElement;
    }
  };

  // Wait a bit for TresCanvas to create the canvas
  setTimeout(findCanvas, 100);
});
</script>

<template>
  <div class="min-h-screen bg-[#F7F9F7]">
    <Navigation />

    <!-- Main content grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen pt-16 lg:pt-20">
      <!-- Left column - Content -->
      <div class="flex items-center justify-center">
        <div class="max-w-xl space-y-8 lg:space-y-12">
          <!-- Header section -->

          <!-- Content section -->
          <div class="space-y-4 lg:space-y-6 text-gray-700 leading-relaxed">
            <p class="text-base lg:text-lg font-light leading-relaxed">
              De Ekstergroep doet beheer, exploitatie, renovatie en verbetering
              van zowel monumentaal als gewoon vastgoed.
            </p>

            <p class="text-sm lg:text-base leading-relaxed">
              Wij leggen de focus op esthetiek, waarbij degelijkheid en
              levensduur als vereisten worden meegenomen.
            </p>

            <p class="text-sm lg:text-base leading-relaxed">
              We werken samen als team en pakken jaarlijks een aantal
              totalrenovaties op. Daarin begeleiden we de client van begin tot
              eind. Samen met de architect zetten we de dromen op papier, die we
              vervolgens door de constructeur laten doorrekenen. Na het
              uitgeebreid bespreken en plannen van de uit te voeren taken komt
              het team ten tonele en streven we er naar alles naar planning uit
              te voeren.
            </p>
          </div>

          <!-- Call to action -->
          <div class="space-y-3 lg:space-y-4 pt-4 lg:pt-6">
            <p class="text-sm lg:text-base leading-relaxed text-gray-700">
              Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw
              te brengen?
            </p>
            <div
              class="flex flex-col sm:inline-flex sm:flex-row sm:items-center sm:space-x-3 space-y-2 sm:space-y-0 group"
            >
              <span class="text-sm text-gray-600">Neem contact op via</span>
              <a
                href="mailto:info@ekstergroep.nl"
                class="inline-flex items-center px-3 lg:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium hover:border-gray-400 hover:shadow-md transition-all duration-200 hover:scale-102 text-sm"
                style="box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)"
              >
                info@ekstergroep.nl
              </a>
            </div>
          </div>

          <!-- Scroll indicator -->
          <div class="pt-6 lg:pt-8 border-t border-gray-200 relative">
            <div
              class="text-xs text-gray-500 tracking-wider uppercase font-medium flex items-center space-x-2"
            >
              <span>Start scrolling to explore</span>
              <div class="flex space-x-1">
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                ></div>
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                  style="animation-delay: 0.2s"
                ></div>
                <div
                  class="w-1 h-1 bg-gray-400 rounded-full animate-pulse"
                  style="animation-delay: 0.4s"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column - 3D Model -->
      <div
        class="relative h-96 sm:h-[500px] lg:h-auto lg:min-h-screen flex flex-col"
      >
        <!-- 3D Canvas -->
        <div class="flex-1 relative">
          <TresCanvas
            clear-color="#F7F9F7"
            :camera="activeCamera || undefined"
            class="w-full h-full"
          >
            <!-- Show white cube when model is not loaded -->
            <WhiteCubePlaceholder v-if="!modelLoaded" :visible="!modelLoaded" />

            <!-- Camera-only rig when no model loaded -->
            <HouseModelRig
              v-if="!showModel"
              :canvas-element="canvasElement"
              @camera-ready="onCameraReady"
            />

            <!-- House model with loading when requested -->
            <HouseModelRigLazy
              v-else
              :canvas-element="canvasElement"
              @camera-ready="onCameraReady"
              @loading-started="onLoadingStarted"
              @loading-progress="onLoadingProgress"
              @loading-complete="onLoadingComplete"
            />
          </TresCanvas>
        </div>

        <!-- Load button -->
        <div
          v-if="!modelLoaded"
          class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <button
            @click="loadHouseModel"
            :disabled="isLoadingModel"
            class="px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-102 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)"
          >
            <span v-if="!isLoadingModel" class="text-gray-900 font-medium"
              >Laad huis</span
            >
            <span v-else class="flex items-center gap-2 text-gray-600">
              <svg
                class="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Laden...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
