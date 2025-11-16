# Helix - Mobile Video Editor SDK - AI Coding Agent Instructions

## Project Overview

Helix is a **mobile-first React TypeScript monorepo** for building timeline-based video editing applications. Built with **pnpm workspaces + Turbo + Biome**, it uses **React 19 + Rust/WASM** for high-performance mobile video editing.


## ⚠️ NGUYÊN TẮC PHÁT TRIỂN QUAN TRỌNG

### 🔄 **CODE REUSE STRATEGY - TÁI SỬ DỤNG CODE TỐI ĐA**

**QUAN TRỌNG**: Helix KHÔNG phải là dự án viết lại từ đầu. Helix là **bản tối ưu hóa mobile-first** của Twick SDK.

#### **Quy tắc kế thừa code:**

1. **✅ PHẢI TÁI SỬ DỤNG (Copy & Adapt):**
   - ✅ **Timeline Logic**: Toàn bộ `@twick/timeline` package
     - Element types (VideoElement, AudioElement, TextElement, ImageElement, etc.)
     - Track management classes
     - Visitor pattern implementations (ElementAdder, ElementUpdater, ElementRemover, etc.)
     - TimelineEditor orchestrator
     - Undo/redo history management
   
   - ✅ **Animation System**: `@twick/timeline` animations
     - Easing functions (linear, easeIn, easeOut, easeInOut, etc.)
     - Text effects (Typewriter, Streaming, Elastic, Bounce)
     - Frame effects (Circle, Rect masking)
     - Animation utilities
   
   - ✅ **Canvas Engine**: `@twick/canvas` core logic
     - Fabric.js integration patterns (hoặc migrate sang Konva.js)
     - Element rendering logic
     - Transform controls
     - Layer management
     - Canvas operations (add, update, remove elements)
   
   - ✅ **Media Utilities**: `@twick/media-utils`
     - Video metadata extraction (getVideoDuration, getVideoDimensions)
     - Audio utilities (getAudioDuration, extractAudio - sẽ migrate sang WASM)
     - Dimension handlers (fitSize, calculateAspectRatio)
     - File helpers (URL creation, blob management)
     - Cache management
   
   - ✅ **Live Player**: `@twick/live-player`
     - Video playback logic
     - Time synchronization
     - Playback state management
     - Volume controls
     - Seek operations

2. **🔧 CHỈNH SỬA NHẸ (Adapt for Mobile):**
   - 📱 **UI Components**: Copy logic, rebuild UI với Stitches
     - Timeline components: Chỉ thay đổi CSS/styling, giữ nguyên logic
     - Canvas controls: Adapt cho touch events, giữ nguyên core operations
     - Player controls: Mobile-friendly UI, giữ nguyên player state logic
   
   - ⚡ **Performance**: Optimize, không viết lại
     - Debounce/throttle utilities: Copy từ Twick
     - Virtual scrolling: Sử dụng pattern từ Twick timeline
     - Lazy loading: Kế thừa media loading strategy

3. **🆕 MỚI VIẾT (New Mobile Features):**
   - 👆 Touch gesture handlers (pinch, swipe, long-press)
   - 📱 Bottom sheet component
   - 🎨 Stitches design system (thay CSS variables)
   - 🦀 Rust/WASM modules (audio encoding, timeline collision detection)
   - 📴 Service Workers cho offline support
   - 📊 IndexedDB state persistence

4. **❌ KHÔNG BAO GIỜ:**
   - ❌ Viết lại element types từ đầu (copy từ Twick)
   - ❌ Viết lại Visitor pattern (copy từ Twick)
   - ❌ Viết lại animation system (copy từ Twick)
   - ❌ Viết lại player logic (adapt từ Twick)
   - ❌ Viết lại utilities có sẵn (copy từ Twick)

#### **Migration Workflow:**

```
Bước 1: COPY từ Twick
├─ Sao chép file/folder nguyên gốc từ packages/twick/*
├─ Giữ nguyên business logic
└─ Giữ nguyên class/function signatures

Bước 2: RENAME Package
├─ Đổi @twick/* → @helix/*
├─ Update import paths
└─ Update package.json

Bước 3: ADAPT cho Mobile (nếu cần)
├─ UI: Thay CSS → Stitches styled components
├─ Events: Thêm touch event handlers
├─ Breakpoints: Thêm responsive logic
└─ Dependencies: Upgrade libraries (React 19, etc.)

Bước 4: ENHANCE với WASM (optional)
├─ Audio: lamejs → WASM encoder
├─ Timeline: Collision detection → Rust interval tree
└─ Video: Metadata extraction → WASM processor
```

