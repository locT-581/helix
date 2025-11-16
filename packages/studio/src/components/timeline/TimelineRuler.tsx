/**
 * TimelineRuler - Time ruler component with markers
 * 
 * Displays time markers at regular intervals:
 * - Responsive to zoom level
 * - Shows major/minor tick marks
 * - Formats time as MM:SS or HH:MM:SS
 * - Mobile-friendly font sizes
 * 
 * @module TimelineRuler
 */

import { styled } from '@helix/ui';
import { formatTime } from '@helix/core';
import { useMemo } from 'react';

/**
 * Props for TimelineRuler component
 */
export interface TimelineRulerProps {
  /** Total timeline duration in seconds */
  duration: number;
  /** Pixels per second (zoom level) */
  pixelsPerSecond?: number;
  /** Height of ruler in pixels */
  height?: number;
}

/**
 * Ruler container
 * - Fixed height
 * - Spans full timeline width
 * - Background with border
 */
const RulerContainer = styled('div', {
  position: 'relative',
  width: '100%',
  backgroundColor: '$neutral700',
  borderBottom: '1px solid $neutral600',
  userSelect: 'none',
});

/**
 * Individual time marker (tick + label)
 */
const TimeMarker = styled('div', {
  position: 'absolute',
  top: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  pointerEvents: 'none',
});

/**
 * Tick mark (vertical line)
 */
const TickMark = styled('div', {
  width: '1px',
  backgroundColor: '$neutral400',
  
  variants: {
    major: {
      true: {
        height: '60%',
        backgroundColor: '$neutral300',
      },
      false: {
        height: '40%',
        backgroundColor: '$neutral500',
      },
    },
  },
});

/**
 * Time label text
 */
const TimeLabel = styled('span', {
  fontSize: '$xs',
  color: '$textSecondary',
  marginTop: '$1',
  whiteSpace: 'nowrap',
});

/**
 * TimelineRuler component
 * 
 * Renders time markers at regular intervals:
 * - Major markers every N seconds (with labels)
 * - Minor markers between major markers
 * - Responsive to zoom level
 * 
 * @example
 * ```tsx
 * <TimelineRuler
 *   duration={120}
 *   pixelsPerSecond={10}
 *   height={40}
 * />
 * ```
 */
export const TimelineRuler = ({
  duration,
  pixelsPerSecond = 10,
  height = 40,
}: TimelineRulerProps): JSX.Element => {
  /**
   * Calculate marker intervals based on zoom level
   * - High zoom: 1s intervals
   * - Medium zoom: 5s intervals
   * - Low zoom: 10s+ intervals
   */
  const { majorInterval, minorInterval } = useMemo(() => {
    if (pixelsPerSecond >= 20) {
      return { majorInterval: 5, minorInterval: 1 };
    }
    if (pixelsPerSecond >= 10) {
      return { majorInterval: 10, minorInterval: 5 };
    }
    if (pixelsPerSecond >= 5) {
      return { majorInterval: 30, minorInterval: 10 };
    }
    return { majorInterval: 60, minorInterval: 30 };
  }, [pixelsPerSecond]);

  /**
   * Generate marker positions
   */
  const markers = useMemo(() => {
    const result: Array<{ time: number; major: boolean }> = [];
    
    // Generate major markers
    for (let time = 0; time <= duration; time += majorInterval) {
      result.push({ time, major: true });
    }
    
    // Generate minor markers
    for (let time = minorInterval; time <= duration; time += majorInterval) {
      for (let i = minorInterval; i < majorInterval; i += minorInterval) {
        const markerTime = time - majorInterval + i;
        if (markerTime > 0 && markerTime < duration) {
          result.push({ time: markerTime, major: false });
        }
      }
    }
    
    return result.sort((a, b) => a.time - b.time);
  }, [duration, majorInterval, minorInterval]);

  /**
   * Calculate total width based on duration and zoom
   */
  const totalWidth = duration * pixelsPerSecond;

  return (
    <RulerContainer style={{ height }}>
      {markers.map(({ time, major }) => {
        const left = time * pixelsPerSecond;
        
        return (
          <TimeMarker key={`marker-${time}`} style={{ left }}>
            <TickMark major={major} />
            {major && <TimeLabel>{formatTime(time)}</TimeLabel>}
          </TimeMarker>
        );
      })}
      
      {/* Ensure container spans full timeline width */}
      <div style={{ width: totalWidth, height: 1 }} />
    </RulerContainer>
  );
};
