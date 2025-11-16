/**
 * TimelineContainer - Mobile-first timeline container component
 * 
 * Wraps the entire timeline UI, handles:
 * - Horizontal scrolling with touch momentum
 * - Pinch-to-zoom gestures
 * - Responsive zoom levels
 * - Touch-optimized scrollbar
 * 
 * @module TimelineContainer
 */

import { styled } from '@helix/ui';
import { useGesture } from '@use-gesture/react';
import { useRef, useState, type ReactNode } from 'react';
import { TOUCH_TARGET } from '@helix/core';

/**
 * Props for TimelineContainer component
 */
export interface TimelineContainerProps {
  /** Child components (tracks, elements, ruler) */
  children: ReactNode;
  /** Container height in pixels */
  height?: number;
  /** Minimum zoom level (0.1 = 10%, 1 = 100%) */
  minZoom?: number;
  /** Maximum zoom level (10 = 1000%) */
  maxZoom?: number;
  /** Initial zoom level */
  initialZoom?: number;
  /** Callback when zoom changes */
  onZoomChange?: (zoom: number) => void;
}

/**
 * Styled container for timeline
 * - Horizontal scrolling enabled
 * - Touch momentum scrolling
 * - Overflow hidden (custom scrollbar)
 */
const Container = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  backgroundColor: '$neutral800',
  touchAction: 'pan-x pan-y',
  userSelect: 'none',
  WebkitOverflowScrolling: 'touch',
});

/**
 * Scrollable timeline content wrapper
 * - Transform-based zooming
 * - GPU-accelerated scrolling
 */
const ScrollableContent = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflow: 'auto',
  willChange: 'transform',
  
  // Custom scrollbar (mobile-friendly)
  '&::-webkit-scrollbar': {
    height: TOUCH_TARGET.MIN,
    width: TOUCH_TARGET.MIN,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '$neutral700',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '$neutral500',
    borderRadius: '$md',
    
    '&:hover': {
      backgroundColor: '$neutral400',
    },
  },
});

/**
 * Zoom-transformable timeline wrapper
 */
const ZoomableWrapper = styled('div', {
  transformOrigin: 'left top',
  transition: 'transform 0.2s ease-out',
});

/**
 * TimelineContainer component
 * 
 * Mobile-first timeline container with touch gestures:
 * - Swipe to scroll horizontally
 * - Pinch to zoom in/out
 * - Smooth momentum scrolling
 * 
 * @example
 * ```tsx
 * <TimelineContainer
 *   height={300}
 *   minZoom={0.5}
 *   maxZoom={5}
 *   onZoomChange={(zoom) => console.log('Zoom:', zoom)}
 * >
 *   <TimelineRuler />
 *   <TimelineTrack />
 * </TimelineContainer>
 * ```
 */
export const TimelineContainer = ({
  children,
  height = 300,
  minZoom = 0.5,
  maxZoom = 5,
  initialZoom = 1,
  onZoomChange,
}: TimelineContainerProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(initialZoom);

  /**
   * Handle pinch-to-zoom gesture
   * Uses @use-gesture for unified touch/mouse handling
   */
  useGesture(
    {
      onPinch: ({ offset: [scale] }) => {
        // Clamp zoom between min and max
        const newZoom = Math.max(minZoom, Math.min(maxZoom, scale));
        setZoom(newZoom);
        onZoomChange?.(newZoom);
      },
    },
    {
      target: containerRef,
      eventOptions: { passive: false },
      pinch: {
        scaleBounds: { min: minZoom, max: maxZoom },
        rubberband: true,
      },
    }
  );

  return (
    <Container ref={containerRef} style={{ height }}>
      <ScrollableContent>
        <ZoomableWrapper style={{ transform: `scale(${zoom})` }}>
          {children}
        </ZoomableWrapper>
      </ScrollableContent>
    </Container>
  );
};
