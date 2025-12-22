/**
 * Camera Transition Composable
 *
 * Handles smooth camera animations between page views.
 * Uses spherical coordinate interpolation with configurable easing.
 */

import { ref, readonly, computed } from 'vue';
import type { PageCameraConfig, PageTransitionConfig } from '~/types/pages';
import { getEasingFunction, interpolate, interpolateAngle } from '~/utils/easing';

export interface CameraTransitionState {
  isAnimating: boolean;
  progress: number;
  startCoords: {
    radius: number;
    theta: number;
    phi: number;
    yOffset: number;
  };
  targetCoords: {
    radius: number;
    theta: number;
    phi: number;
    yOffset: number;
  };
}

export interface CameraTransitionCallbacks {
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
  onCancel?: () => void;
}

/**
 * Camera Transition Composable
 *
 * Provides methods to animate the camera between page configurations.
 */
export function useCameraTransition() {
  // Animation state
  const isAnimating = ref(false);
  const progress = ref(0);

  // Coordinate tracking
  const startCoords = ref({
    radius: 50,
    theta: 0,
    phi: Math.PI / 4,
    yOffset: 0,
  });

  const targetCoords = ref({
    radius: 50,
    theta: 0,
    phi: Math.PI / 4,
    yOffset: 0,
  });

  // Current interpolated values
  const currentCoords = ref({
    radius: 50,
    theta: 0,
    phi: Math.PI / 4,
    yOffset: 0,
  });

  // Animation frame ID for cancellation
  let animationFrameId: number | null = null;
  let animationStartTime: number | null = null;
  let currentDuration: number = 1000;
  let currentEasing: (t: number) => number = (t) => t;
  let currentCallbacks: CameraTransitionCallbacks = {};

  /**
   * Cancel any running animation
   */
  function cancelAnimation(): void {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    animationStartTime = null;

    if (isAnimating.value && currentCallbacks.onCancel) {
      currentCallbacks.onCancel();
    }

    isAnimating.value = false;
    progress.value = 0;
  }

  /**
   * Animation loop
   */
  function animationLoop(timestamp: number): void {
    if (!animationStartTime) {
      animationStartTime = timestamp;
    }

    const elapsed = timestamp - animationStartTime;
    const rawProgress = Math.min(elapsed / currentDuration, 1);
    const easedProgress = currentEasing(rawProgress);

    progress.value = rawProgress;

    // Interpolate coordinates
    currentCoords.value = {
      radius: interpolate(
        startCoords.value.radius,
        targetCoords.value.radius,
        easedProgress,
        'linear' // Easing already applied
      ),
      theta: interpolateAngle(
        startCoords.value.theta,
        targetCoords.value.theta,
        easedProgress,
        'linear'
      ),
      phi: interpolate(
        startCoords.value.phi,
        targetCoords.value.phi,
        easedProgress,
        'linear'
      ),
      yOffset: interpolate(
        startCoords.value.yOffset,
        targetCoords.value.yOffset,
        easedProgress,
        'linear'
      ),
    };

    // Notify progress
    if (currentCallbacks.onProgress) {
      currentCallbacks.onProgress(rawProgress);
    }

    // Check if animation is complete
    if (rawProgress >= 1) {
      isAnimating.value = false;
      animationFrameId = null;
      animationStartTime = null;

      if (currentCallbacks.onComplete) {
        currentCallbacks.onComplete();
      }
      return;
    }

    // Continue animation
    animationFrameId = requestAnimationFrame(animationLoop);
  }

  /**
   * Animate camera to new position
   *
   * @param target - Target camera configuration
   * @param config - Transition configuration
   * @param currentCamera - Current camera coordinates (for smooth continuation)
   * @param callbacks - Optional lifecycle callbacks
   */
  function animateTo(
    target: PageCameraConfig,
    config: PageTransitionConfig,
    currentCamera: { radius: number; theta: number; phi: number; yOffset?: number },
    callbacks?: CameraTransitionCallbacks
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cancel any existing animation
      cancelAnimation();

      // Handle instant transitions
      if (config.type === 'instant' || config.duration === 0) {
        currentCoords.value = {
          radius: target.radius,
          theta: target.theta ?? 0,
          phi: target.phi ?? Math.PI / 4,
          yOffset: target.yOffset ?? 0,
        };
        progress.value = 1;

        if (callbacks?.onProgress) {
          callbacks.onProgress(1);
        }
        if (callbacks?.onComplete) {
          callbacks.onComplete();
        }
        resolve();
        return;
      }

      // Store start coordinates
      startCoords.value = {
        radius: currentCamera.radius,
        theta: currentCamera.theta,
        phi: currentCamera.phi,
        yOffset: currentCamera.yOffset ?? 0,
      };

      // Store target coordinates
      targetCoords.value = {
        radius: target.radius,
        theta: target.theta ?? currentCamera.theta, // Keep current if not specified
        phi: target.phi ?? currentCamera.phi,
        yOffset: target.yOffset ?? 0,
      };

      // Store animation parameters
      currentDuration = config.duration;
      currentEasing = getEasingFunction(config.easing);
      currentCallbacks = {
        ...callbacks,
        onComplete: () => {
          if (callbacks?.onComplete) {
            callbacks.onComplete();
          }
          resolve();
        },
        onCancel: () => {
          if (callbacks?.onCancel) {
            callbacks.onCancel();
          }
          reject(new Error('Animation cancelled'));
        },
      };

      // Start animation
      isAnimating.value = true;
      progress.value = 0;
      animationFrameId = requestAnimationFrame(animationLoop);
    });
  }

  /**
   * Set coordinates immediately without animation
   */
  function setImmediate(coords: {
    radius: number;
    theta?: number;
    phi?: number;
    yOffset?: number;
  }): void {
    cancelAnimation();

    currentCoords.value = {
      radius: coords.radius,
      theta: coords.theta ?? currentCoords.value.theta,
      phi: coords.phi ?? currentCoords.value.phi,
      yOffset: coords.yOffset ?? 0,
    };

    startCoords.value = { ...currentCoords.value };
    targetCoords.value = { ...currentCoords.value };
    progress.value = 1;
  }

  /**
   * Get current transition state
   */
  const state = computed(
    (): CameraTransitionState => ({
      isAnimating: isAnimating.value,
      progress: progress.value,
      startCoords: { ...startCoords.value },
      targetCoords: { ...targetCoords.value },
    })
  );

  return {
    // State
    isAnimating: readonly(isAnimating),
    progress: readonly(progress),
    currentCoords: readonly(currentCoords),
    state,

    // Methods
    animateTo,
    cancelAnimation,
    setImmediate,
  };
}
