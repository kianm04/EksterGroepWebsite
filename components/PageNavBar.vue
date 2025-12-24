<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { usePageManager } from '~/composables/usePageManager';

const {
  canGoNext,
  canGoPrevious,
  isTransitioning,
  currentIndex,
  totalPages,
  pages,
  goNext,
  goPrevious,
  goToIndex,
} = usePageManager();

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (isTransitioning.value) return;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      if (canGoNext.value) {
        event.preventDefault();
        goNext();
      }
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      if (canGoPrevious.value) {
        event.preventDefault();
        goPrevious();
      }
      break;
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// Button disabled state
const isPrevDisabled = computed(() => !canGoPrevious.value || isTransitioning.value);
const isNextDisabled = computed(() => !canGoNext.value || isTransitioning.value);
</script>

<template>
  <nav
    class="fixed bottom-6 max-md:bottom-5 left-1/2 -translate-x-1/2 z-50 antialiased"
    role="navigation"
    aria-label="Page navigation"
  >
    <div class="flex items-center gap-4 max-md:gap-3 py-3 max-md:py-2.5 px-5 max-md:px-4 bg-white border border-gray-200 rounded-full shadow-md">
      <!-- Back button -->
      <button
        class="flex items-center justify-center w-10 h-10 max-md:w-9 max-md:h-9 bg-white border border-gray-200 rounded-full text-gray-700 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:shadow-md hover:border-gray-300 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:border-gray-200"
        :disabled="isPrevDisabled"
        :aria-disabled="isPrevDisabled"
        aria-label="Previous page"
        @click="goPrevious"
      >
        <svg
          class="shrink-0 w-5 h-5 max-md:w-[18px] max-md:h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M15 18L9 12L15 6" />
        </svg>
      </button>

      <!-- Page indicator dots -->
      <div class="flex items-center gap-2 max-md:gap-1.5 px-2 max-md:px-1" role="tablist" aria-label="Page indicators">
        <button
          v-for="(page, index) in pages"
          :key="page.id"
          class="w-2 h-2 max-md:w-1.5 max-md:h-1.5 p-0 border-none rounded-full cursor-pointer transition-all duration-200 ease-out hover:bg-gray-400 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:cursor-default disabled:hover:scale-100"
          :class="index === currentIndex ? 'bg-gray-900 scale-125 hover:bg-gray-900' : 'bg-gray-300'"
          :aria-selected="index === currentIndex"
          :aria-label="`Go to ${page.name}`"
          role="tab"
          :disabled="isTransitioning"
          @click="goToIndex(index)"
        />
      </div>

      <!-- Next button -->
      <button
        class="flex items-center justify-center w-10 h-10 max-md:w-9 max-md:h-9 bg-white border border-gray-200 rounded-full text-gray-700 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:shadow-md hover:border-gray-300 active:scale-98 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:shadow-md disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:border-gray-200"
        :disabled="isNextDisabled"
        :aria-disabled="isNextDisabled"
        aria-label="Next page"
        @click="goNext"
      >
        <svg
          class="shrink-0 w-5 h-5 max-md:w-[18px] max-md:h-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 18L15 12L9 6" />
        </svg>
      </button>
    </div>
  </nav>
</template>
