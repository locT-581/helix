/**
 * TimelineTrack - Individual track container
 * 
 * Represents a single track in the timeline:
 * - Displays track name and controls
 * - Contains timeline elements
 * - Handles element drop zone
 * - Mobile-optimized height (60px elements)
 * 
 * @module TimelineTrack
 */

import { styled } from '@helix/ui';
import { type Track as TimelineTrackType } from '@helix/timeline';
import { type ReactNode } from 'react';

/**
 * Props for TimelineTrack component
 */
export interface TimelineTrackProps {
  /** Track data from @helix/timeline */
  track: TimelineTrackType;
  /** Pixels per second (zoom level) */
  pixelsPerSecond: number;
  /** Track height in pixels */
  height?: number;
  /** Whether track is selected */
  selected?: boolean;
  /** Callback when track is clicked */
  onTrackClick?: (trackId: string) => void;
  /** Child components (TimelineElement instances) */
  children?: ReactNode;
}

/**
 * Track container
 * - Fixed height (60px for mobile)
 * - Horizontal layout
 * - Background color based on selection
 */
const TrackContainer = styled('div', {
  position: 'relative',
  display: 'flex',
  width: '100%',
  borderBottom: '1px solid $neutral700',
  backgroundColor: '$neutral800',
  transition: 'background-color 0.2s ease',
  
  variants: {
    selected: {
      true: {
        backgroundColor: '$neutral750',
      },
    },
  },
});

/**
 * Track header (left side)
 * - Fixed width
 * - Contains track name and controls
 * - Touch-friendly buttons
 */
const TrackHeader = styled('div', {
  position: 'sticky',
  left: 0,
  zIndex: 10,
  width: '120px',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '$2',
  backgroundColor: '$neutral700',
  borderRight: '1px solid $neutral600',
  gap: '$1',
});

/**
 * Track name text
 */
const TrackName = styled('span', {
  fontSize: '$sm',
  fontWeight: 600,
  color: '$textPrimary',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

/**
 * Track type indicator (Video/Audio/Text/etc)
 */
const TrackType = styled('span', {
  fontSize: '$xs',
  color: '$textSecondary',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
});

/**
 * Track content area (right side)
 * - Scrollable horizontally
 * - Contains timeline elements
 * - Drop zone for new elements
 */
const TrackContent = styled('div', {
  position: 'relative',
  flexGrow: 1,
  height: '100%',
  overflow: 'visible',
});

/**
 * Elements container
 * - Absolute positioning for elements
 * - Spans full timeline width
 */
const ElementsContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
});

/**
 * TimelineTrack component
 * 
 * Renders a single track with:
 * - Sticky header (track name, type)
 * - Scrollable content area
 * - Absolute-positioned elements
 * 
 * @example
 * ```tsx
 * <TimelineTrack
 *   track={videoTrack}
 *   pixelsPerSecond={10}
 *   height={60}
 *   selected={selectedTrackId === videoTrack.getId()}
 *   onTrackClick={handleTrackClick}
 * >
 *   {track.getElements().map(element => (
 *     <TimelineElement
 *       key={element.getId()}
 *       element={element}
 *       pixelsPerSecond={10}
 *     />
 *   ))}
 * </TimelineTrack>
 * ```
 */
export const TimelineTrack = ({
  track,
  height = 60,
  selected = false,
  onTrackClick,
  children,
}: TimelineTrackProps): JSX.Element => {
  /**
   * Get track metadata
   */
  const trackId = track.getId();
  const trackName = track.getName();
  const trackType = track.getType();

  /**
   * Handle track click (selection)
   */
  const handleClick = (): void => {
    onTrackClick?.(trackId);
  };

  return (
    <TrackContainer
      style={{ height }}
      selected={selected}
      onClick={handleClick}
    >
      <TrackHeader>
        <TrackName title={trackName}>{trackName}</TrackName>
        <TrackType>{trackType}</TrackType>
      </TrackHeader>
      
      <TrackContent>
        <ElementsContainer>
          {children}
        </ElementsContainer>
      </TrackContent>
    </TrackContainer>
  );
};
