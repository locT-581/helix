/**
 * TimelineDemo - Demo timeline UI components
 * 
 * Demonstrates Timeline UI components with sample data.
 * Uses static mock data instead of @helix/timeline classes
 * to avoid TypeScript build issues.
 * 
 * @module TimelineDemo
 */

import { useState, useCallback } from 'react';
import {
  TimelineContainer,
  TimelineRuler,
  Playhead,
  TimelineTrack,
  TimelineElement,
  ZoomControls,
} from '@helix/studio';
import { styled } from '@helix/ui';

/**
 * Mock Track interface (matches @helix/timeline Track structure)
 */
interface MockTrack {
  id: string;
  name: string;
  type: string;
  elements: MockElement[];
}

/**
 * Mock Element interface (matches @helix/timeline TrackElement structure)
 */
interface MockElement {
  id: string;
  name: string;
  type: string;
  start: number;
  end: number;
}

/**
 * Create mock element object with methods
 */
const createMockElement = (el: MockElement): any => ({
  getId: () => el.id,
  getName: () => el.name,
  getType: () => el.type,
  getStart: () => el.start,
  getEnd: () => el.end,
  setStart: (time: number) => ({ ...el, start: time }),
  setEnd: (time: number) => ({ ...el, end: time }),
});

/**
 * Mock track object with methods matching Track class
 */
const createMockTrack = (id: string, name: string, type: string, elements: MockElement[]): any => ({
  id,
  name,
  type,
  elements, // Store raw data for updates
  getId: () => id,
  getName: () => name,
  getType: () => type,
  getElements: () => elements.map(createMockElement),
});

/**
 * Styled wrapper for timeline area
 */
const TimelineWrapper = styled('div', {
  height: '300px',
  backgroundColor: '$neutral800',
  borderTop: '1px solid $neutral600',
});

/**
 * Tracks container (stacks tracks vertically)
 */
const TracksContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Create sample timeline data with mock tracks/elements
 */
const createSampleData = () => {
  const videoElements: MockElement[] = [
    { id: 'v1', name: 'Big Buck Bunny', type: 'video', start: 0, end: 10 },
  ];
  
  const audioElements: MockElement[] = [
    { id: 'a1', name: 'Background Music', type: 'audio', start: 0, end: 10 },
  ];
  
  const textElements: MockElement[] = [
    { id: 't1', name: 'Title Text', type: 'text', start: 1, end: 3 },
    { id: 't2', name: 'Subtitle Text', type: 'text', start: 4, end: 7 },
  ];
  
  return {
    tracks: [
      createMockTrack('track1', 'Video Track', 'video', videoElements),
      createMockTrack('track2', 'Audio Track', 'audio', audioElements),
      createMockTrack('track3', 'Text Track', 'text', textElements),
    ],
    duration: 10,
  };
};

/**
 * TimelineDemo component
 * 
 * Demonstrates Timeline UI components with mock data
 */
export const TimelineDemo = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [tracks, setTracks] = useState(() => createSampleData().tracks);
  const [zoom, setZoom] = useState(1); // Zoom state (0.5 - 5)
  const pixelsPerSecond = 10 * zoom; // Apply zoom to pixels per second
  const duration = 10;

  /**
   * Handle element click (selection)
   */
  const handleElementClick = useCallback((elementId: string) => {
    setSelectedElementId(elementId);
  }, []);

  /**
   * Handle element move (drag)
   */
  const handleElementMove = useCallback((elementId: string, newStart: number) => {
    console.log(`Move element ${elementId} to ${newStart}s`);
    
    setTracks((prevTracks) => {
      return prevTracks.map((track) => {
        const elements = track.getElements();
        const elementIndex = elements.findIndex((el: any) => el.getId() === elementId);
        
        if (elementIndex !== -1) {
          // Update element start time
          const element = elements[elementIndex];
          const duration = element.getEnd() - element.getStart();
          const updatedElements = [...track.elements];
          updatedElements[elementIndex] = {
            ...updatedElements[elementIndex],
            start: newStart,
            end: newStart + duration,
          };
          
          return createMockTrack(track.getId(), track.getName(), track.getType(), updatedElements);
        }
        
        return track;
      });
    });
  }, []);

  /**
   * Handle element resize (trim)
   */
  const handleElementResize = useCallback((elementId: string, newStart: number, newEnd: number) => {
    console.log(`Resize element ${elementId}: ${newStart}s - ${newEnd}s`);
    
    setTracks((prevTracks) => {
      return prevTracks.map((track) => {
        const elements = track.getElements();
        const elementIndex = elements.findIndex((el: any) => el.getId() === elementId);
        
        if (elementIndex !== -1) {
          // Update element timing
          const updatedElements = [...track.elements];
          updatedElements[elementIndex] = {
            ...updatedElements[elementIndex],
            start: newStart,
            end: newEnd,
          };
          
          return createMockTrack(track.getId(), track.getName(), track.getType(), updatedElements);
        }
        
        return track;
      });
    });
  }, []);

  /**
   * Handle playhead seek
   */
  const handleSeek = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  return (
    <TimelineWrapper>
      <TimelineContainer
        height={300}
        minZoom={0.5}
        maxZoom={5}
        initialZoom={1}
        onZoomChange={setZoom}
      >
        {/* Zoom controls (positioned absolutely in top-right) */}
        <ZoomControls
          zoom={zoom}
          minZoom={0.5}
          maxZoom={5}
          step={0.25}
          onZoomChange={setZoom}
        />
        
        {/* Time ruler */}
        <TimelineRuler
          duration={duration}
          pixelsPerSecond={pixelsPerSecond}
          height={40}
        />
        
        {/* Tracks */}
        <TracksContainer>
          {tracks.map((track: any) => (
            <TimelineTrack
              key={track.getId()}
              track={track}
              pixelsPerSecond={pixelsPerSecond}
              height={60}
            >
              {/* Elements in this track */}
              {track.getElements().map((element: any) => (
                <TimelineElement
                  key={element.getId()}
                  element={element}
                  pixelsPerSecond={pixelsPerSecond}
                  selected={selectedElementId === element.getId()}
                  onClick={handleElementClick}
                  onMove={handleElementMove}
                  onResize={handleElementResize}
                />
              ))}
            </TimelineTrack>
          ))}
        </TracksContainer>
        
        {/* Playhead */}
        <Playhead
          currentTime={currentTime}
          pixelsPerSecond={pixelsPerSecond}
          height={300}
          onSeek={handleSeek}
          draggable
        />
      </TimelineContainer>
    </TimelineWrapper>
  );
};
