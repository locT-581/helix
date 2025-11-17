# @helix/audio

Audio engine and utilities for Helix mobile video editor.

## Features

- 🎵 **Web Audio API integration** - Multi-track audio playback and mixing
- 🎚️ **Audio utilities** - Extract, stitch, resample audio (copied from Twick)
- 📊 **Waveform visualization** - Real-time audio visualization
- 🦀 **WASM encoder** - 20-50x faster MP3 encoding vs JavaScript (lamejs replacement)
- 📱 **Mobile-optimized** - Touch-friendly controls, offline-capable

## Installation

```bash
pnpm add @helix/audio
```

## Usage

```typescript
import { useAudioPlayer, extractAudio, getAudioDuration } from '@helix/audio';

// Audio playback
const { play, pause, setVolume, currentTime } = useAudioPlayer();

// Audio utilities
const duration = await getAudioDuration('audio.mp3');
const extracted = await extractAudio({
  src: 'video.mp4',
  start: 0,
  end: 10,
});
```

## Code Reuse

- **85%** copied from `@twick/live-player` and `@twick/media-utils`
- **NEW**: WASM audio encoder (Rust)
- **ADAPTED**: Mobile-friendly UI controls

## License

MIT
