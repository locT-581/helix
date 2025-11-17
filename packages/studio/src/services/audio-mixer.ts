/**
 * AudioMixer - WebCodecs-based audio encoding service
 *
 * Mixes timeline audio tracks using Web Audio API and encodes using WebCodecs AudioEncoder.
 * Supports:
 * - Multiple audio tracks mixing
 * - Volume control per track
 * - Fade in/out effects
 * - Sample rate conversion
 * - Hardware acceleration (when available)
 *
 * @module AudioMixer
 */

import type { ExportConfig, ExportProgress, AudioCodec } from '@helix/core';
import { QUALITY_PRESETS } from '@helix/core';

/**
 * Audio segment for mixing
 */
export interface AudioSegment {
  /** Audio source URL */
  src: string;
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Volume level (0-1) */
  volume?: number | undefined;
  /** Fade in duration (seconds) */
  fadeIn?: number | undefined;
  /** Fade out duration (seconds) */
  fadeOut?: number | undefined;
}

/**
 * Audio encoder configuration
 */
interface AudioEncoderConfig {
  codec: AudioCodec;
  sampleRate: number;
  numberOfChannels: number;
  bitrate: number;
}

/**
 * AudioMixer class
 *
 * Mixes and encodes audio tracks using WebCodecs AudioEncoder API.
 * Handles multi-track mixing, volume control, and encoding.
 *
 * @example
 * ```typescript
 * const mixer = new AudioMixer(exportConfig);
 * await mixer.initialize();
 *
 * // Mix audio segments
 * const mixedBuffer = await mixer.mixSegments(segments, duration);
 * await mixer.encodeAudio(mixedBuffer);
 *
 * await mixer.flush();
 * const chunks = mixer.getEncodedChunks();
 * ```
 */
export class AudioMixer {
  private encoder: AudioEncoder | null = null;
  private encodedChunks: EncodedAudioChunk[] = [];
  private config: ExportConfig;
  private encoderConfig: AudioEncoderConfig | null = null;
  private isInitialized = false;
  private onProgress?: ((progress: ExportProgress) => void) | undefined;

  constructor(
    config: ExportConfig,
    onProgress?: ((progress: ExportProgress) => void) | undefined,
  ) {
    this.config = config;
    this.onProgress = onProgress;
  }

  /**
   * Initialize audio encoder
   *
   * @throws Error if WebCodecs not supported
   */
  public initialize = async (): Promise<void> => {
    // Check WebCodecs support
    if (!this.isWebCodecsSupported()) {
      throw new Error('WebCodecs AudioEncoder not supported in this browser');
    }

    // Get quality settings
    const preset = QUALITY_PRESETS[this.config.quality];

    // Determine codec based on format
    const codec = this.config.audioCodec ?? this.getDefaultCodec();

    // Build encoder configuration
    this.encoderConfig = {
      codec,
      sampleRate: 48000, // Standard for video
      numberOfChannels: 2, // Stereo
      bitrate: this.config.audioBitrate ?? preset.audioBitrate,
    };

    // Check codec support
    const support = await AudioEncoder.isConfigSupported(this.encoderConfig);
    if (!support.supported) {
      throw new Error(`Audio codec ${codec} not supported`);
    }

    // Create encoder
    this.encoder = new AudioEncoder({
      output: this.handleEncodedChunk,
      error: this.handleEncoderError,
    });

    // Configure encoder
    this.encoder.configure(this.encoderConfig);

    this.isInitialized = true;
    this.encodedChunks = [];

    this.reportProgress({
      state: 'initializing',
      progress: 0,
      message: 'Audio encoder initialized',
    });
  };

