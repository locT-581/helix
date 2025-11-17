/**
 * ExportEngine - Video export orchestrator
 *
 * Coordinates video rendering, audio mixing, and muxing into final output.
 * Handles:
 * - Timeline frame rendering
 * - Multi-track audio mixing
 * - Video/audio synchronization
 * - MP4/WebM container muxing
 * - Progress tracking and error handling
 *
 * @module ExportEngine
 */

import type {
  ExportConfig,
  ExportProgress,
  ExportResult,
  ExportState,
  ExportCallback,
} from '@helix/core';
import { QUALITY_PRESETS, RESOLUTION_DIMENSIONS } from '@helix/core';
import { VideoRenderer, type FrameData } from './video-renderer';
import { AudioMixer, type AudioSegment } from './audio-mixer';
import { createMuxer, type MuxerConfig } from './mp4-muxer';

/**
 * Timeline data for export
 */
export interface TimelineData {
  /** Timeline duration in seconds */
  duration: number;
  /** Video tracks with elements */
  videoTracks: VideoTrack[];
  /** Audio tracks with elements */
  audioTracks: AudioTrack[];
  /** Text overlays */
  textOverlays: TextOverlay[];
  /** Canvas size */
  width: number;
  height: number;
  /** Framerate */
  framerate: number;
}

/**
 * Video track with elements
 */
export interface VideoTrack {
  id: string;
  elements: VideoElement[];
}

/**
 * Video element on timeline
 */
export interface VideoElement {
  id: string;
  src: string;
  start: number;
  end: number;
  x: number;
  y: number;
  width: number;
  height: number;
  volume?: number | undefined;
}

/**
 * Audio track with elements
 */
export interface AudioTrack {
  id: string;
  elements: AudioElement[];
}

/**
 * Audio element on timeline
 */
export interface AudioElement {
  id: string;
  src: string;
  start: number;
  end: number;
  volume?: number | undefined;
  fadeIn?: number | undefined;
  fadeOut?: number | undefined;
}

/**
 * Text overlay element
 */
export interface TextOverlay {
  id: string;
  text: string;
  start: number;
  end: number;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string | undefined;
}

/**
 * ExportEngine class
 *
 * Orchestrates the entire video export process.
 *
 * @example
 * ```typescript
 * const engine = new ExportEngine(exportConfig, timelineData);
 *
 * engine.on('progress', (event) => {
 *   console.log(`Progress: ${event.progress?.progress}%`);
 * });
 *
 * const result = await engine.export();
 * console.log('Export complete:', result.url);
 * ```
 */
export class ExportEngine {
  private config: ExportConfig;
  private timeline: TimelineData;
  private videoRenderer: VideoRenderer | null = null;
  private audioMixer: AudioMixer | null = null;
  private callbacks: ExportCallback[] = [];
  private isCancelled = false;
  private startTime = 0;

  constructor(config: ExportConfig, timeline: TimelineData) {
    this.config = config;
    this.timeline = timeline;
  }

  /**
   * Register event callback
   */
  public on = (eventType: 'progress' | 'complete' | 'error', callback: ExportCallback): void => {
    this.callbacks.push(callback);
  };

  /**
   * Start export process
   */
  public export = async (): Promise<ExportResult> => {
    this.startTime = Date.now();
    this.isCancelled = false;

    try {
      this.emitEvent({ type: 'start' });
      this.emitProgress({ state: 'initializing', progress: 0 });

      // Step 1: Initialize renderers
      await this.initializeRenderers();

      // Step 2: Render video frames
      const videoChunks = await this.renderVideo();

      // Step 3: Mix and encode audio
      const audioChunks = await this.mixAudio();

      // Step 4: Mux video + audio into container
      const blob = await this.muxMedia(videoChunks, audioChunks);

      // Step 5: Create result
      const result = this.createResult(blob);

      this.emitEvent({ type: 'complete', result });
      this.emitProgress({ state: 'completed', progress: 100 });

      return result;
    } catch (error) {
      const err = error as Error;
      this.emitEvent({ type: 'error', error: err });
      this.emitProgress({ state: 'error', progress: 0, error: err });
      throw error;
    } finally {
      this.cleanup();
    }
  };

  /**
   * Cancel export
   */
  public cancel = (): void => {
    this.isCancelled = true;
    this.emitEvent({ type: 'cancel' });
    this.emitProgress({ state: 'cancelled', progress: 0 });
    this.cleanup();
  };

