/**
 * @helix/studio - Export Services
 *
 * Video export services for Helix editor.
 */

// Video renderer
export { VideoRenderer, isWebCodecsAvailable, getSupportedVideoCodecs } from './video-renderer';
export type { FrameData } from './video-renderer';

// Audio mixer
export { AudioMixer, getSupportedAudioCodecs } from './audio-mixer';
export type { AudioSegment } from './audio-mixer';

// MP4 muxer
export { MP4Muxer, WebMMuxer, createMuxer } from './mp4-muxer';
export type { MuxerConfig } from './mp4-muxer';

// Export engine
export { ExportEngine } from './export-engine';
export type {
  TimelineData,
  VideoTrack,
  VideoElement,
  AudioTrack,
  AudioElement,
  TextOverlay,
} from './export-engine';
