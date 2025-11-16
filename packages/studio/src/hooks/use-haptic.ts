/**
 * Haptic Feedback Utilities
 * 
 * Mobile haptic feedback using Vibration API.
 * Provides tactile feedback for user interactions.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API
 */

/**
 * Check if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  return 'vibrate' in navigator;
};

/**
 * Haptic feedback patterns (vibration duration in ms)
 */
export const HapticPattern = {
  /** Light tap (e.g., button press) */
  Light: [10] as const,
  
  /** Medium tap (e.g., selection) */
  Medium: [20] as const,
  
  /** Heavy tap (e.g., error, warning) */
  Heavy: [30] as const,
  
  /** Success pattern (double tap) */
  Success: [10, 50, 10] as const,
  
  /** Error pattern (triple tap) */
  Error: [20, 50, 20, 50, 20] as const,
  
  /** Selection changed (short pulse) */
  Selection: [5] as const,
  
  /** Impact (snap to grid, collision) */
  Impact: [15] as const,
  
  /** Notification (pattern) */
  Notification: [10, 100, 10] as const,
} as const;

/**
 * Trigger haptic feedback with pattern
 * 
 * @example
 * ```tsx
 * const handleButtonClick = () => {
 *   triggerHaptic(HapticPattern.Light);
 *   // ... handle click
 * };
 * ```
 */
export const triggerHaptic = (pattern: readonly number[]): void => {
  if (!isHapticSupported()) {
    return;
  }
  
  try {
    navigator.vibrate(pattern as number[]);
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

/**
 * Cancel ongoing haptic feedback
 */
export const cancelHaptic = (): void => {
  if (!isHapticSupported()) {
    return;
  }
  
  try {
    navigator.vibrate(0);
  } catch (error) {
    console.warn('Cancel haptic failed:', error);
  }
};

/**
 * Haptic feedback hooks for common interactions
 */

export const useHapticFeedback = () => {
  const tap = () => triggerHaptic(HapticPattern.Light);
  const select = () => triggerHaptic(HapticPattern.Selection);
  const impact = () => triggerHaptic(HapticPattern.Impact);
  const success = () => triggerHaptic(HapticPattern.Success);
  const error = () => triggerHaptic(HapticPattern.Error);
  const notification = () => triggerHaptic(HapticPattern.Notification);
  
  return {
    tap,
    select,
    impact,
    success,
    error,
    notification,
    isSupported: isHapticSupported(),
  };
};

/**
 * Enhanced gesture hooks with haptic feedback
 * 
 * Wraps existing gesture hooks to add haptic feedback.
 */

import { useTap as useBaseTap, useSwipe as useBaseSwipe } from './use-gestures';

export const useTapWithHaptic = (
  onTap: () => void,
  config?: { threshold?: number; haptic?: readonly number[] }
) => {
  const hapticPattern = config?.haptic ?? HapticPattern.Light;
  
  return useBaseTap(() => {
    triggerHaptic(hapticPattern);
    onTap();
  }, config);
};

export const useSwipeWithHaptic = (config: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  haptic?: readonly number[];
}) => {
  const hapticPattern = config.haptic ?? HapticPattern.Medium;
  
  const wrappedCallbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
    threshold?: number;
  } = {};
  
  if (config.onSwipeLeft) {
    wrappedCallbacks.onSwipeLeft = () => {
      triggerHaptic(hapticPattern);
      config.onSwipeLeft!();
    };
  }
  
  if (config.onSwipeRight) {
    wrappedCallbacks.onSwipeRight = () => {
      triggerHaptic(hapticPattern);
      config.onSwipeRight!();
    };
  }
  
  if (config.onSwipeUp) {
    wrappedCallbacks.onSwipeUp = () => {
      triggerHaptic(hapticPattern);
      config.onSwipeUp!();
    };
  }
  
  if (config.onSwipeDown) {
    wrappedCallbacks.onSwipeDown = () => {
      triggerHaptic(hapticPattern);
      config.onSwipeDown!();
    };
  }
  
  if (config.threshold !== undefined) {
    wrappedCallbacks.threshold = config.threshold;
  }
  
  return useBaseSwipe(wrappedCallbacks);
};
