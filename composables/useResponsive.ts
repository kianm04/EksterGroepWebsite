import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface ViewportDimensions {
  width: number
  height: number
  orientation: 'portrait' | 'landscape'
}

export interface ResponsiveBreakpoints {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLargeDesktop: boolean
}

/**
 * Responsive viewport detection composable
 * Provides reactive breakpoint detection and viewport information
 * SSR-safe implementation with debounced resize handling
 */
export function useResponsive() {
  // Viewport dimensions
  const viewport = ref<ViewportDimensions>({
    width: 1024, // Default to desktop for SSR
    height: 768,
    orientation: 'landscape'
  })

  // Breakpoint definitions (matching Tailwind defaults)
  const BREAKPOINTS = {
    mobile: 768,
    tablet: 1024,
    largeDesktop: 1536
  }

  // Reactive breakpoint states
  const isMobile = computed(() => viewport.value.width < BREAKPOINTS.mobile)
  const isTablet = computed(() =>
    viewport.value.width >= BREAKPOINTS.mobile &&
    viewport.value.width < BREAKPOINTS.tablet
  )
  const isDesktop = computed(() => viewport.value.width >= BREAKPOINTS.tablet)
  const isLargeDesktop = computed(() => viewport.value.width >= BREAKPOINTS.largeDesktop)

  // Touch device detection
  const isTouchDevice = ref(false)

  // Update viewport dimensions
  const updateViewport = () => {
    if (typeof window === 'undefined') return

    viewport.value = {
      width: window.innerWidth,
      height: window.innerHeight,
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
    }
  }

  // Debounced resize handler
  let resizeTimeout: ReturnType<typeof setTimeout> | null = null
  const handleResize = () => {
    if (resizeTimeout) clearTimeout(resizeTimeout)

    resizeTimeout = setTimeout(() => {
      updateViewport()
    }, 100) // 100ms debounce
  }

  // Lifecycle
  onMounted(() => {
    // Initial viewport update
    updateViewport()

    // Detect touch capability
    isTouchDevice.value = 'ontouchstart' in window ||
                          navigator.maxTouchPoints > 0

    // Add resize listener
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
  })

  onUnmounted(() => {
    if (resizeTimeout) clearTimeout(resizeTimeout)

    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  })

  return {
    // Viewport info
    viewport: computed(() => viewport.value),

    // Breakpoints
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,

    // Touch detection
    isTouchDevice,

    // Utility functions
    updateViewport,

    // Raw breakpoints for custom checks
    breakpoints: BREAKPOINTS
  }
}