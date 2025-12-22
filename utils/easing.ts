/**
 * Easing Functions for Animations
 *
 * Standard easing functions for smooth camera transitions.
 * All functions take a progress value (0-1) and return an eased value (0-1).
 */

import type { EasingType } from '~/types/pages';

/**
 * Linear easing - constant speed
 */
export function linear(t: number): number {
  return t;
}

/**
 * Ease in - starts slow, accelerates
 * Uses quadratic curve (t^2)
 */
export function easeIn(t: number): number {
  return t * t;
}

/**
 * Ease out - starts fast, decelerates
 * Uses inverse quadratic curve
 */
export function easeOut(t: number): number {
  return 1 - (1 - t) * (1 - t);
}

/**
 * Ease in-out - slow start, fast middle, slow end
 * Combines ease-in for first half and ease-out for second half
 */
export function easeInOut(t: number): number {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

/**
 * Ease in cubic - more pronounced slow start
 */
export function easeInCubic(t: number): number {
  return t * t * t;
}

/**
 * Ease out cubic - more pronounced slow end
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease in-out cubic - smoother version of easeInOut
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Map of easing function names to implementations
 */
export const easingFunctions: Record<EasingType, (t: number) => number> = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
};

/**
 * Get an easing function by name
 * Falls back to easeInOut if the name is not found
 */
export function getEasingFunction(name: EasingType): (t: number) => number {
  return easingFunctions[name] ?? easeInOut;
}

/**
 * Interpolate between two values using an easing function
 */
export function interpolate(
  start: number,
  end: number,
  progress: number,
  easing: EasingType = 'easeInOut'
): number {
  const easedProgress = getEasingFunction(easing)(progress);
  return start + (end - start) * easedProgress;
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Normalize an angle to the range [-PI, PI]
 * Used for smooth angle interpolation
 */
export function normalizeAngle(angle: number): number {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
}

/**
 * Interpolate between two angles, taking the shortest path
 */
export function interpolateAngle(
  start: number,
  end: number,
  progress: number,
  easing: EasingType = 'easeInOut'
): number {
  // Normalize both angles
  const normalizedStart = normalizeAngle(start);
  const normalizedEnd = normalizeAngle(end);

  // Calculate the shortest delta
  let delta = normalizedEnd - normalizedStart;
  if (delta > Math.PI) delta -= 2 * Math.PI;
  if (delta < -Math.PI) delta += 2 * Math.PI;

  // Apply easing and interpolate
  const easedProgress = getEasingFunction(easing)(progress);
  return normalizedStart + delta * easedProgress;
}
