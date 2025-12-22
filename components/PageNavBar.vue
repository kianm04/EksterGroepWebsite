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
    class="page-nav-bar"
    role="navigation"
    aria-label="Page navigation"
  >
    <div class="nav-container">
      <!-- Back button -->
      <button
        class="nav-button"
        :class="{ 'nav-button-disabled': isPrevDisabled }"
        :disabled="isPrevDisabled"
        :aria-disabled="isPrevDisabled"
        aria-label="Previous page"
        @click="goPrevious"
      >
        <svg
          class="nav-icon"
          width="20"
          height="20"
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
      <div class="page-dots" role="tablist" aria-label="Page indicators">
        <button
          v-for="(page, index) in pages"
          :key="page.id"
          class="page-dot"
          :class="{ 'page-dot-active': index === currentIndex }"
          :aria-selected="index === currentIndex"
          :aria-label="`Go to ${page.name}`"
          role="tab"
          :disabled="isTransitioning"
          @click="goToIndex(index)"
        />
      </div>

      <!-- Next button -->
      <button
        class="nav-button"
        :class="{ 'nav-button-disabled': isNextDisabled }"
        :disabled="isNextDisabled"
        :aria-disabled="isNextDisabled"
        aria-label="Next page"
        @click="goNext"
      >
        <svg
          class="nav-icon"
          width="20"
          height="20"
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

<style scoped>
.page-nav-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  -webkit-font-smoothing: antialiased;
}

.nav-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 50%;
  color: #374151;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.nav-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  border-color: #D1D5DB;
}

.nav-button:active:not(:disabled) {
  transform: scale(0.98);
}

.nav-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #9CA3AF, 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-button-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.nav-icon {
  flex-shrink: 0;
}

.page-dots {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
}

.page-dot {
  width: 8px;
  height: 8px;
  padding: 0;
  background: #D1D5DB;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.page-dot:hover:not(:disabled) {
  background: #9CA3AF;
  transform: scale(1.2);
}

.page-dot:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #9CA3AF;
}

.page-dot-active {
  background: #111827;
  transform: scale(1.25);
}

.page-dot-active:hover {
  background: #111827;
}

.page-dot:disabled {
  cursor: default;
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .page-nav-bar {
    bottom: 20px;
  }

  .nav-container {
    gap: 12px;
    padding: 10px 16px;
  }

  .nav-button {
    width: 36px;
    height: 36px;
  }

  .nav-icon {
    width: 18px;
    height: 18px;
  }

  .page-dots {
    gap: 6px;
    padding: 0 4px;
  }

  .page-dot {
    width: 6px;
    height: 6px;
  }
}
</style>
