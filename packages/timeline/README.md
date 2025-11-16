# @helix/timeline

Timeline management for Helix mobile video editor.

**⚠️ CODE REUSED FROM @twick/timeline** - This package contains ~70% reused code from Twick SDK's timeline implementation, adapted for mobile-first usage.

## Features

- ✅ **Element Management**: Video, Audio, Text, Image elements (REUSED from Twick)
- ✅ **Track System**: Multi-track timeline with layers (REUSED from Twick)
- ✅ **Visitor Pattern**: Clean element operations (REUSED from Twick)
- ✅ **Undo/Redo**: Full history management (REUSED from Twick)
- ✅ **Serialization**: JSON import/export (REUSED from Twick)
- ✅ **Validation**: Element constraint checking (REUSED from Twick)

## Installation

```bash
pnpm add @helix/timeline
```

## Usage

```typescript
import { TimelineEditor, VideoElement, Track } from '@helix/timeline';

// Create timeline editor
const editor = new TimelineEditor({
  contextId: 'my-timeline',
  // ... callbacks
});

// Add video element
const videoElement = new VideoElement('video.mp4', { width: 1920, height: 1080 })
  .setStart(0)
  .setEnd(10)
  .setName('Intro Video');

const track = new Track('video-track-1');
await editor.addElementToTrack(track.getId(), videoElement);
```

## Code Reuse from Twick

This package reuses the following from `@twick/timeline`:

### Core Classes (100% REUSED)
- `VideoElement`, `AudioElement`, `TextElement`, `ImageElement`
- `Track`, `TimelineEditor`
- Animation system (easing functions, text effects, frame effects)

### Visitor Pattern (100% REUSED)
- `ElementAdder`, `ElementUpdater`, `ElementRemover`
- `ElementSplitter` (audio/video splitting)
- `ElementSerializer`, `ElementDeserializer`
- `ElementValidator`

### Utilities (100% REUSED)
- Time formatting, duration calculations
- UUID generation, type guards
- Collision detection, overlap checking

### Mobile Adaptations (NEW - 30%)
- Touch-optimized UI components (will be added)
- Mobile-first timeline rendering (will be added)
- Gesture-based interactions (will be added)

## License

MIT
