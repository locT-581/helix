/**
 * Timeline snapping utilities
 * 
 * Provides magnetic snapping functionality for timeline elements:
 * - Snap to grid (time intervals)
 * - Snap to other elements (start/end points)
 * - Visual feedback for snap points
 * 
 * @module snapping-utils
 */

import { TIMELINE } from '@helix/core';

/**
 * Snap point information
 */
export interface SnapPoint {
  /** Time position of snap point */
  time: number;
  /** Type of snap point */
  type: 'grid' | 'element-start' | 'element-end';
  /** Element ID if snapping to element */
  elementId?: string;
}

/**
 * Calculate snap time based on threshold
 * 
 * @param targetTime - Target time to snap
 * @param snapPoints - Available snap points
 * @param threshold - Snap threshold in seconds (default from TIMELINE.SNAP_THRESHOLD)
 * @returns Snapped time or original if no snap found
 */
export const calculateSnapTime = (
  targetTime: number,
  snapPoints: SnapPoint[],
  threshold: number = TIMELINE.SNAP_THRESHOLD
): { time: number; snapped: boolean; snapPoint: SnapPoint | null } => {
  // Find closest snap point within threshold
  let closestPoint: SnapPoint | null = null;
  let closestDistance = threshold;

  for (const point of snapPoints) {
    const distance = Math.abs(targetTime - point.time);
    
    if (distance < closestDistance) {
      closestDistance = distance;
      closestPoint = point;
    }
  }

  // Return snapped time if found, otherwise original
  if (closestPoint) {
    return {
      time: closestPoint.time,
      snapped: true,
      snapPoint: closestPoint,
    };
  }

  return {
    time: targetTime,
    snapped: false,
    snapPoint: null,
  };
};

/**
 * Generate grid snap points based on time intervals
 * 
 * @param duration - Total timeline duration
 * @param interval - Grid interval in seconds (e.g., 0.5, 1, 5)
 * @returns Array of grid snap points
 */
export const generateGridSnapPoints = (
  duration: number,
  interval: number = 1
): SnapPoint[] => {
  const points: SnapPoint[] = [];
  
  for (let time = 0; time <= duration; time += interval) {
    points.push({
      time,
      type: 'grid',
    });
  }
  
  return points;
};

/**
 * Extract snap points from timeline elements
 * 
 * @param elements - Array of timeline elements with start/end times
 * @param excludeId - Element ID to exclude (current dragging element)
 * @returns Array of element snap points
 */
export const extractElementSnapPoints = (
  elements: Array<{ id: string; start: number; end: number }>,
  excludeId?: string
): SnapPoint[] => {
  const points: SnapPoint[] = [];
  
  for (const element of elements) {
    // Skip excluded element (the one being dragged)
    if (element.id === excludeId) continue;
    
    // Add start point
    points.push({
      time: element.start,
      type: 'element-start',
      elementId: element.id,
    });
    
    // Add end point
    points.push({
      time: element.end,
      type: 'element-end',
      elementId: element.id,
    });
  }
  
  return points;
};

/**
 * Combine all snap points (grid + elements)
 * 
 * @param duration - Timeline duration
 * @param elements - Timeline elements
 * @param gridInterval - Grid interval (0 to disable grid snapping)
 * @param excludeElementId - Element ID to exclude from element snapping
 * @returns Combined array of snap points
 */
export const getAllSnapPoints = (
  duration: number,
  elements: Array<{ id: string; start: number; end: number }>,
  gridInterval: number = 1,
  excludeElementId?: string
): SnapPoint[] => {
  const snapPoints: SnapPoint[] = [];
  
  // Add grid snap points if enabled
  if (gridInterval > 0) {
    snapPoints.push(...generateGridSnapPoints(duration, gridInterval));
  }
  
  // Add element snap points
  snapPoints.push(...extractElementSnapPoints(elements, excludeElementId));
  
  return snapPoints;
};

/**
 * Check if time is currently snapped to a point
 * 
 * @param time - Time to check
 * @param snapPoints - Available snap points
 * @param threshold - Snap threshold
 * @returns True if time is within threshold of any snap point
 */
export const isTimeSnapped = (
  time: number,
  snapPoints: SnapPoint[],
  threshold: number = TIMELINE.SNAP_THRESHOLD
): boolean => {
  return snapPoints.some(point => Math.abs(time - point.time) < threshold);
};
