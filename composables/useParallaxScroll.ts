import { ref, computed, onMounted, onUnmounted } from 'vue'

export interface ParallaxConfig {
  parallaxFactor?: number // How much slower the element moves (0.6 = 60% of scroll speed)
  startOffset?: number    // Initial offset in pixels
  clampRange?: boolean    // Prevent negative values
  smoothing?: number      // Smoothing factor for interpolation (0-1, higher = smoother)
}

/**
 * Parallax scroll composable for mobile floating viewport
 * Provides smooth parallax effect calculations with configurable speed
 * Direct sync with scroll position for camera mapping
 */
export function useParallaxScroll(config: ParallaxConfig = {}) {
  const {
    parallaxFactor = 0.6,  // Default 60% scroll speed for floating effect
    startOffset = 0,
    clampRange = true,
    smoothing = 0.1
  } = config

  // Scroll position tracking
  const scrollY = ref(0)
  const smoothScrollY = ref(0)
  const maxScroll = ref(0)

  // Parallax calculations
  const parallaxOffset = computed(() => {
    const offset = smoothScrollY.value * parallaxFactor + startOffset
    return clampRange ? Math.max(0, offset) : offset
  })

  // Transform string for direct CSS application
  const parallaxTransform = computed(() =>
    `translateY(${parallaxOffset.value}px)`
  )

  // Progress calculation (0-1) for direct camera sync
  const scrollProgress = computed(() => {
    if (maxScroll.value === 0) return 0
    return Math.min(1, Math.max(0, smoothScrollY.value / maxScroll.value))
  })

  // Viewport visibility detection
  const viewportY = ref(0)
  const viewportHeight = ref(0)
  const isInView = ref(true)

  // Update scroll position with RAF for smooth animation
  let rafId: number | null = null
  let lastScrollY = 0

  const updateScroll = () => {
    const currentScrollY = window.scrollY || window.pageYOffset

    // Smooth interpolation
    smoothScrollY.value += (currentScrollY - smoothScrollY.value) * smoothing

    // Update raw scroll
    scrollY.value = currentScrollY
    lastScrollY = currentScrollY

    // Update max scroll
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    maxScroll.value = documentHeight - windowHeight

    // Check if we're still scrolling
    if (Math.abs(currentScrollY - smoothScrollY.value) > 0.1) {
      rafId = requestAnimationFrame(updateScroll)
    } else {
      rafId = null
    }
  }

  // Handle scroll events
  const handleScroll = () => {
    if (!rafId) {
      rafId = requestAnimationFrame(updateScroll)
    }
  }

  // Update viewport position for visibility checks
  const updateViewportPosition = () => {
    if (typeof window === 'undefined') return

    viewportY.value = window.scrollY
    viewportHeight.value = window.innerHeight
  }

  // Check if element is in viewport (for disabling animations when not visible)
  const checkInView = (elementTop: number, elementHeight: number) => {
    const viewportBottom = viewportY.value + viewportHeight.value
    const elementBottom = elementTop + elementHeight

    return elementBottom > viewportY.value && elementTop < viewportBottom
  }

  // Reset scroll position (useful for navigation)
  const resetScroll = () => {
    scrollY.value = 0
    smoothScrollY.value = 0
  }

  // Lifecycle
  onMounted(() => {
    if (typeof window === 'undefined') return

    // Initial values
    updateScroll()
    updateViewportPosition()

    // Add listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateViewportPosition)
  })

  onUnmounted(() => {
    if (rafId) {
      cancelAnimationFrame(rafId)
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateViewportPosition)
    }
  })

  return {
    // Scroll values
    scrollY: computed(() => scrollY.value),
    smoothScrollY: computed(() => smoothScrollY.value),
    scrollProgress,

    // Parallax calculations
    parallaxOffset,
    parallaxTransform,

    // Viewport info
    viewportY: computed(() => viewportY.value),
    viewportHeight: computed(() => viewportHeight.value),
    isInView,

    // Utility functions
    checkInView,
    resetScroll,
    updateScroll
  }
}