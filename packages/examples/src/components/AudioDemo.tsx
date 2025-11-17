/**
 * AudioDemo Component
 * 
 * Demonstrates @helix/audio package features:
 * - Audio playback with useAudioPlayer hook
 * - Waveform visualization
 * - Audio file upload
 * - Playback controls (play/pause, volume, playback rate, seek)
 * 
 * Week 9-10: Audio System Demo
 */

import { useState, useRef } from 'react';
import {
  useAudioPlayer,
  Waveform,
  getAudioDuration,
  extractAudio,
} from '@helix/audio';

/**
 * Format time in seconds to MM:SS
 */
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const AudioDemo = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio player hook
  const {
    play,
    pause,
    stop,
    seek,
    setVolume,
    setPlaybackRate,
    isPlaying,
    currentTime,
    duration,
    volume,
    isLoading,
    error,
  } = useAudioPlayer({
    src: audioUrl,
    volume: 0.8,
    autoPlay: false,
  });

  // Handle file upload
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setProcessingStatus('Loading audio file...');

    try {
      // Create blob URL
      const url = URL.createObjectURL(file);
      setAudioUrl(url);

      // Get duration
      setProcessingStatus('Extracting metadata...');
      const audioDuration = await getAudioDuration(url);
      console.log('Audio duration:', audioDuration);

      setProcessingStatus('Ready!');
    } catch (err) {
      console.error('Failed to load audio:', err);
      setProcessingStatus(`Error: ${(err as Error).message}`);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStatus('');
      }, 1000);
    }
  };

  // Extract audio segment (demo)
  const handleExtractSegment = async () => {
    if (!audioUrl || duration === 0) return;

    setIsProcessing(true);
    setProcessingStatus('Extracting audio segment...');

    try {
      // Extract 5-second segment from current time
      const start = currentTime;
      const end = Math.min(currentTime + 5, duration);

      const segmentUrl = await extractAudio({
        src: audioUrl,
        start,
        end,
        playbackRate: 1,
      });

      setProcessingStatus(`Segment extracted: ${formatTime(start)} - ${formatTime(end)}`);
      console.log('Extracted segment URL:', segmentUrl);

      // Play extracted segment
      setAudioUrl(segmentUrl);
    } catch (err) {
      console.error('Failed to extract segment:', err);
      setProcessingStatus(`Error: ${(err as Error).message}`);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStatus('');
      }, 2000);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
        Audio System Demo
      </h2>
      <p style={{ marginBottom: '24px', color: '#666' }}>
        Week 9-10: @helix/audio package - Audio playback, waveform
        visualization, audio utilities
      </p>

      {/* File Upload */}
      <div style={{ marginBottom: '24px' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          style={{
            padding: '12px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            opacity: isProcessing ? 0.5 : 1,
          }}
        >
          {isProcessing ? 'Processing...' : 'Upload Audio File'}
        </button>
        {processingStatus && (
          <span style={{ marginLeft: '16px', color: '#666' }}>
            {processingStatus}
          </span>
        )}
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <>
          {/* Waveform */}
          <div style={{ marginBottom: '24px' }}>
            <Waveform
              src={audioUrl}
              width={800}
              height={120}
              currentTime={currentTime}
              duration={duration}
              onClick={(time: number) => seek(time)}
              waveColor="#3b82f6"
              progressColor="#ef4444"
              backgroundColor="#1f2937"
            />
          </div>

          {/* Playback Controls */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px',
            }}
          >
            <button
              onClick={isPlaying ? pause : play}
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                backgroundColor: isPlaying ? '#ef4444' : '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.5 : 1,
                minWidth: '100px',
              }}
            >
              {isLoading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              onClick={stop}
              style={{
                padding: '12px 24px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              Stop
            </button>

            <button
              onClick={handleExtractSegment}
              disabled={isProcessing || duration === 0}
              style={{
                padding: '12px 24px',
                backgroundColor: '#8b5cf6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                cursor: isProcessing || duration === 0 ? 'not-allowed' : 'pointer',
                opacity: isProcessing || duration === 0 ? 0.5 : 1,
              }}
            >
              Extract 5s Segment
            </button>

            <div style={{ flex: 1 }} />

            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          {/* Volume Control */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Volume: {Math.round(volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Playback Rate */}
          <div style={{ marginBottom: '24px' }}>
            <label
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Playback Rate
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e5e7eb',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div
              style={{
                padding: '12px',
                backgroundColor: '#fee2e2',
                border: '1px solid #ef4444',
                borderRadius: '8px',
                color: '#b91c1c',
                fontSize: '14px',
              }}
            >
              Error: {error.message || String(error)}
            </div>
          )}
        </>
      )}

      {/* Instructions */}
      {!audioUrl && (
        <div
          style={{
            marginTop: '32px',
            padding: '24px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
            Features
          </h3>
          <ul style={{ listStyle: 'disc', paddingLeft: '24px', lineHeight: '1.8' }}>
            <li>Upload any audio file (MP3, WAV, etc.)</li>
            <li>Visualize waveform with real-time progress</li>
            <li>Play/pause/stop controls</li>
            <li>Adjust volume (0-100%)</li>
            <li>Change playback rate (0.5x - 2x)</li>
            <li>Seek by clicking on waveform</li>
            <li>Extract audio segments (demo: 5s from current time)</li>
          </ul>
        </div>
      )}

      {/* Code Reuse Info */}
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          backgroundColor: '#dbeafe',
          borderLeft: '4px solid #3b82f6',
          borderRadius: '4px',
        }}
      >
        <p style={{ fontSize: '14px', color: '#1e40af' }}>
          <strong>Code Reuse:</strong> 95% from @twick/media-utils (audio
          utilities) + NEW useAudioPlayer hook + NEW Waveform component
        </p>
      </div>
    </div>
  );
};
