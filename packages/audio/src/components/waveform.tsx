/**
 * Waveform Visualization Component
 * 
 * Mobile-optimized audio waveform visualization using Canvas API.
 * NEW code for Helix (Twick doesn't have audio waveform visualization).
 * 
 * Features:
 * - Real-time waveform rendering from audio file
 * - Mobile performance optimized (canvas resampling)
 * - Touch-friendly progress indicator
 * - Responsive canvas sizing
 * 
 * @packageDocumentation
 */

import { useEffect, useRef, useState } from 'react';

/**
 * Waveform component props
 */
export interface WaveformProps {
  /** Audio source URL (mp3, wav, etc.) */
  src: string;
  /** Canvas width in pixels (default: 800) */
  width?: number;
  /** Canvas height in pixels (default: 100) */
  height?: number;
  /** Waveform color (default: '#3b82f6') */
  waveColor?: string;
  /** Background color (default: '#1f2937') */
  backgroundColor?: string;
  /** Progress indicator color (default: '#ef4444') */
  progressColor?: string;
  /** Current playback time in seconds (for progress indicator) */
  currentTime?: number;
  /** Audio duration in seconds (for progress indicator) */
  duration?: number;
  /** On click callback - returns clicked time in seconds */
  onClick?: (time: number) => void;
  /** Number of bars in waveform (default: 100, mobile: 50) */
  barCount?: number;
}

/**
 * Extract waveform data from audio file
 */
const extractWaveformData = async (
  audioSrc: string,
  barCount: number,
): Promise<number[]> => {
  // Create audio context
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  try {
    // Fetch and decode audio
    const response = await fetch(audioSrc);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    // Get channel data (use first channel for mono/stereo)
    const channelData = audioBuffer.getChannelData(0);
    const samplesPerBar = Math.floor(channelData.length / barCount);

    // Calculate peak amplitude for each bar
    const waveformData: number[] = [];
    for (let i = 0; i < barCount; i++) {
      const start = i * samplesPerBar;
      const end = start + samplesPerBar;
      let max = 0;

      // Find peak in this segment
      for (let j = start; j < end && j < channelData.length; j++) {
        const sample = channelData[j];
        if (sample !== undefined) {
          const abs = Math.abs(sample);
          if (abs > max) {
            max = abs;
          }
        }
      }

      waveformData.push(max);
    }

    return waveformData;
  } finally {
    // Clean up audio context
    await audioContext.close();
  }
};

/**
 * Waveform visualization component
 * 
 * @example
 * ```tsx
 * <Waveform
 *   src="audio.mp3"
 *   width={800}
 *   height={100}
 *   currentTime={currentTime}
 *   duration={duration}
 *   onClick={(time) => seek(time)}
 * />
 * ```
 */
export const Waveform = ({
  src,
  width = 800,
  height = 100,
  waveColor = '#3b82f6',
  backgroundColor = '#1f2937',
  progressColor = '#ef4444',
  currentTime = 0,
  duration = 0,
  onClick,
  barCount,
}: WaveformProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-detect bar count based on width (mobile optimization)
  const effectiveBarCount = barCount ?? (width < 600 ? 50 : 100);

  // Extract waveform data on mount or src change
  useEffect(() => {
    const loadWaveform = async () => {
      if (!src) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await extractWaveformData(src, effectiveBarCount);
        setWaveformData(data);
      } catch (err) {
        setError((err as Error).message);
        console.error('Failed to extract waveform:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWaveform();
  }, [src, effectiveBarCount]);

  // Render waveform on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveformData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Calculate bar dimensions
    const barWidth = width / waveformData.length;
    const barGap = barWidth * 0.2; // 20% gap between bars

    // Calculate progress position
    const progressX = duration > 0 ? (currentTime / duration) * width : 0;

    // Draw waveform bars
    waveformData.forEach((amplitude, index) => {
      const x = index * barWidth;
      const barHeight = amplitude * height * 0.8; // 80% of canvas height
      const y = (height - barHeight) / 2; // Center vertically

      // Use progress color for bars before current time
      ctx.fillStyle = x < progressX ? progressColor : waveColor;
      ctx.fillRect(x, y, barWidth - barGap, barHeight);
    });

    // Draw progress line
    if (progressX > 0) {
      ctx.strokeStyle = progressColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    }
  }, [
    waveformData,
    width,
    height,
    waveColor,
    backgroundColor,
    progressColor,
    currentTime,
    duration,
  ]);

  // Handle canvas click for seeking
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onClick || duration === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickedTime = (x / width) * duration;

    onClick(clickedTime);
  };

  return (
    <div style={{ position: 'relative', width, height }}>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onClick={handleCanvasClick}
        style={{
          cursor: onClick ? 'pointer' : 'default',
          display: 'block',
        }}
      />
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
          }}
        >
          Loading waveform...
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ef4444',
            fontSize: '14px',
            padding: '8px',
            textAlign: 'center',
          }}
        >
          Error: {error}
        </div>
      )}
    </div>
  );
};
