/**
 * PlayheadLine - Animated playhead indicator
 * 
 * Visual indicator of current playback time:
 * - Red vertical line spanning timeline height
 * - Synchronized with video player
 * - Draggable for seeking
 * - Smooth animation via Framer Motion
 * 
 * @module PlayheadLine
 */

import { styled } from '@helix/ui';
import { motion } from 'framer-motion';
import { useGesture } from '@use-gesture/react';
import { useRef, useState, type CSSProperties } from 'react';
import { TOUCH_TARGET } from '@helix/core';

/**
 * Props for PlayheadLine component
 */
export interface PlayheadLineProps {
  /** Current time in seconds */
  currentTime: number;
  /** Pixels per second (zoom level) */
  pixelsPerSecond: number;
  /** Timeline height in pixels */
  height: number;
  /** Callback when playhead is dragged */
  onSeek?: (time: number) => void;
  /** Whether playhead is draggable */
  draggable?: boolean;
}

/**
 * Playhead container (absolute positioned)
 * - Spans full timeline height
 * - Pointer events only on handle
 */
const PlayheadContainer = styled(motion.div, {
  position: 'absolute',
  top: 0,
  bottom: 0,
  zIndex: 100,
  pointerEvents: 'none',
  willChange: 'transform',
});

/**
 * Playhead line (thin red vertical line)
 */
const PlayheadLine = styled('div', {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '2px',
  height: '100%',
  backgroundColor: '$error',
  boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)',
  pointerEvents: 'none',
});

/**
 * Draggable handle (top of playhead)
 * - Touch-friendly size (44px)
 * - Visual indicator (triangle)
 * - Haptic feedback on drag
 */
const PlayheadHandle = styled('div', {
  position: 'absolute',
  top: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: TOUCH_TARGET.MIN,
  height: TOUCH_TARGET.MIN,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'grab',
  pointerEvents: 'auto',
  touchAction: 'none',
  
  '&::before': {
    content: '',
    width: 0,
    height: 0,
    borderLeft: '8px solid transparent',
    borderRight: '8px solid transparent',
    borderTop: '12px solid $error',
  },
  
  '&:active': {
    cursor: 'grabbing',
  },
  
  variants: {
    dragging: {
      true: {
        '&::before': {
          borderTopColor: '$errorDark',
        },
      },
    },
  },
});

/**
 * Playhead component
 * 
 * Animated indicator of current playback position:
 * - Updates smoothly via Framer Motion
 * - Draggable for seeking (touch-optimized)
 * - Visual feedback during drag
 * 
 * @example
 * ```tsx
 * const { currentTime, setCurrentTime } = useLivePlayerContext();
 * 
 * <Playhead
 *   currentTime={currentTime}
 *   pixelsPerSecond={10}
 *   height={300}
 *   onSeek={setCurrentTime}
 *   draggable
 * />
 * ```
 */
export const Playhead = ({
  currentTime,
  pixelsPerSecond,
  height,
  onSeek,
  draggable = true,
}: PlayheadLineProps): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false); // Use state instead of ref
  const [dragOffset, setDragOffset] = useState(0); // Visual offset during drag

  /**
   * Calculate playhead position (left offset)
   */
  const baseLeft = currentTime * pixelsPerSecond;
  const left = baseLeft + dragOffset; // Apply visual offset

  /**
   * Handle drag gesture for seeking
   */
  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], first, last }) => {
        if (!draggable || !onSeek) return;

        if (first) {
          setIsDragging(true);
          setDragOffset(0); // Initialize offset immediately
          
          // Haptic feedback on touch devices
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        }

        // Update visual offset continuously (including first event when mx becomes non-zero)
        setDragOffset(mx);

        if (last) {
          setIsDragging(false);
          
          // Calculate final time based on current offset
          const newTime = Math.max(0, (baseLeft + mx) / pixelsPerSecond);
          
          // Reset offset BEFORE callback to avoid double-apply when parent updates
          setDragOffset(0);
          
          // Call callback after reset
          onSeek(newTime);
        }
      },
    },
    {
      drag: {
        axis: 'x',
        filterTaps: true,
      },
      eventOptions: { passive: false },
    }
  );

  return (
    <PlayheadContainer
      ref={containerRef}
      style={{ height, left }}
      initial={false}
      animate={isDragging ? {} : { left }} // Disable animation during drag
      transition={{
        type: 'tween',
        duration: 0, // Instant update, no delay
      }}
    >
      <PlayheadLine />
      {draggable && (
        <PlayheadHandle
          {...bind()}
          dragging={isDragging}
        />
      )}
    </PlayheadContainer>
  );
};
