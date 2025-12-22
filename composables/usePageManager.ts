/**
 * Page Manager Composable
 *
 * Central state machine for page-based navigation.
 * Manages current page, transitions, and navigation history.
 */

import { ref, computed, readonly } from 'vue';
import type {
  PageConfig,
  NavigationState,
  NavigationDirection,
} from '~/types/pages';
import {
  PAGES,
  getPageById,
  getAdjacentPages,
  getFirstPage,
  getPageCount,
} from '~/config/pages';

// Global state (shared across components)
const currentPageId = ref<string>('intro');
const previousPageId = ref<string | null>(null);
const isTransitioning = ref(false);
const transitionProgress = ref(0);
const navigationDirection = ref<NavigationDirection>('forward');

// Callbacks for transition lifecycle
type TransitionCallback = (
  fromPage: PageConfig | undefined,
  toPage: PageConfig | undefined,
  direction: NavigationDirection
) => void | Promise<void>;

let onTransitionStart: TransitionCallback | null = null;
let onTransitionEnd: TransitionCallback | null = null;

/**
 * Page Manager Composable
 *
 * Provides navigation state and methods for page-based transitions.
 */
export function usePageManager() {
  // Current page configuration
  const currentPage = computed(() => getPageById(currentPageId.value));

  // Previous page configuration
  const previousPage = computed(() =>
    previousPageId.value ? getPageById(previousPageId.value) : null
  );

  // Adjacent pages
  const adjacentPages = computed(() => getAdjacentPages(currentPageId.value));

  // Navigation state checks
  const canGoNext = computed(() => adjacentPages.value.next !== null);
  const canGoPrevious = computed(() => adjacentPages.value.prev !== null);

  // Current page index (0-based)
  const currentIndex = computed(() => currentPage.value?.order ?? 0);

  // Total page count
  const totalPages = computed(() => getPageCount());

  // All pages
  const pages = computed(() => PAGES);

  /**
   * Navigate to a specific page by ID
   */
  async function goToPage(
    pageId: string,
    direction: NavigationDirection = 'jump'
  ): Promise<boolean> {
    // Validate page exists
    const targetPage = getPageById(pageId);
    if (!targetPage) {
      console.warn(`[PageManager] Page not found: ${pageId}`);
      return false;
    }

    // Don't navigate to current page
    if (pageId === currentPageId.value) {
      return false;
    }

    // Don't allow navigation during transition
    if (isTransitioning.value) {
      console.warn('[PageManager] Navigation blocked: transition in progress');
      return false;
    }

    // Determine direction if not explicitly set
    if (direction === 'jump') {
      const currentOrder = currentPage.value?.order ?? 0;
      direction = targetPage.order > currentOrder ? 'forward' : 'backward';
    }

    // Start transition
    const fromPage = currentPage.value;
    isTransitioning.value = true;
    transitionProgress.value = 0;
    navigationDirection.value = direction;

    // Call transition start callback
    if (onTransitionStart) {
      await onTransitionStart(fromPage, targetPage, direction);
    }

    // Update page state
    previousPageId.value = currentPageId.value;
    currentPageId.value = pageId;

    return true;
  }

  /**
   * Navigate to next page
   */
  async function goNext(): Promise<boolean> {
    const nextPage = adjacentPages.value.next;
    if (!nextPage) {
      return false;
    }
    return goToPage(nextPage.id, 'forward');
  }

  /**
   * Navigate to previous page
   */
  async function goPrevious(): Promise<boolean> {
    const prevPage = adjacentPages.value.prev;
    if (!prevPage) {
      return false;
    }
    return goToPage(prevPage.id, 'backward');
  }

  /**
   * Navigate to page by index
   */
  async function goToIndex(index: number): Promise<boolean> {
    const page = PAGES.find((p) => p.order === index);
    if (!page) {
      return false;
    }
    return goToPage(page.id, 'jump');
  }

  /**
   * Navigate to first page
   */
  async function goToFirst(): Promise<boolean> {
    const firstPage = getFirstPage();
    if (!firstPage) {
      return false;
    }
    return goToPage(firstPage.id, 'backward');
  }

  /**
   * Update transition progress (called by camera transition)
   */
  function setTransitionProgress(progress: number): void {
    transitionProgress.value = Math.max(0, Math.min(1, progress));
  }

  /**
   * Complete the current transition
   */
  async function completeTransition(): Promise<void> {
    if (!isTransitioning.value) {
      return;
    }

    transitionProgress.value = 1;

    // Call transition end callback
    if (onTransitionEnd) {
      await onTransitionEnd(
        previousPage.value ?? undefined,
        currentPage.value,
        navigationDirection.value
      );
    }

    isTransitioning.value = false;
  }

  /**
   * Cancel the current transition and revert to previous page
   */
  function cancelTransition(): void {
    if (!isTransitioning.value || !previousPageId.value) {
      return;
    }

    // Revert to previous page
    currentPageId.value = previousPageId.value;
    previousPageId.value = null;
    isTransitioning.value = false;
    transitionProgress.value = 0;
  }

  /**
   * Register transition lifecycle callbacks
   */
  function setTransitionCallbacks(callbacks: {
    onStart?: TransitionCallback;
    onEnd?: TransitionCallback;
  }): void {
    if (callbacks.onStart) {
      onTransitionStart = callbacks.onStart;
    }
    if (callbacks.onEnd) {
      onTransitionEnd = callbacks.onEnd;
    }
  }

  /**
   * Get navigation state as a readonly object
   */
  const navigationState = computed(
    (): NavigationState => ({
      currentPageId: currentPageId.value,
      previousPageId: previousPageId.value,
      isTransitioning: isTransitioning.value,
      transitionProgress: transitionProgress.value,
      direction: navigationDirection.value,
    })
  );

  return {
    // State (readonly)
    currentPageId: readonly(currentPageId),
    previousPageId: readonly(previousPageId),
    isTransitioning: readonly(isTransitioning),
    transitionProgress: readonly(transitionProgress),
    navigationDirection: readonly(navigationDirection),
    navigationState,

    // Computed
    currentPage,
    previousPage,
    adjacentPages,
    canGoNext,
    canGoPrevious,
    currentIndex,
    totalPages,
    pages,

    // Methods
    goToPage,
    goNext,
    goPrevious,
    goToIndex,
    goToFirst,
    setTransitionProgress,
    completeTransition,
    cancelTransition,
    setTransitionCallbacks,
  };
}