#### **Code Reuse Checklist:**

Trước khi viết code mới, tự hỏi:
- [ ] ✅ Twick đã có feature này chưa?
- [ ] ✅ Có thể copy code từ Twick không?
- [ ] ✅ Chỉ cần adapt UI/styling hay phải viết lại logic?
- [ ] ✅ Nếu phải viết lại, lý do là gì?

**MỤC TIÊU**: Tái sử dụng ≥ 70% code từ Twick, chỉ viết mới 30% (mobile UI + WASM + PWA).


**Key Packages:**
- `@helix/core` - Zero-dependency foundation (types, constants, utilities)
- Future packages: `@helix/timeline`, `@helix/canvas`, `@helix/player`, `@helix/studio`

**Technology Stack:**
- **Frontend**: React 19 (with Compiler), TypeScript 5.9+, Stitches CSS-in-JS
- **Build**: Vite 6.4+, Turbo 2.6+, pnpm 9.0+
- **Quality**: Biome 1.9+ (linting/formatting), Vitest 2.1+, Changesets
- **Performance**: Rust/WASM modules for audio/video processing

---

## Critical Code Conventions (MUST FOLLOW)

### 1. Function Declarations - ALWAYS Use `const` Arrow Functions
```typescript
// ✅ Correct - ONLY accepted pattern
export const processVideo = (src: string): Promise<Blob> => {
  return videoProcessor.encode(src);
};

// ❌ NEVER use function keyword
export function processVideo(src: string): Promise<Blob> { }
```

### 2. Setter Methods - ALWAYS Return `this` (Fluent Interface)
```typescript
// ✅ Correct - fluent interface pattern
class TimelineElement {
  setStart(time: number): this {
    this.startTime = time;
    return this; // MANDATORY
  }
}

// Usage chaining
element.setStart(0).setEnd(10).setName('Video');
```

### 3. Naming Conventions
- **Classes**: PascalCase (`VideoEditor`, `AudioProcessor`, `TimelineManager`)
- **Methods/Functions**: camelCase with `get`/`set` prefixes (`getId()`, `setVolume()`)
- **Properties**: Descriptive camelCase, NO abbreviations (`startTime` not `st`, `trackId` not `tid`)
- **Constants**: UPPER_SNAKE_CASE (`VIDEO_PRESET`, `BREAKPOINTS`, `TOUCH_TARGET`)
- **Files**: kebab-case (`video-editor.ts`, `audio-processor.ts`)
- **Hooks**: camelCase with `use` prefix (`useTimeline`, `useVideoPlayer`)
- **Components**: PascalCase (`VideoEditor`, `TimelineTrack`, `PlayerControls`)

### 4. TypeScript Strict Mode
```typescript
// tsconfig.base.json enforces:
// - strict: true
// - noUncheckedIndexedAccess: true
// - exactOptionalPropertyTypes: true
// - noUnusedLocals: true
// - noUnusedParameters: true

// ✅ Correct - handle optional properties explicitly
interface DeviceCapabilities {
  maxTextureSize?: number | undefined; // Must include | undefined with exactOptionalPropertyTypes
}

// ✅ Correct - check array access
const item = array[0]; // Type: T | undefined (must check before use)
if (item) {
  processItem(item);
}
```

---

## Git Workflow & Development Process

### Repository Structure
**IMPORTANT**: The `helix/` directory is the **root of this repository**. When working with Git:
- ✅ All commands run from `/helix` directory
- ✅ This is NOT a subdirectory of `twick` - it's a standalone project
- ✅ No references to `twick` codebase allowed

### Professional Git Workflow (MANDATORY)

#### 1. Branch Naming Convention
```bash
# Feature branches
git checkout -b feature/timeline-editor
git checkout -b feature/audio-wasm-processor

# Bug fixes
git checkout -b fix/webgl-context-error
git checkout -b fix/touch-event-handling

# Performance improvements
git checkout -b perf/canvas-rendering
git checkout -b perf/wasm-audio-encoding

# Documentation
git checkout -b docs/api-reference
git checkout -b docs/getting-started
```

