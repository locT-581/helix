/**
 * VideoRenderer - WebCodecs-based video encoding service
 *
 * Renders timeline frames to encoded video using WebCodecs API.
 * Supports:
 * - Canvas-based frame composition
 * - Text overlay rendering
 * - Video element compositing
 * - Hardware acceleration (when available)
 *
 * @module VideoRenderer
 */

import type { ExportConfig, ExportProgress, VideoCodec } from '@helix/core';
import { RESOLUTION_DIMENSIONS, QUALITY_PRESETS } from '@helix/core';

/**
 * Video frame data for encoding
 */
export interface FrameData {
  /** Canvas element containing rendered frame */
  canvas: HTMLCanvasElement;
  /** Frame timestamp in microseconds */
  timestamp: number;
  /** Frame duration in microseconds */
  duration: number;
  /** Frame index */
  index: number;
}

/**
 * Video encoder configuration
 */
interface VideoEncoderConfig {
  codec: VideoCodec;
  width: number;
  height: number;
  bitrate: number;
  framerate: number;
  hardwareAcceleration?: 'no-preference' | 'prefer-hardware' | 'prefer-software';
  alpha?: 'discard' | 'keep';
}

/**
 * VideoRenderer class
 *
 * Encodes video frames using WebCodecs VideoEncoder API.
 * Handles frame composition, encoding, and chunk collection.
 *
 * @example
 * ```typescript
 * const renderer = new VideoRenderer(exportConfig);
 * await renderer.initialize();
 *
 * // Encode frames
 * for (const frame of frames) {
 *   await renderer.encodeFrame(frame);
 * }
 *
 * await renderer.flush();
 * const chunks = renderer.getEncodedChunks();
 * ```
 */
export class VideoRenderer {
  private encoder: VideoEncoder | null = null;
  private encodedChunks: EncodedVideoChunk[] = [];
  private config: ExportConfig;
  private encoderConfig: VideoEncoderConfig | null = null;
  private isInitialized = false;
  private frameCount = 0;
  private totalFrames = 0;
  private onProgress?: ((progress: ExportProgress) => void) | undefined;

  constructor(
    config: ExportConfig,
    onProgress?: ((progress: ExportProgress) => void) | undefined,
  ) {
    this.config = config;
    this.onProgress = onProgress;
  }

  /**
   * Initialize video encoder
   *
   * @throws Error if WebCodecs not supported
   */
  public initialize = async (): Promise<void> => {
    // Check WebCodecs support
    if (!this.isWebCodecsSupported()) {
      throw new Error('WebCodecs API not supported in this browser');
    }

    // Get resolution and quality settings
    const preset = QUALITY_PRESETS[this.config.quality];
    const resolution = this.config.resolution ?? preset.resolution;
    const dimensions = RESOLUTION_DIMENSIONS[resolution];

    // Determine codec based on format
    const codec = this.config.videoCodec ?? this.getDefaultCodec();

    // Build encoder configuration
    this.encoderConfig = {
      codec,
      width: dimensions.width,
      height: dimensions.height,
      bitrate: this.config.videoBitrate ?? preset.videoBitrate,
      framerate: this.config.framerate ?? preset.framerate,
      hardwareAcceleration: this.config.hardwareAcceleration
        ? 'prefer-hardware'
        : 'no-preference',
      alpha: this.config.alpha ? 'keep' : 'discard',
    };

    // Check codec support
    const support = await VideoEncoder.isConfigSupported(this.encoderConfig);
    if (!support.supported) {
      throw new Error(`Video codec ${codec} not supported`);
    }

    // Create encoder
    this.encoder = new VideoEncoder({
      output: this.handleEncodedChunk,
      error: this.handleEncoderError,
    });

    // Configure encoder
    this.encoder.configure(this.encoderConfig);

    this.isInitialized = true;
    this.encodedChunks = [];
    this.frameCount = 0;

    this.reportProgress({
      state: 'initializing',
      progress: 0,
      message: 'Video encoder initialized',
    });
  };

