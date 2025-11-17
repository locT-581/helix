/**
 * @helix/core - Export Constants
 *
 * Constants for video export functionality.
 */

import type { ExportQuality, VideoResolution } from '../types/export';

/**
 * Resolution dimensions mapping
 */
export const RESOLUTION_DIMENSIONS: Record<
  VideoResolution,
  { width: number; height: number }
> = {
  '480p': { width: 854, height: 480 },
  '720p': { width: 1280, height: 720 },
  '1080p': { width: 1920, height: 1080 },
  '4K': { width: 3840, height: 2160 },
};

/**
 * Quality preset configurations
 */
export const QUALITY_PRESETS: Record<
  ExportQuality,
  {
    resolution: VideoResolution;
    videoBitrate: number; // bps
    audioBitrate: number; // bps
    framerate: number; // fps
  }
> = {
  low: {
    resolution: '720p',
    videoBitrate: 2_500_000, // 2.5 Mbps
    audioBitrate: 128_000, // 128 kbps
    framerate: 30,
  },
  medium: {
    resolution: '1080p',
    videoBitrate: 5_000_000, // 5 Mbps
    audioBitrate: 192_000, // 192 kbps
    framerate: 30,
  },
  high: {
    resolution: '1080p',
    videoBitrate: 8_000_000, // 8 Mbps
    audioBitrate: 256_000, // 256 kbps
    framerate: 60,
  },
  ultra: {
    resolution: '4K',
    videoBitrate: 20_000_000, // 20 Mbps
    audioBitrate: 320_000, // 320 kbps
    framerate: 60,
  },
};
