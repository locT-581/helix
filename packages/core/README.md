# @helix/core

> Core utilities and types for Helix mobile video editor

## Features

- ✅ **Zero Dependencies** - Lightweight, tree-shakeable
- ✅ **Mobile-First** - Optimized for mobile devices
- ✅ **Type-Safe** - Full TypeScript support
- ✅ **Modular** - Import only what you need

## Installation

```bash
pnpm add @helix/core
```

## Usage

### Types

```typescript
import type { VideoElement, Project, Size } from '@helix/core';

const videoElement: VideoElement = {
  id: 'video-1',
  type: 'video',
  name: 'My Video',
  start: 0,
  end: 10,
  trackId: 'track-1',
  src: 'video.mp4',
  width: 1080,
  height: 1920,
};

const project: Project = {
  id: 'project-1',
  name: 'My Project',
  version: 1,
  tracks: [],
  duration: 0,
  resolution: { width: 1080, height: 1920 },
  createdAt: new Date(),
  updatedAt: new Date(),
};
```

### Constants

```typescript
import { ELEMENT_TYPE, BREAKPOINTS, VIDEO_PRESET } from '@helix/core';

// Element types
console.log(ELEMENT_TYPE.VIDEO); // 'video'

// Mobile breakpoints
if (window.innerWidth < BREAKPOINTS.TABLET) {
  console.log('Mobile view');
}

// Video presets (mobile-optimized)
const resolution = VIDEO_PRESET.VERTICAL_HD; // 720x1280 @ 30fps
```

### Utilities

```typescript
import {
  generateId,
  formatTime,
  formatFileSize,
  detectDeviceCapabilities,
  debounce,
  throttle,
} from '@helix/core';

// Generate unique ID
const id = generateId(); // 'lq8x9z-abc123'

// Format time
formatTime(125); // '2:05'
formatTime(3665); // '1:01:05'

// Format file size
formatFileSize(1048576); // '1.0 MB'

// Detect device
const device = detectDeviceCapabilities();
if (device.isMobile && device.hasTouch) {
  console.log('Mobile touch device');
}

// Debounce input
const handleInput = debounce((value: string) => {
  console.log('Search:', value);
}, 300);

// Throttle scroll
const handleScroll = throttle(() => {
  console.log('Scrolled');
}, 16); // ~60fps
```

## API Reference

### Types

- `Size` - Width and height dimensions
- `Position` - X and Y coordinates
- `Rect` - Position + Size
- `TimeRange` - Start and end time
- `ElementType` - Video, audio, image, text, etc.
- `BaseElement` - Base timeline element
- `VideoElement` - Video element with metadata
- `AudioElement` - Audio element with fade
- `ImageElement` - Image element with fit
- `TextElement` - Text element with animation
- `Track` - Timeline track container
- `Project` - Complete project structure
- `DeviceCapabilities` - Device detection
- `Theme` - Theme configuration

### Constants

- `ELEMENT_TYPE` - Element type constants
- `TRACK_TYPE` - Track type constants
- `BREAKPOINTS` - Mobile-first breakpoints
- `TOUCH_TARGET` - Touch target sizes (WCAG)
- `TIMELINE` - Timeline configuration
- `VIDEO_PRESET` - Video resolution presets
- `AUDIO` - Audio configuration
- `STORAGE` - Storage limits
- `PERFORMANCE` - Performance thresholds
- `ANIMATION_DURATION` - Animation timings
- `Z_INDEX` - Z-index layers
- `SUPPORTED_FORMATS` - File formats

### Utilities

- `generateId()` - Generate unique ID
- `clamp()` - Clamp value between min/max
- `isTimeRangeOverlap()` - Check time range overlap
- `formatTime()` - Format seconds to MM:SS
- `formatFileSize()` - Format bytes to readable
- `debounce()` - Debounce function
- `throttle()` - Throttle function
- `detectDeviceCapabilities()` - Device detection
- `calculateAspectRatio()` - Calculate aspect ratio
- `fitSize()` - Fit size within bounds
- `lerp()` - Linear interpolation
- `mapRange()` - Map value between ranges

## License

MIT