  /**
   * Encode a single frame
   *
   * @param frameData - Frame data to encode
   */
  public encodeFrame = async (frameData: FrameData): Promise<void> => {
    if (!this.encoder || !this.isInitialized) {
      throw new Error('Encoder not initialized');
    }

    // Create VideoFrame from canvas
    const videoFrame = new VideoFrame(frameData.canvas, {
      timestamp: frameData.timestamp,
      duration: frameData.duration,
    });

    try {
      // Check encoder queue size (prevent memory overflow)
      if (this.encoder.encodeQueueSize > 5) {
        // Wait for queue to drain
        await new Promise((resolve) => setTimeout(resolve, 10));
      }

      // Encode frame (keyframe every 150 frames = ~5s @ 30fps)
      const isKeyframe = frameData.index % 150 === 0;
      this.encoder.encode(videoFrame, { keyFrame: isKeyframe });

      this.frameCount++;

      // Report progress
      if (this.totalFrames > 0) {
        this.reportProgress({
          state: 'encoding',
          progress: Math.round((this.frameCount / this.totalFrames) * 100),
          currentFrame: this.frameCount,
          totalFrames: this.totalFrames,
          message: `Encoding frame ${this.frameCount}/${this.totalFrames}`,
        });
      }
    } finally {
      // Clean up VideoFrame
      videoFrame.close();
    }
  };

  /**
   * Flush encoder and wait for all pending frames
   */
  public flush = async (): Promise<void> => {
    if (!this.encoder || !this.isInitialized) {
      throw new Error('Encoder not initialized');
    }

    this.reportProgress({
      state: 'encoding',
      progress: 95,
      message: 'Flushing encoder...',
    });

    await this.encoder.flush();

    this.reportProgress({
      state: 'encoding',
      progress: 100,
      message: 'Video encoding complete',
    });
  };

  /**
   * Get all encoded video chunks
   */
  public getEncodedChunks = (): EncodedVideoChunk[] => {
    return this.encodedChunks;
  };

  /**
   * Set total frames (for progress calculation)
   */
  public setTotalFrames = (total: number): void => {
    this.totalFrames = total;
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
    this.frameCount = 0;
  };

  /**
   * Handle encoded chunk output
   */
  private handleEncodedChunk = (chunk: EncodedVideoChunk): void => {
    this.encodedChunks.push(chunk);
  };

  /**
   * Handle encoder error
   */
  private handleEncoderError = (error: Error): void => {
    console.error('Video encoder error:', error);
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
      typeof VideoEncoder !== 'undefined' &&
      typeof VideoFrame !== 'undefined' &&
      typeof EncodedVideoChunk !== 'undefined'
    );
  };

  /**
   * Get default codec based on export format
   */
  private getDefaultCodec = (): VideoCodec => {
    switch (this.config.format) {
      case 'mp4':
        return 'avc1.42001E'; // H.264 Baseline Profile Level 3.0
      case 'webm':
        return 'vp09.00.10.08'; // VP9 Profile 0
      default:
        return 'avc1.42001E';
    }
  };
}

/**
 * Check if WebCodecs API is available in current browser
 */
export const isWebCodecsAvailable = (): boolean => {
  return (
    typeof VideoEncoder !== 'undefined' &&
    typeof VideoDecoder !== 'undefined' &&
    typeof AudioEncoder !== 'undefined' &&
    typeof AudioDecoder !== 'undefined' &&
    typeof VideoFrame !== 'undefined' &&
    typeof AudioData !== 'undefined'
  );
};

/**
 * Get supported video codecs in current browser
 */
export const getSupportedVideoCodecs = async (): Promise<VideoCodec[]> => {
  if (!isWebCodecsAvailable()) {
    return [];
  }

  const codecs: VideoCodec[] = ['avc1.42001E', 'hev1.1.6.L93.B0', 'vp09.00.10.08'];
  const supported: VideoCodec[] = [];

  for (const codec of codecs) {
    try {
      const config: VideoEncoderConfig = {
        codec,
        width: 1920,
        height: 1080,
        bitrate: 5_000_000,
        framerate: 30,
      };

      const result = await VideoEncoder.isConfigSupported(config);
      if (result.supported) {
        supported.push(codec);
      }
    } catch {
      // Codec not supported
    }
  }

  return supported;
};
