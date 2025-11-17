/**
 * @helix/audio - Audio engine and utilities
 * 
 * Code reuse: 85% from @twick/live-player + @twick/media-utils
 * NEW: WASM audio encoder (Rust)
 */

// Audio utilities (copied from Twick)
export {
  extractAudio,
  stitchAudio,
  downsampleAudioBuffer,
  type AudioSegment,
} from './audio-utils';

export {
  getAudioDuration,
  clearAudioDurationCache,
} from './get-audio-duration';

// Audio player hook (NEW - for mobile audio editing)
export {
  useAudioPlayer,
  type UseAudioPlayerProps,
  type UseAudioPlayerReturn,
} from './hooks/use-audio-player';

// Waveform visualization component (NEW - for mobile audio editing)
export { Waveform, type WaveformProps } from './components/waveform';

// WASM encoder (NEW - Rust)
// export { encodeAudioWasm } from './wasm';

export const HELIX_AUDIO_VERSION = '0.0.0';
