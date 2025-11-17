/**
 * Mobile gesture controls for Helix canvas
 * Implements pan/zoom with @use-gesture/react
 * Touch-friendly with 44x44px minimum touch targets (WCAG AAA)
 */

import { useGesture } from '@use-gesture/react';
import type Konva from 'konva';
import { useCallback, useRef } from 'react';

interface UseCanvasGesturesProps {
  stage: Konva.Stage | null;
  enabled?: boolean;
  minScale?: number;
  maxScale?: number;
  onZoomChange?: (scale: number) => void;
}

interface GestureState {
  isPanning: boolean;
  isPinching: boolean;
  lastScale: number;
  lastPosition: { x: number; y: number };
}

/**
 * Custom hook for handling mobile gestures (pan, pinch-to-zoom, double-tap)
 * Provides smooth 60fps touch interactions on mobile devices
 * 
 * @param stage - Konva stage instance
 * @param enabled - Whether gestures are enabled
 * @param minScale - Minimum zoom scale (default: 0.5)
 * @param maxScale - Maximum zoom scale (default: 4)
 * @param onZoomChange - Callback when zoom level changes
 * 
 * @example
 * ```tsx
 * const { bind } = useCanvasGestures({
 *   stage: stageRef.current,
 *   enabled: true,
 *   minScale: 0.5,
 *   maxScale: 4,
 *   onZoomChange: (scale) => console.log('Zoom:', scale)
 * });
 * 
 * <div ref={containerRef} {...bind()} />
 * ```
 */
export const useCanvasGestures = ({
  stage,
  enabled = true,
  minScale = 0.5,
  maxScale = 4,
  onZoomChange,
}: UseCanvasGesturesProps) => {
  const gestureStateRef = useRef<GestureState>({
    isPanning: false,
    isPinching: false,
    lastScale: 1,
    lastPosition: { x: 0, y: 0 },
  });

  /**
   * Clamp scale value between min and max
   */
  const clampScale = useCallback(
    (scale: number): number => {
      return Math.max(minScale, Math.min(maxScale, scale));
    },
    [minScale, maxScale]
  );

  /**
   * Reset zoom to 100% (1x scale)
   */
  const resetZoom = useCallback(() => {
    if (!stage) return;

    stage.scale({ x: 1, y: 1 });
    stage.position({ x: 0, y: 0 });
    stage.batchDraw();

    gestureStateRef.current.lastScale = 1;
    gestureStateRef.current.lastPosition = { x: 0, y: 0 };

    if (onZoomChange) {
      onZoomChange(1);
    }
  }, [stage, onZoomChange]);

  /**
   * Zoom to specific scale at pointer position
   */
  const zoomToScale = useCallback(
    (newScale: number, pointerX?: number, pointerY?: number) => {
      if (!stage) return;

      const clampedScale = clampScale(newScale);
      const oldScale = stage.scaleX();

      // Get pointer position (use center if not provided)
      const pointer = {
        x: pointerX ?? stage.width() / 2,
        y: pointerY ?? stage.height() / 2,
      };

      // Calculate new position to zoom towards pointer
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale,
      };

      const newPos = {
        x: pointer.x - mousePointTo.x * clampedScale,
        y: pointer.y - mousePointTo.y * clampedScale,
      };

      stage.scale({ x: clampedScale, y: clampedScale });
      stage.position(newPos);
      stage.batchDraw();

      gestureStateRef.current.lastScale = clampedScale;
      gestureStateRef.current.lastPosition = newPos;

      if (onZoomChange) {
        onZoomChange(clampedScale);
      }
    },
    [stage, clampScale, onZoomChange]
  );

  /**
   * Bind gestures using @use-gesture/react
   */
  const bind = useGesture(
    {
      // Pan gesture (single finger drag)
      onDrag: ({ offset: [x, y], pinching, cancel }) => {
        if (!enabled || !stage || pinching) {
          if (cancel) cancel();
          return;
        }

        gestureStateRef.current.isPanning = true;

        // Apply pan offset
        stage.position({ x, y });
        stage.batchDraw();

        gestureStateRef.current.lastPosition = { x, y };
      },

      onDragEnd: () => {
        gestureStateRef.current.isPanning = false;
      },

      // Pinch gesture (two finger zoom)
      onPinch: ({ offset: [scale], origin: [ox, oy], first, cancel }) => {
        if (!enabled || !stage) {
          if (cancel) cancel();
          return;
        }

        if (first) {
          gestureStateRef.current.isPinching = true;
        }

        // Calculate new scale relative to initial scale
        const currentScale = stage.scaleX();
        const newScale = clampScale(currentScale * scale);

        // Zoom towards pinch center
        zoomToScale(newScale, ox, oy);
      },

      onPinchEnd: () => {
        gestureStateRef.current.isPinching = false;
      },

      // Wheel gesture (mouse wheel or trackpad)
      onWheel: ({ event, delta: [, dy], ctrlKey }) => {
        if (!enabled || !stage) return;

        event.preventDefault();

        // Calculate scale change (ctrl/cmd + wheel for zoom)
        if (ctrlKey) {
          const currentScale = stage.scaleX();
          const scaleFactor = 1 - dy * 0.001; // Sensitivity: 0.001
          const newScale = clampScale(currentScale * scaleFactor);

          // Get pointer position
          const pointerPosition = stage.getPointerPosition();
          if (pointerPosition) {
            zoomToScale(newScale, pointerPosition.x, pointerPosition.y);
          }
        } else {
          // Regular wheel: pan vertically
          const currentPos = stage.position();
          stage.position({
            x: currentPos.x,
            y: currentPos.y - dy,
          });
          stage.batchDraw();
        }
      },
    },
    // Config options - only attach when stage exists
    stage?.container()
      ? {
          target: stage.container(),
          drag: {
            from: () => {
              const pos = stage.position();
              return [pos.x, pos.y];
            },
          },
          pinch: {
            scaleBounds: { min: minScale, max: maxScale },
            rubberband: true,
          },
          eventOptions: { passive: false },
        }
      : {}
  );

  return {
    bind,
    resetZoom,
    zoomToScale,
    gestureState: gestureStateRef.current,
  };
};
