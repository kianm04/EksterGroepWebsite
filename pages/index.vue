<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from "vue";
import * as THREE from "three";
import { TresCanvas } from "@tresjs/core";
import HouseModelRig from "~/components/HouseModelRig.vue";
import ModelCarouselNav from "~/components/ModelCarouselNav.vue";
import Navigation from "~/components/Navigation.vue";
import { useScrollCamera } from "~/composables/useScrollCamera";
import { useResponsive } from "~/composables/useResponsive";
import { useModelCarousel } from "~/composables/useModelCarousel";

// Use responsive composable
const { isMobile, isTablet, isDesktop } = useResponsive();

// Use model carousel composable
const {
  currentModel,
  currentIndex,
  canGoNext,
  canGoPrevious,
  goNext,
  goPrevious,
  isLoading,
  setLoading,
  markModelLoaded,
} = useModelCarousel({ autoLoadFirst: true });

const activeCamera = ref<THREE.PerspectiveCamera | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);

// Model loading state
const modelLoaded = ref(false);

// Scroll-based camera control (enabled for both desktop and mobile)
// Use computed values so radius updates reactively when viewport changes
// Scale radius based on viewport height for better mobile fitting

// Reactive viewport height tracking
const viewportHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 844);

const getResponsiveRadius = (baseRadius: number) => {
  if (typeof window === 'undefined') return baseRadius;

  // Reference viewport height (design baseline)
  const referenceHeight = 844; // iPhone 14 Pro height
  const currentHeight = viewportHeight.value;

  // Scale factor: smaller screens need larger radius to fit model
  const scaleFactor = Math.max(0.6, Math.min(1.4, referenceHeight / currentHeight)) ;

  return baseRadius * scaleFactor;
};

const mobileStartRadius = computed(() => {
  const baseRadius = isMobile.value ? 50 : 45;
  return isMobile.value ? getResponsiveRadius(baseRadius) : baseRadius;
});

const mobileEndRadius = computed(() => {
  const baseRadius = isMobile.value ? 22 : 20;
  return isMobile.value ? getResponsiveRadius(baseRadius) : baseRadius;
});

const { scrollProgress, easedScrollProgress, cameraRadius, isScrolling } = useScrollCamera({
  startRadius: mobileStartRadius,
  endRadius: mobileEndRadius,
  scrollDebounceMs: 100,  // Quick detection of scroll end for snappy rotation resume
  enabled: true  // Always enabled (was: computed(() => !isMobile.value))
});

// Fade transitions based on eased scroll progress (quadratic)
// Section 1: visible at 0%, fades out by 50%
const section1Opacity = computed(() => {
  return Math.max(0, 1 - (easedScrollProgress.value * 2));
});

// Section 2: starts fading in at 50%, fully visible at 100%
const section2Opacity = computed(() => {
  return Math.max(0, Math.min(1, (easedScrollProgress.value - 0.5) * 2));
});

// Dynamic overlap for Section 2 sliding over 3D model (mobile only)
// Uses viewport-relative sizing for cross-device compatibility
// Goal: Keep 3D model center visible by having Section 2 cover bottom half of 3D viewport
const section2OverlapPx = computed(() => {
  if (!isMobile.value) return 0;

  // Max overlap is 30% of viewport height (half of 60vh 3D section)
  // This ensures the 3D model center stays centered between page top and Section 2
  const maxOverlapVh = 0.30;
  const maxOverlapPx = viewportHeight.value * maxOverlapVh;

  // Overlap increases as user scrolls (tied to eased scroll progress)
  return Math.round(easedScrollProgress.value * maxOverlapPx);
});

// Dynamic canvas vertical offset for mobile - keeps house visible throughout scroll
// At page top: positioned higher (-75%) so house is visible
// When scrolled: positioned lower (-45%) so house center stays visible with overlap
const mobileCanvasTranslateY = computed(() => {
  if (!isMobile.value) return 75; // Default for desktop (won't be used)

  const startOffset = 75; // At scroll start: house visible at top
  const endOffset = 45;   // At scroll end: house centered for overlap

  // Interpolate based on scroll progress
  return startOffset - (easedScrollProgress.value * (startOffset - endOffset));
});

const onCameraReady = (camera: THREE.PerspectiveCamera) => {
  activeCamera.value = camera;
};

const onLoadingStarted = () => {
  console.log("[Index] Loading started");
  setLoading(true);
};

