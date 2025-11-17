/**
 * useAudioPlayer - Basic audio playback hook
 * 
 * NOTE: This is NEW code (not from Twick).
 * Twick uses video player for audio sync, not standalone audio player.
 * We create this for mobile-first audio editing.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseAudioPlayerProps {
  src?: string;
  volume?: number;
  autoPlay?: boolean;
  loop?: boolean;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}

export interface UseAudioPlayerReturn {
  // State
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  error: Error | null;

  // Controls
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (rate: number) => void;

  // Refs
  audioRef: { current: HTMLAudioElement | null };
}

/**
 * Custom hook for audio playback with Web Audio API support
 * 
 * @example
 * ```tsx
 * const { play, pause, currentTime, duration } = useAudioPlayer({
 *   src: 'audio.mp3',
 *   volume: 0.8,
 * });
 * 
 * <button onClick={play}>Play</button>
 * <span>{currentTime} / {duration}</span>
 * ```
 */
export const useAudioPlayer = ({
  src,
  volume: initialVolume = 1,
  autoPlay = false,
  loop = false,
  onEnded,
  onError,
}: UseAudioPlayerProps = {}): UseAudioPlayerReturn => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(initialVolume);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current || !src) return;

    const audio = audioRef.current;
    audio.src = src;
    audio.volume = volume;
    audio.loop = loop;

    setIsLoading(true);
    setError(null);

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    const handlePause = () => {
      setIsPlaying(false);
      setIsPaused(true);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTime(0);
      if (onEnded) onEnded();
    };

    const handleError = (e: ErrorEvent) => {
      const err = new Error(`Audio error: ${e.message || 'Unknown error'}`);
      setError(err);
      setIsLoading(false);
      if (onError) onError(err);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError as EventListener);

    if (autoPlay) {
      audio.play().catch((err: Error) => {
        const error = new Error(`Failed to autoplay: ${err.message}`);
        setError(error);
        if (onError) onError(error);
      });
    }

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError as EventListener);
    };
  }, [src, volume, loop, autoPlay, onEnded, onError]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.play().catch((err: Error) => {
      const error = new Error(`Play failed: ${err.message}`);
      setError(error);
      if (onError) onError(error);
    });
  }, [onError]);

  const pause = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  }, []);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(0, Math.min(time, duration));
  }, [duration]);

  const setVolume = useCallback((vol: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0, Math.min(1, vol));
    audioRef.current.volume = clamped;
    setVolumeState(clamped);
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;
    const clamped = Math.max(0.25, Math.min(4, rate)); // 0.25x - 4x
    audioRef.current.playbackRate = clamped;
  }, []);

  return {
    // State
    isPlaying,
    isPaused,
    currentTime,
    duration,
    volume,
    isLoading,
    error,

    // Controls
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,

    // Refs
    audioRef,
  };
};
