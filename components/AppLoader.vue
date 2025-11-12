<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const { isLoading, loadingProgress } = useAppLoader()

// Local state for animations
const isVisible = ref(true) // Start visible to avoid hydration issues
const isExiting = ref(false)

// Computed properties for styling
const progressBarWidth = computed(() => `${loadingProgress.value}%`)

// Watch for loading complete to trigger exit animation
watch(isLoading, (newValue) => {
  if (!newValue) {
    isExiting.value = true
    setTimeout(() => {
      isVisible.value = false
      // Reset isExiting after animation completes to properly unmount
      setTimeout(() => {
        isExiting.value = false
      }, 100) // Small delay after visibility change
    }, 700) // Match exit animation duration
  }
})
</script>

<template>
  <Transition name="loader-fade">
    <div
      v-if="isLoading || isExiting"
      class="fixed inset-0 z-40 flex items-center justify-center overflow-hidden pointer-events-none"
      :class="{
        'opacity-0': !isVisible,
        'opacity-100': isVisible && !isExiting,
        'opacity-0 scale-95': isExiting
      }"
    >
      <!-- Clean white background -->
      <div class="absolute inset-0 bg-[#F7F9F7] transition-opacity duration-700"></div>

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
        <!-- Clean white card -->
        <div class="relative bg-white rounded-lg p-12 border border-gray-200"
             style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">

          <!-- Logo container -->
          <div class="flex justify-center mb-8">
            <div class="relative p-6 bg-white border border-gray-100 rounded-lg"
                 style="box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
              <!-- Logo image -->
              <img
                src="/images/loading-pagina-logo.png"
                alt="Ekster Logo"
                class="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-contain animate-float"
              />
            </div>
          </div>

          <!-- Loading bar container -->
          <div class="w-72 sm:w-80 lg:w-96 mx-auto">
            <!-- Loading bar track -->
            <div class="relative h-2 bg-gray-200 rounded-full overflow-hidden">
              <!-- Progress bar -->
              <div
                class="absolute left-0 top-0 h-full bg-gradient-to-r from-gray-600 to-gray-800 rounded-full transition-all duration-500 ease-out"
                :style="{ width: progressBarWidth }"
              >
                <!-- Shimmer effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer rounded-full"></div>
              </div>
            </div>

            <!-- Loading text and percentage -->
            <div class="mt-6 text-center">
              <p class="text-gray-900 text-sm sm:text-base font-medium tracking-wide">
                Loading 3D experience
              </p>
              <p class="text-gray-600 text-xs sm:text-sm mt-2 font-light tracking-wider">
                {{ loadingProgress }}%
              </p>
            </div>
          </div>

          <!-- Optional loading hints/tips -->
          <div class="mt-8 text-center" v-if="loadingProgress < 50">
            <p class="text-gray-500 text-xs tracking-wide animate-pulse">
              Preparing immersive visualization
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
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
.relative {
  will-change: transform;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Ensure crisp text rendering */
.text-gray-900,
.text-gray-600,
.text-gray-500 {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>