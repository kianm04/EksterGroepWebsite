<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useParallaxScroll } from '~/composables/useParallaxScroll'

interface Props {
  height?: string // CSS height value (e.g., '40vh', '300px')
  parallaxFactor?: number // How much slower the viewport scrolls
  showControls?: boolean // Show expand/collapse controls
  zIndex?: number // Z-index for layering
}

const props = withDefaults(defineProps<Props>(), {
  height: '40vh',
  parallaxFactor: 0.6,
  showControls: true,
  zIndex: 30
})

const emit = defineEmits<{
  'expand': []
  'collapse': []
}>()

// State
const isExpanded = ref(false)
const containerRef = ref<HTMLDivElement>()

// Use parallax scroll composable
const { parallaxTransform, scrollProgress, isInView } = useParallaxScroll({
  parallaxFactor: props.parallaxFactor,
  startOffset: 80, // Account for navigation height
  clampRange: true,
  smoothing: 0.15
})

// Computed styles
const containerStyles = computed(() => ({
  height: isExpanded.value ? '100vh' : props.height,
  transform: !isExpanded.value ? parallaxTransform.value : 'none',
  zIndex: props.zIndex,
  transition: 'height 0.3s ease-out'
}))

// Viewport visibility for performance
const shouldRender3D = computed(() => {
  // Always render when expanded, otherwise check visibility
  return isExpanded.value || isInView.value
})

// Toggle expanded state
const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    emit('expand')
    // Prevent body scroll when expanded
    document.body.style.overflow = 'hidden'
  } else {
    emit('collapse')
    document.body.style.overflow = ''
  }
}

// Clean up on unmount
onMounted(() => {
  return () => {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="mobile-viewport-container"
    :style="containerStyles"
  >
    <!-- 3D Canvas Slot -->
    <div class="canvas-wrapper" v-if="shouldRender3D">
      <slot />
    </div>

    <!-- Loading placeholder when not rendering -->
    <div v-else class="loading-placeholder">
      <div class="animate-pulse bg-gray-100 w-full h-full rounded-lg" />
    </div>

    <!-- Controls overlay -->
    <div v-if="showControls" class="controls-overlay">
      <!-- Expand/Collapse button -->
      <button
        @click="toggleExpanded"
        class="expand-button"
        :aria-label="isExpanded ? 'Collapse 3D view' : 'Expand 3D view'"
      >
        <svg
          v-if="!isExpanded"
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
          />
        </svg>
        <svg
          v-else
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <!-- Scroll progress indicator -->
      <div
        v-if="!isExpanded"
        class="scroll-indicator"
      >
        <div
          class="scroll-progress"
          :style="{ width: `${scrollProgress * 100}%` }"
        />
      </div>

      <!-- Drag hint (shown briefly on mount) -->
      <div
        v-if="!isExpanded"
        class="drag-hint"
      >
        <span class="text-xs text-gray-500">Drag to rotate</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-viewport-container {
  position: fixed;
  top: 80px; /* Below navigation */
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px); /* 16px padding on each side */
  max-width: 600px; /* Max width for tablets */
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  will-change: transform, height;
  transition: height 0.3s ease-out, box-shadow 0.2s ease;
}

.mobile-viewport-container:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.canvas-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  background: #F7F9F7; /* RAL9010 */
}

.loading-placeholder {
  width: 100%;
  height: 100%;
  padding: 16px;
}

.controls-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.expand-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.expand-button:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.expand-button:active {
  transform: scale(0.98);
}

.scroll-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(0, 0, 0, 0.05);
  pointer-events: none;
}

.scroll-progress {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.1s ease-out;
}

.drag-hint {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 4px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  pointer-events: none;
  animation: fade-in-out 3s ease-out forwards;
}

@keyframes fade-in-out {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(10px);
  }
  20% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  80% {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
}

/* Tablet adjustments */
@media (min-width: 768px) and (max-width: 1023px) {
  .mobile-viewport-container {
    width: calc(100% - 48px);
  }
}
</style>