  /**
   * Initialize video and audio renderers
   */
  private initializeRenderers = async (): Promise<void> => {
    this.emitProgress({
      state: 'initializing',
      progress: 5,
      message: 'Initializing video renderer...',
    });

    this.videoRenderer = new VideoRenderer(this.config, (progress) => {
      this.emitProgress(progress);
    });
    await this.videoRenderer.initialize();

    this.emitProgress({
      state: 'initializing',
      progress: 10,
      message: 'Initializing audio mixer...',
    });

    this.audioMixer = new AudioMixer(this.config, (progress) => {
      this.emitProgress(progress);
    });
    await this.audioMixer.initialize();

    this.emitProgress({
      state: 'initializing',
      progress: 15,
      message: 'Renderers initialized',
    });
  };

  /**
   * Render all video frames
   */
  private renderVideo = async (): Promise<EncodedVideoChunk[]> => {
    if (!this.videoRenderer) {
      throw new Error('Video renderer not initialized');
    }

    this.emitProgress({
      state: 'encoding',
      progress: 15,
      message: 'Rendering video frames...',
    });

    const framerate = this.timeline.framerate;
    const duration = this.timeline.duration;
    const totalFrames = Math.ceil(duration * framerate);

    this.videoRenderer.setTotalFrames(totalFrames);

    // Create canvas for frame composition
    const canvas = document.createElement('canvas');
    canvas.width = this.timeline.width;
    canvas.height = this.timeline.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas 2D context');
    }

    // Render each frame
    const frameDuration = 1 / framerate;
    for (let i = 0; i < totalFrames; i++) {
      if (this.isCancelled) {
        throw new Error('Export cancelled');
      }

      const currentTime = i * frameDuration;
      const timestamp = Math.round(currentTime * 1_000_000); // microseconds
      const duration = Math.round(frameDuration * 1_000_000);

      // Render frame to canvas
      await this.renderFrame(ctx, canvas, currentTime);

      // Encode frame
      const frameData: FrameData = {
        canvas,
        timestamp,
        duration,
        index: i,
      };

      await this.videoRenderer.encodeFrame(frameData);
    }

    // Flush encoder
    await this.videoRenderer.flush();

