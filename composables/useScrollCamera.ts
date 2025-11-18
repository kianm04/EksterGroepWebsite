import { ref, computed, onMounted, onUnmounted } from "vue";

export interface ScrollCameraConfig {
  startRadius?: number;
  endRadius?: number;
  scrollDebounceMs?: number;
}

/**
 * Composable for managing scroll-based camera control
 * Tracks scroll position and converts it to camera parameters
 */
export function useScrollCamera(config: ScrollCameraConfig = {}) {
  const {
    startRadius = 45,
    endRadius = 20,
    scrollDebounceMs = 150,
  } = config;

  // Scroll state
  const scrollProgress = ref(0); // Normalized 0-1 (linear)
  const isScrolling = ref(false);

  // Debounce timer for detecting when scroll ends
  let scrollEndTimer: NodeJS.Timeout | null = null;

  // RAF throttle for scroll events
  let rafPending = false;

  /**
   * Quadratic easing function (ease-in-out)
   * Provides smooth acceleration and deceleration
   */
  const easeInOutQuad = (t: number): number => {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  };

  /**
   * Eased scroll progress with quadratic interpolation
   */
  const easedScrollProgress = computed(() => {
    return easeInOutQuad(scrollProgress.value);
  });

  /**
   * Calculate camera radius based on eased scroll progress
   * Interpolates between start and end radius with quadratic easing
   */
  const cameraRadius = computed(() => {
    return startRadius - (easedScrollProgress.value * (startRadius - endRadius));
  });

  /**
   * Get current scroll position as percentage (0-1)
   * Accounts for total scrollable height
   */
  const updateScrollProgress = () => {
    if (typeof window === "undefined") return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // Calculate how much of the page has been scrolled
    const maxScroll = scrollHeight - clientHeight;

    if (maxScroll <= 0) {
      scrollProgress.value = 0;
      return;
    }

    // Normalize to 0-1 range
    const progress = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    scrollProgress.value = progress;
  };

  /**
   * Throttled scroll handler using requestAnimationFrame
   * Ensures smooth 60fps performance
   */
  const handleScroll = () => {
    if (rafPending) return;

    rafPending = true;
    requestAnimationFrame(() => {
      updateScrollProgress();
      rafPending = false;
    });

    // Mark as actively scrolling
    isScrolling.value = true;

    // Clear existing timer
    if (scrollEndTimer) {
      clearTimeout(scrollEndTimer);
    }

    // Set debounce timer to detect when scrolling ends
    scrollEndTimer = setTimeout(() => {
      isScrolling.value = false;
    }, scrollDebounceMs);
  };

  /**
   * Initialize scroll listeners
   */
  const initScrollListeners = () => {
    if (typeof window === "undefined") return;

    // Initial calculation
    updateScrollProgress();

    // Add scroll listener with passive flag for performance
    window.addEventListener("scroll", handleScroll, { passive: true });
  };

  /**
   * Clean up scroll listeners
   */
  const cleanupScrollListeners = () => {
    if (typeof window === "undefined") return;

    window.removeEventListener("scroll", handleScroll);

    if (scrollEndTimer) {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = null;
    }
  };

  // Lifecycle hooks
  onMounted(() => {
    initScrollListeners();
  });

  onUnmounted(() => {
    cleanupScrollListeners();
  });

  return {
    scrollProgress,
    easedScrollProgress,
    cameraRadius,
    isScrolling,
    // Expose methods for manual control if needed
    updateScrollProgress,
  };
}
