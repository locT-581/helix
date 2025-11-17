/**
 * useTimelineSnapping - Hook for timeline element snapping
 * 
 * Provides snapping functionality for timeline element dragging:
 * - Snap to grid intervals
 * - Snap to other element boundaries
 * - Visual feedback for snap events
 * - Haptic feedback on snap
 * 
 * @module use-timeline-snapping
 */

import { useCallback, useMemo } from 'react';
import { TIMELINE } from '@helix/core';
import {
  calculateSnapTime,
  getAllSnapPoints,
  type SnapPoint,
} from '../utils/snapping-utils';
import { triggerHaptic, HapticPattern } from './use-haptic';

/**
 * Props for useTimelineSnapping hook
 */
export interface UseTimelineSnappingProps {
  /** Timeline duration in seconds */
  duration: number;
  /** All timeline elements for snap point extraction */
  elements: Array<{ id: string; start: number; end: number }>;
  /** Current element ID (to exclude from element snapping) */
  currentElementId: string;
  /** Grid interval in seconds (0 to disable grid snapping) */
  gridInterval?: number;
  /** Snap threshold in seconds */
  threshold?: number;
  /** Enable snapping (can be toggled by user) */
  enabled?: boolean;
  /** Enable haptic feedback on snap */
  hapticFeedback?: boolean;
}

/**
 * Snapping result
 */
export interface SnappingResult {
  /** Snapped time value */
  time: number;
  /** Whether time was snapped */
  snapped: boolean;
  /** Snap point information if snapped */
  snapPoint: SnapPoint | null;
}

/**
 * Hook return type
 */
export interface UseTimelineSnappingReturn {
  /** Apply snapping to a time value */
  snapTime: (targetTime: number) => SnappingResult;
  /** All available snap points */
  snapPoints: SnapPoint[];
  /** Check if snapping is enabled */
  isEnabled: boolean;
}

/**
 * useTimelineSnapping hook
 * 
 * Provides snapping logic for timeline element dragging
 * 
 * @example
 * ```tsx
 * const { snapTime, snapPoints } = useTimelineSnapping({
 *   duration: 10,
 *   elements: [
 *     { id: 'el1', start: 0, end: 5 },
 *     { id: 'el2', start: 6, end: 8 },
 *   ],
 *   currentElementId: 'el1',
 *   gridInterval: 1,
 *   enabled: true,
 * });
 * 
 * // When dragging
 * const handleDrag = (rawTime: number) => {
 *   const { time, snapped } = snapTime(rawTime);
 *   updateElementPosition(time);
 * };
 * ```
 */
export const useTimelineSnapping = ({
  duration,
  elements,
  currentElementId,
  gridInterval = 1,
  threshold = TIMELINE.SNAP_THRESHOLD,
  enabled = true,
  hapticFeedback = true,
}: UseTimelineSnappingProps): UseTimelineSnappingReturn => {
  /**
   * Calculate all snap points (memoized)
   */
  const snapPoints = useMemo(() => {
    if (!enabled) return [];
    
    return getAllSnapPoints(
      duration,
      elements,
      gridInterval,
      currentElementId
    );
  }, [duration, elements, gridInterval, currentElementId, enabled]);

  /**
   * Apply snapping to target time
   */
  const snapTime = useCallback((targetTime: number): SnappingResult => {
    // If snapping disabled, return original time
    if (!enabled) {
      return {
        time: targetTime,
        snapped: false,
        snapPoint: null,
      };
    }

    // Calculate snapped time
    const result = calculateSnapTime(targetTime, snapPoints, threshold);

    // Trigger haptic feedback on snap
    if (result.snapped && hapticFeedback) {
      triggerHaptic(HapticPattern.Selection);
    }

    return result;
  }, [enabled, snapPoints, threshold, hapticFeedback]);

  return {
    snapTime,
    snapPoints,
    isEnabled: enabled,
  };
};
