/**
 * Page Configuration Types
 *
 * Defines the structure for declarative page definitions in the
 * page-based navigation system.
 */

import type { Component } from 'vue';

/**
 * Camera configuration for a page view
 */
export interface PageCameraConfig {
  /** Target camera radius (distance from center) */
  radius: number;

  /** Target theta angle (horizontal orbit) in radians. Default: 0 */
  theta?: number;

  /** Target phi angle (vertical tilt) in radians. Default: Math.PI / 4 */
  phi?: number;

  /** Camera Y offset for different model heights. Default: 0 */
  yOffset?: number;
}

/**
 * Easing function types for transitions
 */
export type EasingType = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';

/**
 * Transition animation types
 */
export type TransitionType = 'zoom' | 'orbit' | 'pan' | 'instant';

/**
 * Transition configuration between pages
 */
export interface PageTransitionConfig {
  /** Duration of camera animation in milliseconds */
  duration: number;

  /** Easing function name */
  easing: EasingType;

  /** Whether to fade UI during transition */
  fadeUI: boolean;

  /** UI fade duration in milliseconds. Default: 200 */
  uiFadeDuration?: number;

  /** Transition animation type */
  type: TransitionType;
}

/**
 * Static content for simple pages
 */
export interface PageStaticContent {
  /** Page title/heading */
  title?: string;

  /** Subtitle or secondary heading */
  subtitle?: string;

  /** Main body text (can include multiple paragraphs) */
  body?: string | string[];

  /** Call-to-action button text */
  ctaText?: string;

  /** Call-to-action href (mailto:, tel:, or URL) */
  ctaHref?: string;
}

/**
 * Content position on screen
 */
export type ContentPosition = 'left' | 'right' | 'center' | 'fullscreen';

/**
 * Content slot configuration for a page
 */
export interface PageContentConfig {
  /** Content position on screen */
  position: ContentPosition;

  /** Vue component to render (dynamic import for code splitting) */
  component?: () => Promise<{ default: Component }>;

  /** Static content (for simple pages without custom component) */
  staticContent?: PageStaticContent;

  /** Whether content should be visible during camera transition */
  visibleDuringTransition?: boolean;
}

/**
 * SEO metadata for a page
 */
export interface PageMetaConfig {
  /** Page title for browser tab */
  title?: string;

  /** Meta description for search engines */
  description?: string;
}

/**
 * Complete page configuration
 */
export interface PageConfig {
  /** Unique page identifier (used in URLs and navigation) */
  id: string;

  /** Display name (for navigation UI) */
  name: string;

  /** Page order index (determines sequence) */
  order: number;

  /** Model ID to display on this page (null = no 3D model) */
  modelId: string | null;

  /** Camera settings for this page view */
  camera: PageCameraConfig;

  /** Transition settings when entering this page */
  transition: PageTransitionConfig;

  /** HTML content configuration */
  content: PageContentConfig;

  /** SEO metadata (optional) */
  meta?: PageMetaConfig;

  /** Whether this page is accessible via jump navigation. Default: true */
  navigable?: boolean;
}

/**
 * Navigation direction
 */
export type NavigationDirection = 'forward' | 'backward' | 'jump';

/**
 * Navigation state managed by usePageManager
 */
export interface NavigationState {
  /** Current page ID */
  currentPageId: string;

  /** Previous page ID (for back navigation context) */
  previousPageId: string | null;

  /** Whether a transition is in progress */
  isTransitioning: boolean;

  /** Transition progress (0-1) */
  transitionProgress: number;

  /** Direction of last navigation */
  direction: NavigationDirection;
}

/**
 * Helper type for page lookup functions
 */
export interface AdjacentPages {
  prev: PageConfig | null;
  next: PageConfig | null;
}
