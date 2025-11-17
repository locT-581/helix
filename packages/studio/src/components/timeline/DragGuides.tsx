/**
 * DragGuides - Visual guides during element dragging
 * 
 * Displays helpful visual indicators when dragging timeline elements:
 * - Vertical guide line at current drag position
 * - Time indicator label showing current time
 * - Element boundaries (start/end points)
 * - Snap point indicators (when snapping is enabled)
 * 
 * @module DragGuides
 */

import { styled } from '@helix/ui';
import { formatTime } from '@helix/core';
import type { JSX } from 'react';

/**
 * Props for DragGuides component
 */
export interface DragGuidesProps {
  /** Current drag position in seconds */
  currentTime: number;
  /** Pixels per second (zoom level) */
  pixelsPerSecond: number;
  /** Timeline height in pixels */
  height: number;
  /** Whether guide is visible */
  visible: boolean;
  /** Element start time (for boundary indicator) */
  elementStart?: number;
  /** Element end time (for boundary indicator) */
  elementEnd?: number;
  /** Snap points to visualize (future feature) */
  snapPoints?: number[];
}

/**
 * Guide line container (absolute positioned)
 */
const GuideContainer = styled('div', {
  position: 'absolute',
  top: 0,
  bottom: 0,
  pointerEvents: 'none',
  zIndex: 50,
  transition: 'left 0.05s linear',
});

/**
 * Vertical guide line (dashed)
 */
const GuideLine = styled('div', {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '2px',
  backgroundColor: '$primary',
  opacity: 0.7,
  
  // Dashed pattern
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundImage: 'linear-gradient(to bottom, $primary 50%, transparent 50%)',
    backgroundSize: '2px 8px',
    backgroundRepeat: 'repeat-y',
  },
});

/**
 * Time indicator label (top of guide line)
 */
const TimeIndicator = styled('div', {
  position: 'absolute',
  top: '-24px',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '$1 $2',
  backgroundColor: '$primary',
  color: 'white',
  fontSize: '$xs',
  fontWeight: '$medium',
  borderRadius: '$sm',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  
  // Arrow pointing down
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderTop: '4px solid $primary',
  },
});

/**
 * Element boundary marker (start/end points)
 */
const BoundaryMarker = styled('div', {
  position: 'absolute',
  top: 0,
  width: '1px',
  height: '100%',
  backgroundColor: '$neutral400',
  opacity: 0.5,
  
  variants: {
    type: {
      start: {
        borderLeft: '2px solid $success',
      },
      end: {
        borderLeft: '2px solid $error',
      },
    },
  },
});

/**
 * DragGuides component
 * 
 * Visual feedback during timeline element dragging:
 * - Shows current time position
 * - Displays vertical guide line
 * - Marks element boundaries
 * 
 * @example
 * ```tsx
 * <DragGuides
 *   currentTime={3.5}
 *   pixelsPerSecond={10}
 *   height={300}
 *   visible={isDragging}
 *   elementStart={2}
 *   elementEnd={5}
 * />
 * ```
 */
export const DragGuides = ({
  currentTime,
  pixelsPerSecond,
  height,
  visible,
  elementStart,
  elementEnd,
}: DragGuidesProps): JSX.Element | null => {
  if (!visible) return null;

  /**
   * Calculate pixel positions
   */
  const currentLeft = currentTime * pixelsPerSecond;
  const startLeft = elementStart !== undefined ? elementStart * pixelsPerSecond : null;
  const endLeft = elementEnd !== undefined ? elementEnd * pixelsPerSecond : null;

  return (
    <>
      {/* Current position guide */}
      <GuideContainer style={{ left: currentLeft, height }}>
        <GuideLine />
        <TimeIndicator>
          {formatTime(currentTime)}
        </TimeIndicator>
      </GuideContainer>

      {/* Element start boundary */}
      {startLeft !== null && (
        <BoundaryMarker
          type="start"
          style={{ left: startLeft, height }}
          title="Element start"
        />
      )}

      {/* Element end boundary */}
      {endLeft !== null && (
        <BoundaryMarker
          type="end"
          style={{ left: endLeft, height }}
          title="Element end"
        />
      )}
    </>
  );
};