    return this.videoRenderer.getEncodedChunks();
  };

  /**
   * Render a single frame to canvas
   */
  private renderFrame = async (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    currentTime: number,
  ): Promise<void> => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render video elements
    for (const track of this.timeline.videoTracks) {
      for (const element of track.elements) {
        if (currentTime >= element.start && currentTime < element.end) {
          await this.renderVideoElement(ctx, element, currentTime);
        }
      }
    }

    // Render text overlays
    for (const overlay of this.timeline.textOverlays) {
      if (currentTime >= overlay.start && currentTime < overlay.end) {
        this.renderTextOverlay(ctx, overlay);
      }
    }
  };

  /**
   * Render video element to canvas
   */
  private renderVideoElement = async (
    ctx: CanvasRenderingContext2D,
    element: VideoElement,
    currentTime: number,
  ): Promise<void> => {
    // TODO: Load and draw video frame at currentTime
    // For now, just draw a placeholder
    ctx.fillStyle = '#333333';
    ctx.fillRect(element.x, element.y, element.width, element.height);

    // Draw element ID as placeholder
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Video: ${element.id}`, element.x + 10, element.y + 30);
  };

  /**
   * Render text overlay to canvas
   */
  private renderTextOverlay = (ctx: CanvasRenderingContext2D, overlay: TextOverlay): void => {
    ctx.fillStyle = overlay.color;
    ctx.font = `${overlay.fontSize}px ${overlay.fontFamily ?? 'Arial'}`;
    ctx.fillText(overlay.text, overlay.x, overlay.y);
  };

  /**
   * Mix and encode audio
   */
  private mixAudio = async (): Promise<EncodedAudioChunk[]> => {
    if (!this.audioMixer) {
      throw new Error('Audio mixer not initialized');
    }

    this.emitProgress({
      state: 'encoding',
      progress: 60,
      message: 'Mixing audio tracks...',
    });

    // Collect all audio segments
    const segments: AudioSegment[] = [];
    for (const track of this.timeline.audioTracks) {
      for (const element of track.elements) {
        segments.push({
          src: element.src,
          start: element.start,
          end: element.end,
          volume: element.volume,
          fadeIn: element.fadeIn,
          fadeOut: element.fadeOut,
        });
      }
    }

    // Add audio from video elements
    for (const track of this.timeline.videoTracks) {
      for (const element of track.elements) {
        if (element.volume && element.volume > 0) {
          segments.push({
            src: element.src, // Assume video has audio
            start: element.start,
            end: element.end,
            volume: element.volume,
          });
        }
      }
    }

    // Mix segments
    const mixedBuffer = await this.audioMixer.mixSegments(
      segments,
      this.timeline.duration,
    );

    // Encode mixed audio
    await this.audioMixer.encodeAudio(mixedBuffer);
    await this.audioMixer.flush();

    return this.audioMixer.getEncodedChunks();
  };

  /**
   * Mux video and audio chunks into final container
   */
  private muxMedia = async (
    videoChunks: EncodedVideoChunk[],
    audioChunks: EncodedAudioChunk[],
  ): Promise<Blob> => {
    this.emitProgress({
      state: 'muxing',
      progress: 90,
      message: 'Muxing video and audio...',
    });

    // Get quality preset and resolution
    const preset = QUALITY_PRESETS[this.config.quality];
    const resolution = this.config.resolution ?? preset.resolution;
    const dimensions = RESOLUTION_DIMENSIONS[resolution];

    // Determine codecs
    const videoCodec = this.config.videoCodec ?? this.getDefaultVideoCodec();
    const audioCodec = this.config.audioCodec ?? this.getDefaultAudioCodec();

    // Create muxer configuration
    const muxerConfig: MuxerConfig = {
      format: this.config.format,
      videoCodec,
      audioCodec,
      width: dimensions.width,
      height: dimensions.height,
      framerate: this.config.framerate ?? preset.framerate,
      sampleRate: 48000, // Standard for video
      audioChannels: 2, // Stereo
      duration: this.timeline.duration,
    };

    // Create muxer
    const muxer = createMuxer(muxerConfig);
    await muxer.initialize();

    this.emitProgress({
      state: 'muxing',
      progress: 92,
      message: 'Adding video chunks...',
    });

    // Add video chunks
    for (let i = 0; i < videoChunks.length; i++) {
      const chunk = videoChunks[i];
      if (!chunk) continue;

      await muxer.addVideoChunk(chunk);

      if (i % 100 === 0) {
        this.emitProgress({
          state: 'muxing',
          progress: 92 + ((i / videoChunks.length) * 2),
          message: `Muxing video chunk ${i + 1}/${videoChunks.length}`,
        });
      }
    }

    this.emitProgress({
      state: 'muxing',
      progress: 94,
      message: 'Adding audio chunks...',
    });

    // Add audio chunks
    for (let i = 0; i < audioChunks.length; i++) {
      const chunk = audioChunks[i];
      if (!chunk) continue;

      await muxer.addAudioChunk(chunk);

      if (i % 50 === 0) {
        this.emitProgress({
          state: 'muxing',
          progress: 94 + ((i / audioChunks.length) * 1),
          message: `Muxing audio chunk ${i + 1}/${audioChunks.length}`,
        });
      }
    }

    this.emitProgress({
      state: 'finalizing',
      progress: 95,
      message: 'Finalizing export...',
    });

    // Finalize muxing
    const blob = await muxer.finalize();

    return blob;
  };

  /**
   * Get default video codec based on format
   */
  private getDefaultVideoCodec = () => {
    return this.config.format === 'mp4' ? 'avc1.42001E' : 'vp09.00.10.08';
  };

  /**
   * Get default audio codec based on format
   */
  private getDefaultAudioCodec = () => {
    return this.config.format === 'mp4' ? 'mp4a.40.2' : 'opus';
  };

  /**
   * Create export result
   */
  private createResult = (blob: Blob): ExportResult => {
    const url = URL.createObjectURL(blob);
    const duration = (Date.now() - this.startTime) / 1000;

    return {
      blob,
      url,
      size: blob.size,
      duration,
      config: this.config,
      timestamp: new Date(),
    };
  };

  /**
   * Emit event to callbacks
   */
  private emitEvent = (event: {
    type: 'start' | 'progress' | 'complete' | 'error' | 'cancel';
    progress?: ExportProgress | undefined;
    result?: ExportResult | undefined;
    error?: Error | undefined;
  }): void => {
    for (const callback of this.callbacks) {
      callback(event);
    }
  };

  /**
   * Emit progress update
   */
  private emitProgress = (progress: Partial<ExportProgress>): void => {
    this.emitEvent({
      type: 'progress',
      progress: {
        state: progress.state ?? 'encoding',
        progress: progress.progress ?? 0,
        currentFrame: progress.currentFrame,
        totalFrames: progress.totalFrames,
        estimatedTimeRemaining: progress.estimatedTimeRemaining,
        message: progress.message,
        error: progress.error,
      },
    });
  };

  /**
   * Clean up resources
   */
  private cleanup = (): void => {
    if (this.videoRenderer) {
      this.videoRenderer.close();
      this.videoRenderer = null;
    }

    if (this.audioMixer) {
      this.audioMixer.close();
      this.audioMixer = null;
    }
  };
}