  /**
   * Mix multiple audio segments into a single AudioBuffer
   *
   * @param segments - Audio segments to mix
   * @param duration - Total duration in seconds
   * @returns Mixed AudioBuffer
   */
  public mixSegments = async (
    segments: AudioSegment[],
    duration: number,
  ): Promise<AudioBuffer> => {
    if (!this.encoderConfig) {
      throw new Error('Encoder not initialized');
    }

    this.reportProgress({
      state: 'encoding',
      progress: 10,
      message: 'Mixing audio tracks...',
    });

    const sampleRate = this.encoderConfig.sampleRate;
    const numChannels = this.encoderConfig.numberOfChannels;
    const totalFrames = Math.ceil(duration * sampleRate);

    // Create offline audio context for mixing
    const OfflineAudioContextCtor: typeof OfflineAudioContext =
      (window as any).OfflineAudioContext ||
      (window as any).webkitOfflineAudioContext;

    if (!OfflineAudioContextCtor) {
      throw new Error('OfflineAudioContext not supported');
    }

    const offline = new OfflineAudioContextCtor(
      numChannels,
      totalFrames,
      sampleRate,
    );

    // Process each segment
    let processedCount = 0;
    for (const segment of segments) {
      if (segment.start >= segment.end) {
        console.warn(
          `Invalid segment: start (${segment.start}) >= end (${segment.end})`,
        );
        continue;
      }

      // Skip muted segments
      const volume = segment.volume ?? 1;
      if (volume <= 0) {
        console.warn(`Skipping muted segment: ${segment.src}`);
        continue;
      }

      try {
        // Fetch and decode audio
        const audioBuffer = await this.fetchAndDecodeAudio(segment.src);
        const segmentDuration = segment.end - segment.start;
        const sourceDuration = Math.min(segmentDuration, audioBuffer.duration);

        // Create buffer source
        const source = offline.createBufferSource();
        source.buffer = audioBuffer;

        // Create gain node for volume/fade
        const gainNode = offline.createGain();
        source.connect(gainNode);
        gainNode.connect(offline.destination);

        // Apply volume
        gainNode.gain.setValueAtTime(volume, segment.start);

        // Apply fade in
        if (segment.fadeIn && segment.fadeIn > 0) {
          gainNode.gain.setValueAtTime(0, segment.start);
          gainNode.gain.linearRampToValueAtTime(
            volume,
            segment.start + segment.fadeIn,
          );
        }

        // Apply fade out
        if (segment.fadeOut && segment.fadeOut > 0) {
          const fadeOutStart = segment.end - segment.fadeOut;
          gainNode.gain.setValueAtTime(volume, fadeOutStart);
          gainNode.gain.linearRampToValueAtTime(0, segment.end);
        }

        // Start playback
        source.start(segment.start, 0, sourceDuration);

        processedCount++;
        this.reportProgress({
          state: 'encoding',
          progress: 10 + (processedCount / segments.length) * 30,
          message: `Processing audio segment ${processedCount}/${segments.length}`,
        });
      } catch (error) {
        console.warn(`Failed to process segment: ${segment.src}`, error);
      }
    }

    this.reportProgress({
      state: 'encoding',
      progress: 40,
      message: 'Rendering mixed audio...',
    });

    // Render mixed audio
    const mixedBuffer = await offline.startRendering();

    this.reportProgress({
      state: 'encoding',
      progress: 50,
      message: 'Audio mixing complete',
    });

    return mixedBuffer;
  };

  /**
   * Encode AudioBuffer to compressed audio chunks
   *
   * @param audioBuffer - AudioBuffer to encode
   */
  public encodeAudio = async (audioBuffer: AudioBuffer): Promise<void> => {
    if (!this.encoder || !this.isInitialized || !this.encoderConfig) {
      throw new Error('Encoder not initialized');
    }

    this.reportProgress({
      state: 'encoding',
      progress: 50,
      message: 'Encoding audio...',
    });

    // Convert AudioBuffer to AudioData chunks
    const sampleRate = audioBuffer.sampleRate;
    const numChannels = audioBuffer.numberOfChannels;
    const numFrames = audioBuffer.length;

    // Process in chunks to avoid memory issues (1 second chunks)
    const chunkSize = sampleRate; // 1 second
    const totalChunks = Math.ceil(numFrames / chunkSize);

    for (let i = 0; i < totalChunks; i++) {
      const startFrame = i * chunkSize;
      const endFrame = Math.min(startFrame + chunkSize, numFrames);
      const chunkFrames = endFrame - startFrame;

      // Extract chunk data
      const channelData: Float32Array[] = [];
      for (let ch = 0; ch < numChannels; ch++) {
        const fullChannelData = audioBuffer.getChannelData(ch);
        const chunkData = fullChannelData.slice(startFrame, endFrame);
        channelData.push(chunkData);
      }

      // Create AudioData from chunk
      const audioData = new AudioData({
        format: 'f32-planar',
        sampleRate,
        numberOfFrames: chunkFrames,
        numberOfChannels: numChannels,
        timestamp: (startFrame / sampleRate) * 1_000_000, // microseconds
        data: this.interleaveChannels(channelData),
      });

      try {
        // Check encoder queue size
        if (this.encoder.encodeQueueSize > 5) {
          await new Promise((resolve) => setTimeout(resolve, 10));
        }

        // Encode chunk
        this.encoder.encode(audioData);

        // Report progress
        this.reportProgress({
          state: 'encoding',
          progress: 50 + ((i + 1) / totalChunks) * 40,
          message: `Encoding audio chunk ${i + 1}/${totalChunks}`,
        });
      } finally {
        // Clean up AudioData
        audioData.close();
      }
    }

    this.reportProgress({
      state: 'encoding',
      progress: 90,
      message: 'Audio encoding complete',
    });
  };

