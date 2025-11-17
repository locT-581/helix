/**
 * @helix/core - Export Types
 *
 * Type definitions for video export functionality.
 * Supports WebCodecs API and fallback strategies.
 */

/**
 * Video resolution presets
 * Mobile-optimized: 720p default, 1080p for high-quality, 4K optional
 */
export type VideoResolution = '480p' | '720p' | '1080p' | '4K';

/**
 * Video codec options
 * H.264 (AVC): Best compatibility, supported everywhere
 * H.265 (HEVC): Better compression, newer devices
 * VP9: Open codec, Chrome/Android native
 */
export type VideoCodec = 'avc1.42001E' | 'hev1.1.6.L93.B0' | 'vp09.00.10.08';

/**
 * Video container formats
 * MP4: Best compatibility (H.264 + AAC)
 * WebM: Open format (VP9 + Opus)
 */
export type VideoFormat = 'mp4' | 'webm';

/**
 * Audio codec options
 * AAC: Best for MP4 containers
 * Opus: Best for WebM containers
 */
export type AudioCodec = 'mp4a.40.2' | 'opus';

/**
 * Export quality presets
 * Low: 720p @ 2.5 Mbps (mobile preview)
 * Medium: 1080p @ 5 Mbps (default)
 * High: 1080p @ 8 Mbps (high quality)
 * Ultra: 4K @ 20 Mbps (max quality)
 */
export type ExportQuality = 'low' | 'medium' | 'high' | 'ultra';

/**
 * Export configuration options
 */
export interface ExportConfig {
  /** Quality preset (determines resolution, bitrates, framerate) */
  quality: ExportQuality;

  /** Video format (container) */
  format: VideoFormat;

  /** Video codec (auto-selected based on format if not specified) */
  videoCodec?: VideoCodec;

  /** Audio codec (auto-selected based on format if not specified) */
  audioCodec?: AudioCodec;

  /** Custom resolution (overrides quality preset) */
  resolution?: VideoResolution;

  /** Custom video bitrate (overrides quality preset) */
  videoBitrate?: number;

  /** Custom audio bitrate (overrides quality preset) */
  audioBitrate?: number;

  /** Custom framerate (overrides quality preset) */
  framerate?: number;

  /** Enable hardware acceleration (if available) */
  hardwareAcceleration?: boolean;

  /** Export with alpha channel (WebM only) */
  alpha?: boolean;
}

/**
 * Export progress state
 */
export type ExportState =
  | 'idle'
  | 'initializing'
  | 'encoding'
  | 'muxing'
  | 'finalizing'
  | 'completed'
  | 'error'
  | 'cancelled';

/**
 * Export progress information
 */
export interface ExportProgress {
  /** Current state */
  state: ExportState;

  /** Progress percentage (0-100) */
  progress: number;

  /** Current frame being encoded */
  currentFrame?: number | undefined;

  /** Total frames to encode */
  totalFrames?: number | undefined;

  /** Estimated time remaining (seconds) */
  estimatedTimeRemaining?: number | undefined;

  /** Current stage message */
  message?: string | undefined;

  /** Error details (if state is 'error') */
  error?: Error | undefined;
}

/**
 * Export result
 */
export interface ExportResult {
  /** Exported video blob */
  blob: Blob;

  /** Video URL (Object URL) */
  url: string;

  /** File size in bytes */
  size: number;

  /** Export duration in seconds */
  duration: number;

  /** Export configuration used */
  config: ExportConfig;

  /** Export timestamp */
  timestamp: Date;
}

/**
 * Browser capabilities for export
 */
export interface ExportCapabilities {
  /** WebCodecs API available */
  webCodecs: boolean;

  /** Hardware acceleration available */
  hardwareAcceleration: boolean;

  /** Supported video codecs */
  videoCodecs: VideoCodec[];

  /** Supported audio codecs */
  audioCodec: AudioCodec[];

  /** Maximum resolution supported */
  maxResolution: VideoResolution;

  /** Worker support available */
  workerSupport: boolean;
}

/**
 * Export event types
 */
export type ExportEventType =
  | 'start'
  | 'progress'
  | 'complete'
  | 'error'
  | 'cancel';

/**
 * Export event payload
 */
export interface ExportEvent {
  type: ExportEventType;
  progress?: ExportProgress | undefined;
  result?: ExportResult | undefined;
  error?: Error | undefined;
}

/**
 * Export callback function
 */
export type ExportCallback = (event: ExportEvent) => void;