const onLoadingProgress = (progress: number) => {
  console.log(`[Index] Loading progress: ${progress}%`);
  setLoading(true, progress);
};

const onLoadingComplete = () => {
  console.log("[Index] Loading complete!");
  setLoading(false);
  modelLoaded.value = true;

  // Mark current model as loaded in carousel
  if (currentModel.value) {
    markModelLoaded(currentModel.value.id);
  }
};

// Set up canvas reference
onMounted(() => {
  console.log("[Index] Initial model:", currentModel.value?.name);

  // Find canvas element once TresCanvas is mounted
  const findCanvas = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvasElement.value = canvas as HTMLCanvasElement;
    }
  };

  // Wait a bit for TresCanvas to create the canvas
  setTimeout(findCanvas, 100);

  // Track viewport height changes for responsive camera scaling
  const handleResize = () => {
    viewportHeight.value = window.innerHeight;
  };

  window.addEventListener('resize', handleResize);

  // Cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });
});
</script>

<template>
  <div class="bg-[#F7F9F7]" :class="{ 'snap-y snap-mandatory': !isMobile }">
    <Navigation />

    <!-- Desktop Layout -->
    <div v-if="!isMobile" class="relative lg:grid lg:grid-cols-2 pt-16 lg:pt-20">
      <!-- Left column - Stacked content sections -->
      <div>
        <!-- Section 1: Original content -->
        <div
          class="snap-start min-h-screen flex items-center justify-center px-6 lg:px-12 transition-opacity duration-700"
          :style="{ opacity: section1Opacity }"
        >
          <div class="max-w-xl space-y-8 lg:space-y-12">
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

        <!-- Section 2: Lorem ipsum content -->
        <div
          class="snap-start min-h-screen flex items-center justify-center px-6 lg:px-12 transition-opacity duration-700"
          :style="{ opacity: section2Opacity }"
        >
          <div class="max-w-xl space-y-8 lg:space-y-12">
            <div class="space-y-4 lg:space-y-6 text-gray-700 leading-relaxed">
              <h2 class="text-2xl lg:text-3xl font-light text-gray-900">
                Discover Our Craftsmanship
              </h2>

              <p class="text-base lg:text-lg font-light leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>

              <p class="text-sm lg:text-base leading-relaxed">
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur.
              </p>

              <p class="text-sm lg:text-base leading-relaxed">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                officia deserunt mollit anim id est laborum. Sed ut perspiciatis
                unde omnis iste natus error sit voluptatem accusantium doloremque
                laudantium.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right column - 3D Model (sticky on desktop, normal on mobile) -->
      <div
        class="relative h-screen lg:sticky lg:top-0 flex flex-col snap-start"
      >
        <!-- 3D Canvas -->
        <div class="flex-1 relative">
          <TresCanvas
            clear-color="#F7F9F7"
            :camera="activeCamera || undefined"
            class="w-full h-full"
          >
            <!-- HouseModelRig with dynamic model path -->
            <HouseModelRig
              :key="currentModel?.id"
              :canvas-element="canvasElement"
              :load-model="true"
              :model-path="currentModel?.path"
              :scroll-controlled-radius="cameraRadius"
              :is-scrolling-active="isScrolling"
              @camera-ready="onCameraReady"
              @model-ready="
                (model: THREE.Object3D) => console.log('[Index] Model ready:', model)
              "
              @loading-started="onLoadingStarted"
              @loading-progress="onLoadingProgress"
              @loading-complete="onLoadingComplete"
            />
          </TresCanvas>

          <!-- Model carousel navigation arrows -->
          <ModelCarouselNav
            :can-go-next="canGoNext"
            :can-go-previous="canGoPrevious"
            :is-loading="isLoading"
            @next="goNext"
            @previous="goPrevious"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Layout: Vertical stack with text on top, 3D model below -->
    <div v-else class="relative pt-12 bg-[#F7F9F7]">
      <!-- Hero Section: Text Card -->
      <div class="px-3 pt-4 pb-4">
        <div class="mobile-text-card">
          <!-- Content section -->
          <div class="space-y-4 text-gray-700">
            <p class="text-base font-light leading-7">
              De Ekstergroep doet beheer, exploitatie, renovatie en verbetering
              van zowel monumentaal als gewoon vastgoed.
            </p>

            <p class="text-sm leading-6">
              Wij leggen de focus op esthetiek, waarbij degelijkheid en
              levensduur als vereisten worden meegenomen.
            </p>

            <p class="text-sm leading-6">
              We werken samen als team en pakken jaarlijks een aantal
              totalrenovaties op. Daarin begeleiden we de client van begin tot
              eind.
            </p>
          </div>

          <!-- Call to action -->
          <div class="pt-5 mt-5 border-t border-gray-200">
            <p class="text-sm leading-6 text-gray-700 mb-4">
              Bent u op zoek naar een mooi team om uw woning naar de 21ste eeuw
              te brengen?
            </p>
            <a
              href="mailto:info@ekstergroep.nl"
              class="flex items-center justify-center w-full px-5 py-3.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-all duration-200 text-sm"
              style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15)"
            >
              info@ekstergroep.nl
            </a>
          </div>
        </div>
      </div>

      <!-- 3D Model Section - extended height for overlap, overflow-hidden clips top -->
      <div class="relative h-[90vh] overflow-hidden bg-[#F7F9F7] z-0">
        <!-- 3D Canvas - dynamic position based on scroll for house visibility -->
        <div
          class="absolute left-0 right-0 top-[40%]"
          :style="{ transform: `translateY(-${mobileCanvasTranslateY}%)`, height: '100vh' }"
        >
          <TresCanvas
            clear-color="#F7F9F7"
            :camera="activeCamera || undefined"
            class="w-full h-full"
          >
            <HouseModelRig
              :key="currentModel?.id"
              :canvas-element="canvasElement"
              :load-model="true"
              :model-path="currentModel?.path"
              :scroll-controlled-radius="cameraRadius"
              :is-scrolling-active="isScrolling"
              responsive-mode="mobile"
              @camera-ready="onCameraReady"
              @model-ready="(model: THREE.Object3D) => console.log('[Index] Model ready:', model)"
              @loading-started="onLoadingStarted"
              @loading-progress="onLoadingProgress"
              @loading-complete="onLoadingComplete"
            />
          </TresCanvas>
        </div>

        <!-- Model carousel navigation arrows -->
        <ModelCarouselNav
          :can-go-next="canGoNext"
          :can-go-previous="canGoPrevious"
          :is-loading="isLoading"
          @next="goNext"
          @previous="goPrevious"
        />

        <!-- Top gradient fade -->
        <div class="mobile-model-gradient-top"></div>

        <!-- Bottom gradient fade -->
        <div class="mobile-model-gradient-bottom"></div>

        <!-- Side gradient fades -->
        <div class="mobile-model-gradient-left"></div>
        <div class="mobile-model-gradient-right"></div>
      </div>

      <!-- Section 2: Additional content - slides over 3D model -->
      <div
        class="px-3 pb-8 relative z-10"
        :style="{ marginTop: `-${section2OverlapPx}px` }"
      >
        <div class="mobile-text-card">
          <h2 class="text-xl font-light text-gray-900 mb-4">
            Discover Our Craftsmanship
          </h2>

          <div class="space-y-4 text-gray-700">
            <p class="text-base font-light leading-7">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <p class="text-sm leading-6">
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>

            <p class="text-sm leading-6">
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
              officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </div>

      <!-- Fixed scroll indicator at bottom center -->
      <div
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        :style="{ opacity: section1Opacity }"
      >
        <div class="mobile-scroll-indicator">
          <span>Scroll to explore</span>
          <div class="flex space-x-1 ml-2">
            <div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse"></div>
            <div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
            <div class="w-1 h-1 bg-gray-500 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Mobile text card - clean architectural style */
.mobile-text-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

/* Scroll indicator pill */
.mobile-scroll-indicator {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6b7280;
  transition: opacity 0.3s ease-out;
}

/* Gradient masks for 3D model section */
.mobile-model-gradient-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(to bottom, #F7F9F7 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

.mobile-model-gradient-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to top, #F7F9F7 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

.mobile-model-gradient-left {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40px;
  background: linear-gradient(to right, #F7F9F7 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

.mobile-model-gradient-right {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 40px;
  background: linear-gradient(to left, #F7F9F7 0%, transparent 100%);
  z-index: 10;
  pointer-events: none;
}

/* Ensure smooth transitions for opacity changes */
[style*="opacity"] {
  will-change: opacity;
}
</style>
