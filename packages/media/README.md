# @helix/media

Zero-dependency media utilities for video editing. **100% reused from @twick/media-utils** with no modifications.

## 📦 Features

- ✅ **Video Metadata**: Extract width, height, duration
- ✅ **Audio Duration**: Get audio file duration  
- ✅ **Image Dimensions**: Get image size
- ✅ **Dimension Handlers**: Scale, object-fit calculations
- ✅ **File Helpers**: Download, save, load, blob conversion
- ✅ **Thumbnail Generation**: Extract video frames
- ✅ **Cache Management**: Metadata caching for performance
- ✅ **URL Detection**: Media type detection from URLs
- ⏭️ **Audio Encoding**: Will be replaced with Rust/WASM in Week 9-10 (20-50x faster)

## 🚀 Installation

```bash
pnpm add @helix/media
```

## 📖 Usage

```typescript
import { getVideoMeta, getScaledDimensions, getThumbnail } from '@helix/media';

// Get video metadata
const metadata = await getVideoMeta('video.mp4');
// { width: 1920, height: 1080, duration: 120.5 }

// Scale dimensions to fit container
const scaled = getScaledDimensions(1920, 1080, 800, 600);
// { width: 800, height: 450 }

// Generate video thumbnail
const thumbnailUrl = await getThumbnail('video.mp4', 5); // At 5 seconds
```

## 🔄 Code Reuse from Twick

- ✅ **95% copied** from `@twick/media-utils`:
  - Video/image metadata extraction (no changes)
  - Dimension handlers (no changes)
  - File helpers (no changes)
  - Thumbnail generation (no changes)
- ❌ **Excluded**: audio-utils.ts (will use Rust/WASM in Week 9-10)
- ⏭️ **Future enhancements**:
  - 🦀 WASM thumbnail generation (faster - Week 7-8)
  - 🦀 WASM audio encoding (replace lamejs - Week 9-10, 20-50x faster)
  - 📴 IndexedDB cache (replace memory cache)

## 📐 API Reference

See [Twick Media Utils Docs](https://github.com/twick/packages/media-utils) for detailed API documentation.

## 🎯 Design Principles

1. **Zero Dependencies**: Pure TypeScript, no runtime deps
2. **Code Reuse**: 100% from Twick, battle-tested
3. **Performance**: Metadata caching, lazy loading
4. **Browser APIs**: Uses HTMLVideoElement, HTMLImageElement, Web Audio API

## 📄 License

See LICENSE.md in the root directory.