#### 2. Commit Message Format (Conventional Commits)
```bash
# Format: <type>(<scope>): <subject>
#
# Types: feat, fix, perf, refactor, docs, test, chore, style, ci
# Scope: core, timeline, canvas, player, studio, wasm, deps

# Examples:
git commit -m "feat(core): add video preset constants for mobile"
git commit -m "fix(wasm): resolve audio encoding memory leak"
git commit -m "perf(timeline): optimize element collision detection with interval tree"
git commit -m "docs(core): add JSDoc for device capabilities detection"
git commit -m "test(utils): add unit tests for time formatting utilities"
git commit -m "refactor(player): extract playback logic to separate hook"
git commit -m "chore(deps): upgrade vite to 6.4.1"
```

#### 3. Development Workflow
```bash
# 1. Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. Make changes and commit frequently
git add .
git commit -m "feat(scope): implement X"

# 3. Keep branch updated with main (rebase preferred)
git fetch origin
git rebase origin/main

# 4. Push to remote
git push origin feature/new-feature

# 5. Create Pull Request on GitHub
# - Add descriptive title
# - Reference related issues (#123)
# - Request code review

# 6. After PR approval, squash and merge
# 7. Delete feature branch
git checkout main
git pull origin main
git branch -d feature/new-feature
```

#### 4. Versioning with Changesets
```bash
# After implementing a change, create a changeset
pnpm changeset

# Follow prompts:
# - Select packages changed (e.g., @helix/core)
# - Select version bump type (major/minor/patch)
# - Write user-facing changelog entry

# Commit the changeset
git add .changeset/*.md
git commit -m "chore(changeset): add changeset for feature X"

# When ready to release (maintainers only):
pnpm changeset:version  # Bump versions
pnpm changeset:release  # Publish to npm
```

#### 5. Code Review Checklist
Before submitting PR, ensure:
- ✅ `pnpm build` succeeds (all packages)
- ✅ `pnpm test` passes (all tests)
- ✅ `pnpm check` passes (Biome linting)
- ✅ TypeScript compiles with no errors
- ✅ Changeset created for user-facing changes
- ✅ Documentation updated (if needed)
- ✅ No console.log statements
- ✅ No commented-out code
- ✅ Follows naming conventions

---

## Architecture Patterns

### Mobile-First Principles
1. **Touch Targets**: Minimum 44x44px (WCAG AAA - `TOUCH_TARGET` constant)
2. **Responsive Breakpoints**: 320px → 905px (`BREAKPOINTS` constant)
3. **Performance**: 60fps target, debounce 150ms, throttle 16ms
4. **Offline-First**: IndexedDB + Service Workers (future)
5. **Progressive Enhancement**: Feature detection, graceful degradation

### Zero-Dependency Core
`@helix/core` package MUST have **zero runtime dependencies**:
```json
{
  "dependencies": {}, // ✅ Empty - MANDATORY
  "devDependencies": {
    "vite": "^6.4.1",
    "typescript": "^5.9.3",
    "vitest": "^2.1.9"
  }
}
```

### Rust/WASM Integration
```typescript
// TypeScript wrapper for WASM module
import { encodeAudioWasm } from '@helix/wasm-audio';

export const encodeAudio = async (audioData: AudioBuffer): Promise<Blob> => {
  // Feature detection
  if (typeof WebAssembly === 'undefined') {
    return encodeAudioJS(audioData); // Fallback to JS
  }

  try {
    return await encodeAudioWasm(audioData); // 20-50x faster
  } catch (error) {
    console.error('WASM encoding failed, falling back to JS:', error);
    return encodeAudioJS(audioData);
  }
};
```

---

## Build & Development Commands

### Monorepo Commands
```bash
# Install dependencies
pnpm install

# Build all packages (Turbo cache)
pnpm build

# Build specific package
pnpm build --filter=@helix/core

# Dev mode (watch mode)
pnpm dev

# Linting & Formatting
pnpm check              # Biome check (lint + format)
pnpm check:fix          # Auto-fix issues

# Testing
pnpm test               # Run all tests
pnpm test:watch         # Watch mode
pnpm test:coverage      # Coverage report

# Versioning
pnpm changeset          # Create changeset
pnpm changeset:version  # Bump versions
pnpm changeset:release  # Publish to npm
```

### Package Build Order (Turbo handles automatically)
1. `@helix/core` (no deps)
2. Other packages (depend on core)

---

## Common Patterns & Best Practices

