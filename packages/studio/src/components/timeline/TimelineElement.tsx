/**
 * TimelineElement - Draggable/resizable timeline element
 * 
 * Represents a single element (video, audio, text, etc.) on timeline:
 * - Drag to move horizontally
 * - Resize handles (trim start/end)
 * - Touch-optimized interactions
 * - Visual feedback (selection, hover)
 * - Type-specific styling
 * 
 * @module TimelineElement
 */

import { styled } from '@helix/ui';
import { useGesture } from '@use-gesture/react';
import { useState, useRef, type CSSProperties } from 'react';
import { TOUCH_TARGET } from '@helix/core';
import { TrackElement } from '@helix/timeline';

/**
 * Props for TimelineElement component
 */
export interface TimelineElementProps {
  /** Element data from @helix/timeline */
  element: TrackElement;
  /** Pixels per second (zoom level) */
  pixelsPerSecond: number;
  /** Whether element is selected */
  selected?: boolean;
  /** Callback when element is clicked */
  onClick?: (elementId: string) => void;
  /** Callback when element is moved (drag) */
  onMove?: (elementId: string, newStart: number) => void;
  /** Callback when element is resized (trim) */
  onResize?: (elementId: string, newStart: number, newEnd: number) => void;
}

/**
 * Element container
 * - Absolute positioned based on start time
 * - Width based on duration
 * - Height fills track (with padding)
 */
const ElementContainer = styled('div', {
  position: 'absolute',
  top: '4px',
  bottom: '4px',
  borderRadius: '$sm',
  overflow: 'hidden',
  cursor: 'grab',
  transition: 'all 0.15s ease',
  userSelect: 'none',
  
  '&:active': {
    cursor: 'grabbing',
  },
  
  variants: {
    type: {
      video: {
        backgroundColor: '$primary500',
        border: '2px solid $primary600',
      },
      audio: {
        backgroundColor: '$secondary500',
        border: '2px solid $secondary600',
      },
      text: {
        backgroundColor: '$warning',
        border: '2px solid $warningDark',
      },
      image: {
        backgroundColor: '$info',
        border: '2px solid $infoDark',
      },
      default: {
        backgroundColor: '$neutral500',
        border: '2px solid $neutral600',
      },
    },
    selected: {
      true: {
        boxShadow: '0 0 0 2px white, 0 0 8px rgba(255, 255, 255, 0.5)',
        zIndex: 10,
      },
    },
    dragging: {
      true: {
        opacity: 0.8,
        cursor: 'grabbing',
        zIndex: 20,
      },
    },
  },
});

/**
 * Element content (text, thumbnail, etc.)
 */
const ElementContent = styled('div', {
  padding: '$2',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  color: 'white',
  fontSize: '$sm',
  fontWeight: 500,
  overflow: 'hidden',
  pointerEvents: 'none',
});

/**
 * Element name text
 */
const ElementName = styled('span', {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  flexGrow: 1,
});

/**
 * Resize handle (left or right edge)
 * - Touch-friendly width (44px)
 * - Visual indicator on hover
 * - Prevents element drag when active
 */
const ResizeHandle = styled('div', {
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: TOUCH_TARGET.MIN,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'ew-resize',
  zIndex: 5,
  
  '&::before': {
    content: '',
    width: '3px',
    height: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '$sm',
  },
  
  '&:hover::before': {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  
  variants: {
    side: {
      left: {
        left: 0,
        cursor: 'w-resize',
      },
      right: {
        right: 0,
        cursor: 'e-resize',
      },
    },
  },
});

/**
 * TimelineElement component
 * 
 * Draggable/resizable element with touch support:
 * - Drag entire element to move
 * - Drag left/right handles to trim
 * - Visual feedback for selection/drag states
 * - Type-specific colors
 * 
 * @example
 * ```tsx
 * <TimelineElement
 *   element={videoElement}
 *   pixelsPerSecond={10}
 *   selected={selectedId === videoElement.getId()}
 *   onClick={handleElementClick}
 *   onMove={handleElementMove}
 *   onResize={handleElementResize}
 * />
 * ```
 */
export const TimelineElement = ({
  element,
  pixelsPerSecond,
  selected = false,
  onClick,
  onMove,
  onResize,
}: TimelineElementProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<'left' | 'right' | null>(null);

  /**
   * Get element properties
   */
  const elementId = element.getId();
  const elementName = element.getName();
  const elementType = element.getType();
  
  /**
   * Map element type to variant (for styling)
   */
  const typeVariant: 'video' | 'audio' | 'text' | 'image' | 'default' = 
    elementType === 'video' || elementType === 'audio' || elementType === 'text' || elementType === 'image'
      ? elementType
      : 'default';
  
  const startTime = element.getStart();
  const endTime = element.getEnd();
  const duration = endTime - startTime;

  /**
   * Calculate element position and size
   */
  const left = startTime * pixelsPerSecond;
  const width = duration * pixelsPerSecond;

  /**
   * Handle main element drag (move)
   */
  const dragBind = useGesture(
    {
      onDrag: ({ movement: [mx], first, last }) => {
        if (isResizing) return; // Don't drag when resizing

        if (first) {
          setIsDragging(true);
          
          // Haptic feedback
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        }

        if (last) {
          setIsDragging(false);
          
          // Calculate new start time
          const newStart = Math.max(0, (left + mx) / pixelsPerSecond);
          onMove?.(elementId, newStart);
        }
      },
    },
    {
      drag: {
        axis: 'x',
        filterTaps: true,
      },
    }
  );

  /**
   * Handle resize (left trim)
   */
  const resizeLeftBind = useGesture(
    {
      onDrag: ({ movement: [mx], first, last }) => {
        if (first) {
          setIsResizing('left');
          
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        }

        if (last) {
          setIsResizing(null);
          
          // Calculate new start time (end stays the same)
          const newStart = Math.max(0, (left + mx) / pixelsPerSecond);
          const newEnd = endTime;
          
          // Ensure minimum duration (0.1s)
          if (newEnd - newStart >= 0.1) {
            onResize?.(elementId, newStart, newEnd);
          }
        }
      },
    },
    {
      drag: {
        axis: 'x',
        filterTaps: true,
      },
    }
  );

  /**
   * Handle resize (right trim)
   */
  const resizeRightBind = useGesture(
    {
      onDrag: ({ movement: [mx], first, last }) => {
        if (first) {
          setIsResizing('right');
          
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        }

        if (last) {
          setIsResizing(null);
          
          // Calculate new end time (start stays the same)
          const newStart = startTime;
          const newEnd = Math.max(newStart + 0.1, ((left + width) + mx) / pixelsPerSecond);
          
          onResize?.(elementId, newStart, newEnd);
        }
      },
    },
    {
      drag: {
        axis: 'x',
        filterTaps: true,
      },
    }
  );

  /**
   * Handle element click (selection)
   */
  const handleClick = (): void => {
    if (!isDragging && !isResizing) {
      onClick?.(elementId);
    }
  };

  const containerStyle: CSSProperties = {
    left,
    width,
  };

  return (
    <ElementContainer
      ref={containerRef}
      type={typeVariant}
      selected={selected}
      dragging={isDragging}
      style={containerStyle}
      {...dragBind()}
      onClick={handleClick}
    >
      {/* Left resize handle */}
      <ResizeHandle side="left" {...resizeLeftBind()} />
      
      {/* Element content */}
      <ElementContent>
        <ElementName>{elementName}</ElementName>
      </ElementContent>
      
      {/* Right resize handle */}
      <ResizeHandle side="right" {...resizeRightBind()} />
    </ElementContainer>
  );
};
