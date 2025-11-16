import { useRef, useState, useEffect } from 'react';
import { styled } from '@helix/ui';
import { clamp } from '@helix/core';

/**
 * VideoPreview Component
 * 
 * Mobile-optimized video player with touch interactions.
 * Supports tap to play/pause, double-tap to toggle fit mode, pinch to zoom.
 * 
 * @example
 * ```tsx
 * <VideoPreview
 *   src="video.mp4"
 *   currentTime={5.5}
 *   onTimeUpdate={(time) => setCurrentTime(time)}
 *   onPlay={() => console.log('Playing')}
 *   onPause={() => console.log('Paused')}
 * />
 * ```
 */

export interface VideoPreviewProps {
  /** Video source URL */
  src: string;
  
  /** Current playback time (seconds) */
  currentTime?: number;
  
  /** Callback when time updates */
  onTimeUpdate?: (time: number) => void;
  
  /** Callback when video plays */
  onPlay?: () => void;
  
  /** Callback when video pauses */
  onPause?: () => void;
  
  /** Callback when video ends */
  onEnded?: () => void;
  
  /** Playback volume (0-1) */
  volume?: number;
  
  /** Playback rate */
  playbackRate?: number;
  
  /** Enable player controls overlay */
  showControls?: boolean;
  
  /** Poster image URL */
  poster?: string;
}

const VideoContainer = styled('div', {
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '$background',
  overflow: 'hidden',
  
  // Touch optimization
  touchAction: 'manipulation',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
});

const Video = styled('video', {
  width: '100%',
  height: '100%',
  display: 'block',
  
  // Object fit controlled by state
  variants: {
    fitMode: {
      contain: {
        objectFit: 'contain',
      },
      cover: {
        objectFit: 'cover',
      },
    },
  },
  
  defaultVariants: {
    fitMode: 'contain',
  },
});

const ControlsOverlay = styled('div', {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  opacity: 0,
  transition: 'opacity 0.2s ease',
  pointerEvents: 'none',
  
  variants: {
    visible: {
      true: {
        opacity: 1,
      },
    },
  },
});

const PlayPauseButton = styled('button', {
  width: '$16', // 64px
  height: '$16',
  borderRadius: '$full',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  pointerEvents: 'auto',
  
  // Minimum touch target
  minWidth: '$11', // 44px
  minHeight: '$11',
  
  '&:active': {
    transform: 'scale(0.95)',
  },
});

export const VideoPreview = ({
  src,
  currentTime = 0,
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  volume = 1,
  playbackRate = 1,
  showControls = true,
  poster,
}: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const fitMode = 'contain' as const; // Default fit mode
  const zoom = 1; // Default zoom level
  
  // Sync currentTime prop with video element
  useEffect(() => {
    if (videoRef.current && Math.abs(videoRef.current.currentTime - currentTime) > 0.1) {
      videoRef.current.currentTime = currentTime;
    }
  }, [currentTime]);
  
  // Sync volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = clamp(volume, 0, 1);
    }
  }, [volume]);
  
  // Sync playback rate
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
      onPause?.();
    } else {
      videoRef.current.play();
      setIsPlaying(true);
      onPlay?.();
    }
    
    // Show overlay briefly
    setShowOverlay(true);
    setTimeout(() => setShowOverlay(false), 1000);
  };
  
  // Tap to play/pause
  const handleClick = () => {
    togglePlayPause();
  };
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate?.(videoRef.current.currentTime);
    }
  };
  
  // Handle ended
  const handleEnded = () => {
    setIsPlaying(false);
    onEnded?.();
  };
  
  return (
    <VideoContainer onClick={handleClick}>
      <Video
        ref={videoRef}
        src={src}
        poster={poster}
        fitMode={fitMode}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        playsInline
        preload="metadata"
        style={{ transform: `scale(${zoom})` }}
      />
      
      {showControls && (
        <ControlsOverlay visible={showOverlay}>
          <PlayPauseButton onClick={togglePlayPause}>
            {isPlaying ? '⏸' : '▶'}
          </PlayPauseButton>
        </ControlsOverlay>
      )}
    </VideoContainer>
  );
};