### Type Safety
```typescript
// ✅ Use branded types for IDs
type ElementId = string & { readonly __brand: 'ElementId' };
type TrackId = string & { readonly __brand: 'TrackId' };

export const createElementId = (id: string): ElementId => id as ElementId;

// ✅ Use discriminated unions for element types
type VideoElement = BaseElement & { type: 'video'; src: string };
type AudioElement = BaseElement & { type: 'audio'; src: string };
type TextElement = BaseElement & { type: 'text'; content: string };

type Element = VideoElement | AudioElement | TextElement;

const processElement = (element: Element) => {
  switch (element.type) {
    case 'video':
      return processVideo(element.src); // TypeScript knows element.src exists
    case 'audio':
      return processAudio(element.src);
    case 'text':
      return renderText(element.content);
  }
};
```

### Error Handling
```typescript
// ✅ Use Result type pattern
type Result<T, E = Error> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export const loadVideo = async (src: string): Promise<Result<VideoData>> => {
  try {
    const data = await fetch(src);
    return { ok: true, value: await data.json() };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
};

// Usage
const result = await loadVideo('video.mp4');
if (result.ok) {
  processVideo(result.value);
} else {
  console.error('Failed to load video:', result.error);
}
```

### Performance Optimization
```typescript
// ✅ Use utility functions from @helix/core
import { debounce, throttle, clamp, lerp } from '@helix/core';

// Debounce user input (150ms default)
const handleSearchDebounced = debounce((query: string) => {
  searchVideos(query);
}, 150);

// Throttle scroll events (16ms = 60fps)
const handleScrollThrottled = throttle(() => {
  updateVisibleElements();
}, 16);

// Math utilities
const progress = clamp(currentTime / duration, 0, 1); // Ensure 0-1 range
const interpolated = lerp(startValue, endValue, progress);
```

---

## Testing Guidelines

### Unit Tests (Vitest)
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { formatTime, debounce } from './utils';

describe('formatTime', () => {
  it('should format seconds to MM:SS', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(65)).toBe('1:05');
    expect(formatTime(3661)).toBe('1:01:01');
  });

  it('should handle fractional seconds', () => {
    expect(formatTime(1.5)).toBe('0:01');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should debounce function calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
```

### Test Coverage Goals
- Unit tests: > 80% coverage
- Integration tests: Critical user flows
- E2E tests: Main editing workflows (future)

---

## File Organization (Standard Structure)
```
helix/
├── .github/
│   ├── copilot-instructions.md    # This file
│   └── workflows/                 # CI/CD (future)
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── types/            # TypeScript types
│   │   │   ├── constants/        # Mobile-first constants
│   │   │   ├── utils/            # Utility functions
│   │   │   │   ├── index.ts
│   │   │   │   └── index.test.ts
│   │   │   └── index.ts          # Public API
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── README.md
│   ├── timeline/                 # Future package
│   ├── canvas/                   # Future package
│   └── player/                   # Future package
├── rust-workspace/
│   ├── Cargo.toml
│   └── crates/
│       ├── audio-processor/
│       └── video-processor/
├── MOBILE_VIDEO_EDITOR_PLAN.md   # Project roadmap
├── package.json                   # Root workspace config
├── pnpm-workspace.yaml
├── turbo.json
├── biome.jsonc
├── tsconfig.base.json
└── README.md
```

---

## Key References
- **Roadmap**: `/MOBILE_VIDEO_EDITOR_PLAN.md` - 16-week development plan
- **Core Package**: `/packages/core/README.md` - API documentation
- **Rust Workspace**: `/rust-workspace/README.md` - WASM modules

---

## When in Doubt

1. **Code Style**: Follow `const` arrow functions, PascalCase classes, fluent setters
2. **Git Workflow**: Create feature branch → commit → push → PR → merge
3. **Commits**: Use conventional commits format `type(scope): subject`
4. **Testing**: Write tests for new utilities, ensure coverage > 80%
5. **Zero Dependencies**: `@helix/core` must remain dependency-free
6. **Mobile-First**: Use `BREAKPOINTS`, `TOUCH_TARGET` constants
7. **TypeScript**: Strict mode enforced, handle optional properties explicitly
8. **Performance**: Debounce 150ms, throttle 16ms, target 60fps

---

**Document Version**: 1.0  
**Last Updated**: November 16, 2025  
**Status**: Active Development 🚀
