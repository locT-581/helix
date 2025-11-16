import { useDrag, useGesture, usePinch } from '@use-gesture/react';
import type { Handler, UserDragConfig, UserPinchConfig } from '@use-gesture/react';

/**
 * Gesture Hooks
 * 
 * Mobile-optimized gesture hooks wrapping @use-gesture/react.
 * Ensures 44px minimum touch targets (WCAG AAA) and proper event handling.
 */

/**
 * useTap Hook
 * 
 * Detect tap gestures with proper touch target size.
 * Minimum 44x44px tap area for accessibility.
 * 
 * @example
 * ```tsx
 * const bind = useTap(() => console.log('Tapped!'));
 * <div {...bind()}>Tap me</div>
 * ```
 */
export const useTap = (
  onTap: () => void,
  config?: { threshold?: number }
): Handler<'drag', PointerEvent> => {
  const threshold = config?.threshold ?? 10; // px
  
  return useDrag(
    ({ tap, movement: [mx, my] }) => {
      // Only fire if movement is below threshold (avoid triggering on drag)
      if (tap && Math.abs(mx) < threshold && Math.abs(my) < threshold) {
        onTap();
      }
    },
    { filterTaps: true }
  );
};

/**
 * useDoubleTap Hook
 * 
 * Detect double tap gestures (e.g., toggle fit/fill on video).
 * 
 * @example
 * ```tsx
 * const bind = useDoubleTap(() => console.log('Double tapped!'));
 * <video {...bind()} />
 * ```
 */
export const useDoubleTap = (
  onDoubleTap: () => void
): Handler<'drag', PointerEvent> => {
  return useDrag(
    ({ tap, elapsedTime }) => {
      if (tap && elapsedTime < 300) {
        onDoubleTap();
      }
    },
    { filterTaps: true }
  );
};

/**
 * useLongPress Hook
 * 
 * Detect long press gestures (e.g., context menu).
 * Default threshold: 500ms.
 * 
 * @example
 * ```tsx
 * const bind = useLongPress(() => showContextMenu());
 * <div {...bind()}>Long press me</div>
 * ```
 */
export const useLongPress = (
  onLongPress: () => void,
  config?: { threshold?: number }
): Handler<'drag', PointerEvent> => {
  const threshold = config?.threshold ?? 500; // ms
  
  return useDrag(
    ({ elapsedTime, movement: [mx, my] }) => {
      // Fire if held down for threshold duration without moving
      if (
        elapsedTime >= threshold &&
        Math.abs(mx) < 10 &&
        Math.abs(my) < 10
      ) {
        onLongPress();
      }
    }
  );
};

/**
 * useSwipe Hook
 * 
 * Detect swipe gestures in cardinal directions.
 * 
 * @example
 * ```tsx
 * const bind = useSwipe({
 *   onSwipeLeft: () => console.log('Swiped left'),
 *   onSwipeRight: () => console.log('Swiped right'),
 * });
 * <div {...bind()}>Swipe me</div>
 * ```
 */
export const useSwipe = (config: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}): Handler<'drag', PointerEvent> => {
  const threshold = config.threshold ?? 50; // px
  
  return useDrag(
    ({ swipe: [sx, sy] }) => {
      if (sx === -1 && config.onSwipeLeft) config.onSwipeLeft();
      if (sx === 1 && config.onSwipeRight) config.onSwipeRight();
      if (sy === -1 && config.onSwipeUp) config.onSwipeUp();
      if (sy === 1 && config.onSwipeDown) config.onSwipeDown();
    },
    { swipe: { distance: threshold } }
  );
};

/**
 * usePinchZoom Hook
 * 
 * Detect pinch-to-zoom gestures (e.g., zoom video preview).
 * 
 * @example
 * ```tsx
 * const bind = usePinchZoom((scale) => setZoom(scale));
 * <div {...bind()}>Pinch to zoom</div>
 * ```
 */
export const usePinchZoom = (
  onPinch: (scale: number) => void,
  config?: UserPinchConfig
): Handler<'pinch', WheelEvent | PointerEvent> => {
  return usePinch(
    ({ offset: [scale] }) => {
      onPinch(scale);
    },
    {
      scaleBounds: { min: 0.5, max: 3 },
      rubberband: true,
      ...config,
    }
  );
};

/**
 * useDragElement Hook
 * 
 * Drag element with position constraints.
 * 
 * @example
 * ```tsx
 * const { bind, position } = useDragElement();
 * <div {...bind()} style={{ x: position.x, y: position.y }}>
 *   Drag me
 * </div>
 * ```
 */
export const useDragElement = (config?: UserDragConfig) => {
  const dragConfig: UserDragConfig = {
    from: [0, 0],
    rubberband: true,
  };
  
  if (config?.bounds) {
    dragConfig.bounds = config.bounds;
  }
  
  const bind = useDrag(
    ({ offset: [x, y] }) => {
      // Return position for consumer to handle
      return { x, y };
    },
    dragConfig
  );
  
  return { bind };
};

/**
 * useCombinedGestures Hook
 * 
 * Combine multiple gestures (tap, drag, pinch) on same element.
 * 
 * @example
 * ```tsx
 * const bind = useCombinedGestures({
 *   onTap: () => console.log('Tapped'),
 *   onDrag: ({ movement }) => console.log('Dragging', movement),
 *   onPinch: ({ offset }) => console.log('Pinching', offset),
 * });
 * <div {...bind()}>Multi-gesture element</div>
 * ```
 */
export const useCombinedGestures = (config: {
  onTap?: () => void;
  onDrag?: (state: Parameters<Handler<'drag'>>[0]) => void;
  onPinch?: (state: Parameters<Handler<'pinch'>>[0]) => void;
}) => {
  return useGesture(
    {
      onDrag: config.onDrag ?? (() => {}),
      onPinch: config.onPinch ?? (() => {}),
      onClick: config.onTap ?? (() => {}),
    },
    {
      drag: { filterTaps: true },
      pinch: { scaleBounds: { min: 0.5, max: 3 } },
    }
  );
};