  /**
   * Flush encoder and wait for all pending chunks
   */
  public flush = async (): Promise<void> => {
    if (!this.encoder || !this.isInitialized) {
      throw new Error('Encoder not initialized');
    }

    this.reportProgress({
      state: 'encoding',
      progress: 95,
      message: 'Flushing audio encoder...',
    });

    await this.encoder.flush();

    this.reportProgress({
      state: 'encoding',
      progress: 100,
      message: 'Audio encoding complete',
    });
  };

  /**
   * Get all encoded audio chunks
   */
  public getEncodedChunks = (): EncodedAudioChunk[] => {
    return this.encodedChunks;
  };

  /**
   * Close encoder and release resources
   */
  public close = (): void => {
    if (this.encoder) {
      this.encoder.close();
      this.encoder = null;
    }

    this.isInitialized = false;
    this.encodedChunks = [];
  };

  /**
   * Fetch and decode audio from URL
   */
  private fetchAndDecodeAudio = async (src: string): Promise<AudioBuffer> => {
    const response = await fetch(src);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();

    // Decode using Web Audio API
    const AudioContextCtor: typeof AudioContext =
      (window as any).AudioContext || (window as any).webkitAudioContext;

    if (!AudioContextCtor) {
      throw new Error('Web Audio API not supported');
    }

    const audioContext = new AudioContextCtor();
    try {
      return await new Promise<AudioBuffer>((resolve, reject) => {
        audioContext.decodeAudioData(
          arrayBuffer.slice(0),
          (buf) => resolve(buf),
          (err) => reject(err || new Error('Failed to decode audio')),
        );
      });
    } finally {
      audioContext.close();
    }
  };

  /**
   * Interleave channel data for AudioData
   */
  private interleaveChannels = (channels: Float32Array[]): Float32Array => {
    const numChannels = channels.length;
    const numFrames = channels[0]?.length || 0;
    const interleaved = new Float32Array(numChannels * numFrames);

    for (let frame = 0; frame < numFrames; frame++) {
      for (let ch = 0; ch < numChannels; ch++) {
        interleaved[frame * numChannels + ch] = channels[ch]?.[frame];
      }
    }

    return interleaved;
  };

  /**
   * Handle encoded chunk output
   */
  private handleEncodedChunk = (chunk: EncodedAudioChunk): void => {
    this.encodedChunks.push(chunk);
  };

  /**
   * Handle encoder error
   */
  private handleEncoderError = (error: Error): void => {
    console.error('Audio encoder error:', error);
    this.reportProgress({
      state: 'error',
      progress: 0,
      message: `Encoder error: ${error.message}`,
      error,
    });
  };

  /**
   * Report progress to callback
   */
  private reportProgress = (progress: Partial<ExportProgress>): void => {
    if (this.onProgress) {
      this.onProgress({
        state: progress.state ?? 'encoding',
        progress: progress.progress ?? 0,
        currentFrame: progress.currentFrame,
        totalFrames: progress.totalFrames,
        message: progress.message,
        error: progress.error,
      });
    }
  };

  /**
   * Check if WebCodecs is supported
   */
  private isWebCodecsSupported = (): boolean => {
    return (
      typeof AudioEncoder !== 'undefined' &&
      typeof AudioData !== 'undefined' &&
      typeof EncodedAudioChunk !== 'undefined'
    );
  };

  /**
   * Get default codec based on export format
   */
  private getDefaultCodec = (): AudioCodec => {
    switch (this.config.format) {
      case 'mp4':
        return 'mp4a.40.2'; // AAC-LC
      case 'webm':
        return 'opus'; // Opus
      default:
        return 'mp4a.40.2';
    }
  };
}

/**
 * Get supported audio codecs in current browser
 */
export const getSupportedAudioCodecs = async (): Promise<AudioCodec[]> => {
  if (typeof AudioEncoder === 'undefined') {
    return [];
  }

  const codecs: AudioCodec[] = ['mp4a.40.2', 'opus'];
  const supported: AudioCodec[] = [];

  for (const codec of codecs) {
    try {
      const config: AudioEncoderConfig = {
        codec,
        sampleRate: 48000,
        numberOfChannels: 2,
        bitrate: 192_000,
      };

      const result = await AudioEncoder.isConfigSupported(config);
      if (result.supported) {
        supported.push(codec);
      }
    } catch {
      // Codec not supported
    }
  }

  return supported;
};
