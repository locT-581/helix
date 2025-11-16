# 🧬 Helix - Mobile-First Video Editor SDK

> **Status**: 🚧 Work In Progress - Temp Workspace  
> **Base**: Twick SDK v0.14.0  
> **Target**: Mobile-first video editing with React 19 + Rust/WASM

---

## 📁 Project Structure

```
helix/
├── packages/               # NPM packages (@helix/*)
│   ├── core/              # Core utilities & types (lightweight)
│   ├── ui/                # Headless UI components (mobile-optimized)
│   ├── timeline/          # Timeline engine (TypeScript)
│   ├── canvas/            # Mobile canvas engine (Konva.js)
│   ├── audio/             # Audio engine wrapper
│   └── studio/            # Main mobile app
│
├── apps/                  # Example applications
│   ├── demo-mobile/       # PWA demo app
│   └── docs/              # Documentation site
│
├── rust-workspace/        # Rust/WASM modules
│   └── crates/
│       ├── audio-processor/    # MP3 encoding (20-50x faster)
│       ├── video-processor/    # Video metadata, thumbnails
│       └── timeline-engine/    # Interval tree, binary serialization
│
├── tooling/               # Shared configs
│   ├── tsconfig/          # TypeScript configs
│   └── biome-config/      # Biome configs
│
└── .changeset/            # Version management

```

---

## 🚀 Quick Start

### Prerequisites

```bash
node -v  # v20.0.0+
pnpm -v  # 9.0.0+
rustc --version  # 1.75.0+
wasm-pack --version  # 0.12.0+
```

### Installation

```bash
cd helix

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development
pnpm dev
```

---

## 🛠️ Development

### Commands

```bash
# Build
pnpm build              # All packages
pnpm build:wasm         # Rust/WASM only

# Development
pnpm dev                # Start dev server
pnpm test               # Run tests
pnpm test:watch         # Watch mode

# Code Quality
pnpm check              # Biome check (lint + format)
pnpm check:fix          # Auto-fix issues
pnpm typecheck          # TypeScript check

# Versioning
pnpm changeset          # Create changeset
pnpm version-packages   # Bump versions
pnpm release            # Publish to NPM
```

### Workspace Structure

This is a **temporary workspace** for development. Key differences from Twick:

| Aspect | Twick | Helix |
|--------|-------|-------|
| **Target** | Desktop-first | Mobile-first |
| **Bundle Size** | ~500KB+ | Target < 200KB (code-split) |
| **Linter** | ESLint + Prettier | Biome (10-100x faster) |
| **Canvas** | Fabric.js (~200KB) | Konva.js (~50KB) |
| **Audio** | lamejs (JS) | Rust/WASM (20-50x faster) |
| **Touch** | Mouse events | Touch gestures + haptics |
| **Offline** | None | PWA + Service Workers |

---

## 📦 Packages

### `@helix/core` - Core Utilities
**Status**: 🔄 In Development  
Lightweight utilities, types, constants. Zero dependencies.

### `@helix/ui` - UI Components
**Status**: ⏳ Planned  
Headless, accessible components with Radix UI. Mobile-optimized touch targets.

### `@helix/timeline` - Timeline Engine
**Status**: ⏳ Planned  
Multi-track timeline with Visitor pattern. Reuses Twick architecture.

### `@helix/canvas` - Mobile Canvas
**Status**: ⏳ Planned  
Konva.js-based canvas with touch gestures (@use-gesture).

### `@helix/audio` - Audio Engine
**Status**: ⏳ Planned  
TypeScript wrapper for Rust/WASM audio processor.

### `@helix/studio` - Mobile Studio
**Status**: ⏳ Planned  
Main mobile app with CapCut-inspired UI.

---

## 🦀 Rust/WASM

### Audio Processor
- **MP3 Encoding**: 20-50x faster than lamejs
- **Resampling**: High-quality audio resampling
- **Mixing**: Multi-track audio mixing

### Video Processor
- **Metadata**: Fast video metadata extraction
- **Thumbnails**: Efficient thumbnail generation
- **Frame Extraction**: Extract frames for preview

### Timeline Engine
- **Interval Tree**: O(log n) collision detection
- **Binary Serialization**: 10-50x faster than JSON

---

## 🎯 Development Roadmap

- [x] **Phase 0**: Workspace setup (Week 1)
  - [x] Initialize monorepo structure
  - [x] Setup Biome, Turbo, Changesets
  - [x] Configure TypeScript
  - [ ] Create @helix/core package
  - [ ] Setup Rust workspace

- [ ] **Phase 1**: Foundation (Week 2-4)
  - [ ] Design system & theme engine
  - [ ] Mobile UI framework
  - [ ] Rust/WASM audio processor

- [ ] **Phase 2**: Core Features (Week 5-10)
  - [ ] Timeline engine
  - [ ] Canvas & media handling
  - [ ] Audio system

- [ ] **Phase 3**: Advanced (Week 11-14)
  - [ ] Effects & animations
  - [ ] Export & PWA

---

## 📚 Key Technologies

- **React 19** - Auto-optimizing compiler
- **TypeScript 5.6** - Strict type safety
- **Rust + WASM** - High-performance processing
- **Biome** - All-in-one linting/formatting
- **Turborepo** - Build orchestration
- **Konva.js** - Lightweight canvas (50KB vs Fabric 200KB)
- **Zustand** - Minimal state management
- **Stitches** - Zero-runtime CSS-in-JS

---

## 📖 Documentation

- **Main Plan**: `../MOBILE_VIDEO_EDITOR_PLAN.md`
- **Setup Guide**: `../HELIX_SETUP_GUIDE.md`
- **Twick Docs**: `../packages/documentation/`

---

**Built with ❤️ for mobile-first video editing**
