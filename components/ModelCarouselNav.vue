<script setup lang="ts">
defineProps<{
  canGoNext: boolean
  canGoPrevious: boolean
  isLoading?: boolean
}>();

const emit = defineEmits<{
  next: []
  previous: []
}>();
</script>

<template>
  <div class="carousel-nav-container">
    <!-- Left arrow (previous) -->
    <button
      v-if="canGoPrevious"
      class="carousel-arrow carousel-arrow-left"
      :disabled="isLoading"
      aria-label="Previous model"
      @click="emit('previous')"
    >
      <svg
        width="24"
        height="24"
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

    <!-- Right arrow (next) -->
    <button
      v-if="canGoNext"
      class="carousel-arrow carousel-arrow-right"
      :disabled="isLoading"
      aria-label="Next model"
      @click="emit('next')"
    >
      <svg
        width="24"
        height="24"
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

    <!-- Loading indicator -->
    <div v-if="isLoading" class="carousel-loading">
      <div class="carousel-loading-spinner"></div>
      <span>Laden...</span>
    </div>
  </div>
</template>

<style scoped>
.carousel-nav-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  background: #FFFFFF;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 200ms ease-out;
  -webkit-font-smoothing: antialiased;
}

.carousel-arrow:hover:not(:disabled) {
  transform: translateY(-50%) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #D1D5DB;
}

.carousel-arrow:active:not(:disabled) {
  transform: translateY(-50%) scale(0.98);
}

.carousel-arrow:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px #9CA3AF, 0 2px 8px rgba(0, 0, 0, 0.1);
}

.carousel-arrow:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-arrow-left {
  left: 24px;
}

.carousel-arrow-right {
  right: 24px;
}

/* Loading indicator */
.carousel-loading {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid #E5E7EB;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 12px;
  font-weight: 500;
  color: #6B7280;
  pointer-events: auto;
}

.carousel-loading-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid #E5E7EB;
  border-top-color: #374151;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Mobile adjustments */
@media (max-width: 767px) {
  .carousel-arrow {
    width: 40px;
    height: 40px;
  }

  .carousel-arrow-left {
    left: 12px;
  }

  .carousel-arrow-right {
    right: 12px;
  }

  .carousel-arrow svg {
    width: 20px;
    height: 20px;
  }

  .carousel-loading {
    bottom: 80px; /* Above mobile model selector */
  }
}
</style>
