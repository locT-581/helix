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
import { useRef, type CSSProperties } from 'react';
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
  const isDraggingRef = useRef(false);

  /**
   * Calculate playhead position (left offset)
   */
  const left = currentTime * pixelsPerSecond;

  /**
   * Handle drag gesture for seeking
   */
  const bind = useGesture(
    {
      onDrag: ({ movement: [mx], first, last }) => {
        if (!draggable || !onSeek) return;

        if (first) {
          isDraggingRef.current = true;
          
          // Haptic feedback on touch devices
          if ('vibrate' in navigator) {
            navigator.vibrate(10);
          }
        }

        // Calculate new time based on drag offset
        const newTime = Math.max(0, (left + mx) / pixelsPerSecond);
        onSeek(newTime);

        if (last) {
          isDraggingRef.current = false;
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

  const handleStyle: CSSProperties = {
    left,
  };

  return (
    <PlayheadContainer
      ref={containerRef}
      style={{ height, left }}
      initial={false}
      animate={{ left }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <PlayheadLine />
      {draggable && (
        <PlayheadHandle
          {...bind()}
          dragging={isDraggingRef.current}
          style={handleStyle}
        />
      )}
    </PlayheadContainer>
  );
};
