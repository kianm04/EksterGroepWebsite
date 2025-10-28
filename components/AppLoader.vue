<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'

const { isLoading, loadingProgress } = useAppLoader()

// Local state for animations
const isVisible = ref(false)
const isExiting = ref(false)

// Computed properties for styling
const progressBarWidth = computed(() => `${loadingProgress.value}%`)

// Show loading animation after mount
onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 50)
})

// Watch for loading complete to trigger exit animation
watch(isLoading, (newValue) => {
  if (!newValue) {
    isExiting.value = true
    setTimeout(() => {
      isVisible.value = false
    }, 700) // Match exit animation duration
  }
})
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="isLoading || isExiting"
      class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
      :class="{
        'opacity-0': !isVisible,
        'opacity-100': isVisible && !isExiting,
        'opacity-0 scale-95': isExiting
      }"
    >
      <!-- Background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-cyan-bg via-cyan-bg to-cyan-dark transition-opacity duration-700"></div>

      <!-- Animated background particles/shapes (subtle) -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-20 left-20 w-96 h-96 bg-cyan-light/20 rounded-full blur-3xl animate-float"></div>
        <div class="absolute bottom-20 right-20 w-96 h-96 bg-cyan-dark/20 rounded-full blur-3xl animate-float" style="animation-delay: 1.5s;"></div>
      </div>

      <!-- Main content container -->
      <div
        class="relative z-10"
        :class="{
          'scale-90 opacity-0': !isVisible,
          'scale-100 opacity-100': isVisible && !isExiting,
          'scale-105 opacity-0': isExiting
        }"
        style="transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);"
      >
        <!-- Glassmorphic card -->
        <div class="relative backdrop-blur-lg bg-white/25 rounded-3xl p-12 shadow-2xl border border-white/30"
             style="box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.18) inset;">

          <!-- Logo container with float animation -->
          <div class="flex justify-center mb-8">
            <div class="relative group">
              <!-- Glow effect behind logo -->
              <div class="absolute inset-0 bg-cyan-light/30 rounded-full blur-2xl scale-110 group-hover:scale-125 transition-transform duration-700"></div>

              <!-- Logo image -->
              <img
                src="/images/loading-pagina-logo.png"
                alt="Ekster Logo"
                class="relative z-10 w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain animate-float drop-shadow-xl"
                style="filter: drop-shadow(0 10px 20px rgba(130, 219, 197, 0.3));"
              />
            </div>
          </div>

          <!-- Loading bar container -->
          <div class="w-72 sm:w-80 lg:w-96 mx-auto">
            <!-- Loading bar track -->
            <div class="relative h-2 bg-white/20 rounded-full overflow-hidden"
                 style="box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);">

              <!-- Progress bar -->
              <div
                class="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-light to-cyan-dark rounded-full transition-all duration-500 ease-out"
                :style="{ width: progressBarWidth }"
                style="box-shadow: 0 0 20px rgba(130, 219, 197, 0.6);"
              >
                <!-- Shimmer effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer rounded-full"></div>
              </div>

              <!-- Glow pulse on the progress edge -->
              <div
                class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white/80 rounded-full blur-md transition-all duration-500"
                :style="{ left: `calc(${progressBarWidth} - 8px)` }"
                v-if="loadingProgress > 0 && loadingProgress < 100"
              ></div>
            </div>

            <!-- Loading text and percentage -->
            <div class="mt-6 text-center">
              <p class="text-white/90 text-sm sm:text-base font-medium tracking-wide">
                Loading 3D experience
              </p>
              <p class="text-white/70 text-xs sm:text-sm mt-2 font-light tracking-wider">
                {{ loadingProgress }}%
              </p>
            </div>
          </div>

          <!-- Optional loading hints/tips (subtle) -->
          <div class="mt-8 text-center" v-if="loadingProgress < 50">
            <p class="text-white/50 text-xs tracking-wide animate-pulse">
              Preparing immersive visualization
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Shimmer animation */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}

/* Loader fade transition */
.loader-fade-enter-active,
.loader-fade-leave-active {
  transition: opacity 0.7s ease-out;
}

.loader-fade-enter-from,
.loader-fade-leave-to {
  opacity: 0;
}

/* GPU acceleration for smooth animations */
.backdrop-blur-lg {
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Ensure smooth rendering on mobile */
@media (max-width: 640px) {
  .backdrop-blur-lg {
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
}

/* High-performance shadow for better frame rates */
@supports (backdrop-filter: blur(12px)) {
  .backdrop-blur-lg {
    backdrop-filter: blur(12px) saturate(1.2);
    -webkit-backdrop-filter: blur(12px) saturate(1.2);
  }
}
</style>