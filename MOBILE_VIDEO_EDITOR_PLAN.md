# 📱 HELIX - MOBILE VIDEO EDITOR
## KẾ HOẠCH PHÁT TRIỂN CHI TIẾT

> **Tên Dự Án**: Helix - Mobile-First Video Editor SDK  
> **Scope**: @helix (NPM organization)  
> **Repository**: https://github.com/locT-581/helix.git  
> **Ngày tạo**: 16/11/2025  
> **Tác giả**: Development Team  
> **Stack**: React 19 + Rust/WASM + Biome + Turbo + Changesets

---

## ⚠️ QUAN TRỌNG - GIT WORKFLOW

### Repository Structure
**CRITICAL**: Thư mục `helix/` là **thư mục gốc (root)** của repository này:
- ✅ Repository: https://github.com/locT-581/helix.git
- ✅ Root directory: `/helix` (NOT a subdirectory of twick)
- ✅ Đây là project **hoàn toàn độc lập**, KHÔNG liên quan gì đến `twick`
- ✅ Mọi thay đổi code PHẢI được commit và push lên GitHub
- ❌ KHÔNG bao giờ reference code từ `twick` codebase

### Professional Git Workflow (BẮT BUỘC)

#### 1. Branch Strategy
```bash
# Feature branches - tính năng mới
git checkout -b feature/timeline-editor
git checkout -b feature/audio-wasm-processor

# Bug fixes - sửa lỗi
git checkout -b fix/webgl-context-error
git checkout -b fix/touch-event-handling

# Performance - tối ưu hiệu năng
git checkout -b perf/canvas-rendering
git checkout -b perf/wasm-audio-encoding

# Documentation - tài liệu
git checkout -b docs/api-reference
git checkout -b docs/getting-started

# Refactoring - tái cấu trúc code
git checkout -b refactor/player-hooks
```

#### 2. Commit Message Convention (Conventional Commits)
**Format**: `<type>(<scope>): <subject>`

**Types**:
- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `perf`: Cải thiện hiệu năng
- `refactor`: Tái cấu trúc code
- `docs`: Cập nhật tài liệu
- `test`: Thêm/sửa tests
- `chore`: Công việc maintenance (deps, config)
- `style`: Code formatting
- `ci`: CI/CD changes

**Scopes**: `core`, `timeline`, `canvas`, `player`, `studio`, `wasm`, `deps`

**Examples**:
```bash
git commit -m "feat(core): add video preset constants for mobile devices"
git commit -m "fix(wasm): resolve audio encoding memory leak on iOS"
git commit -m "perf(timeline): optimize collision detection with interval tree"
git commit -m "docs(core): add JSDoc comments for device capabilities API"
git commit -m "test(utils): add unit tests for time formatting utilities"
git commit -m "refactor(player): extract playback logic to useVideoPlayer hook"
git commit -m "chore(deps): upgrade vite to 6.4.1"
```

#### 3. Development Workflow (Quy Trình Làm Việc)

**Bước 1: Tạo feature branch**
```bash
cd /path/to/helix  # Chắc chắn đang ở thư mục helix
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

**Bước 2: Phát triển và commit thường xuyên**
```bash
# Thực hiện thay đổi...
pnpm build        # Kiểm tra build
pnpm test         # Chạy tests
pnpm check        # Lint & format

# Commit (commit nhỏ, thường xuyên)
git add .
git commit -m "feat(scope): implement X"

# Tiếp tục phát triển...
git add .
git commit -m "test(scope): add unit tests for X"
```

**Bước 3: Giữ branch cập nhật với main**
```bash
git fetch origin
git rebase origin/main  # Rebase (ưu tiên) hoặc merge
```

**Bước 4: Push lên GitHub**
```bash
git push origin feature/your-feature-name

# Nếu đã rebase:
git push origin feature/your-feature-name --force-with-lease
```

**Bước 5: Tạo Pull Request**
- Vào GitHub: https://github.com/locT-581/helix
- Tạo Pull Request từ `feature/your-feature-name` → `main`
- Thêm mô tả chi tiết, reference issues nếu có (#123)
- Request code review (nếu làm team)
- Đảm bảo CI/CD pass (khi có)

**Bước 6: Merge và cleanup**
```bash
# Sau khi PR được approve và merge:
git checkout main
git pull origin main
git branch -d feature/your-feature-name  # Xóa local branch
git push origin --delete feature/your-feature-name  # Xóa remote branch
```

#### 4. Versioning với Changesets

**Mỗi khi có thay đổi user-facing**:
```bash
# 1. Tạo changeset
pnpm changeset

# Chọn packages thay đổi (ví dụ: @helix/core)
# Chọn loại version bump:
#   - major: Breaking changes (1.0.0 → 2.0.0)
#   - minor: New features (1.0.0 → 1.1.0)  
#   - patch: Bug fixes (1.0.0 → 1.0.1)
# Viết changelog entry (mô tả ngắn gọn cho users)

# 2. Commit changeset
git add .changeset/*.md
git commit -m "chore(changeset): add changeset for feature X"

# 3. Push cùng feature branch
git push origin feature/your-feature-name
```

**Release (maintainers only)**:
```bash
# Bump versions
pnpm changeset:version
git add .
git commit -m "chore(release): version packages"

# Publish to npm
pnpm changeset:release
git push origin main --follow-tags
```

#### 5. Code Review Checklist

**Trước khi tạo PR, kiểm tra**:
- ✅ `pnpm build` - Build thành công (all packages)
- ✅ `pnpm test` - Tests pass (coverage > 80%)
- ✅ `pnpm check` - Biome lint/format pass
- ✅ TypeScript compile không lỗi
- ✅ Changeset created (nếu user-facing changes)
- ✅ Documentation updated (README, JSDoc)
- ✅ No `console.log` statements
- ✅ No commented-out code
- ✅ Follows naming conventions (arrow functions, PascalCase classes)
- ✅ No references to `twick` codebase

**PR Description Template**:
```markdown
## What
Brief description of changes

## Why
Reason for this change

## How
Implementation details

## Testing
How to test the changes

## Checklist
- [ ] Tests added/updated
- [ ] Docs updated
- [ ] Changeset created
- [ ] No breaking changes (or documented)
```

---

## 📋 MỤC LỤC

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Phân Tích Hiện Trạng](#2-phân-tích-hiện-trạng)
3. [Tên Dự Án: Helix](#3-tên-dự-án-helix)
4. [Kiến Trúc Tổng Thể](#4-kiến-trúc-tổng-thể)
5. [Chi Tiết Kỹ Thuật](#5-chi-tiết-kỹ-thuật)
6. [Roadmap Triển Khai](#6-roadmap-triển-khai)
7. [Checklist Chi Tiết](#7-checklist-chi-tiết)

---

## 1. TỔNG QUAN DỰ ÁN

### 1.1 Mục Tiêu

Phát triển một video editor SDK mới với những cải tiến đột phá:

- ✅ **Mobile-First**: Tối ưu hóa trải nghiệm trên thiết bị di động
- ✅ **High Performance**: Tích hợp Rust/WASM để tăng tốc xử lý
- ✅ **Highly Customizable**: Hệ thống theming và styling linh hoạt
- ✅ **Modern Architecture**: Áp dụng các pattern và công nghệ mới nhất

### 1.2 Phạm Vi Dự Án

#### **In Scope:**
- Rebuild toàn bộ UI/UX cho mobile
- Tích hợp Rust modules cho audio/video processing
- Design system mới với theme engine
- Touch-optimized interactions
- Offline-first architecture
- Progressive Web App (PWA) capabilities

#### **Out of Scope (Phase 1):**
- Desktop-only features
- Legacy browser support (< 2 years)
- Real-time collaboration
- Cloud rendering service

### 1.3 Target Audience

- 📱 Mobile app developers (React Native, Flutter integration)
- 🎨 Content creators sử dụng mobile
- 🛠️ Platform builders cần embeddable video editor
- 🚀 Startups building social/content apps

---

## 2. PHÂN TÍCH REACT 19 VS SOLIDJS

### 2.1 Kết Luận: React 19 Chiến Thắng

**Điểm số tổng**: React 19 (140 điểm) vs SolidJS (25 điểm)

**Lý do chính**:
1. **Ecosystem**: React có thư viện mobile libraries phong phú (React Native, Capacitor)
2. **Team Productivity**: Không cần học framework mới, giảm learning curve
3. **Migration Cost**: Helix sẽ tái sử dụng patterns từ Twick (Visitor, Context)
4. **React 19 Compiler**: Auto-optimization, không cần manual memoization
5. **Community**: Lớn hơn 20x, nhiều resources hơn cho mobile development

### 2.2 React 19 Features Sử Dụng

- **React Compiler**: Auto-memoization, tối ưu re-renders
- **Actions**: Form handling, async state management
- **use() hook**: Async data fetching
- **Suspense improvements**: Better loading states
- **ref as prop**: Cleaner ref forwarding

---

## 3. TÊN DỰ ÁN: HELIX

### 3.1 Ý Nghĩa

**Helix** (chuỗi xoắn kép DNA):
- ✨ **Innovation**: Twist/spiral - sự xoắn vặn, đổi mới
- 🧬 **Structure**: Double helix - cấu trúc vững chắc, có tổ chức
- 🔄 **Evolution**: DNA - tiến hóa, phát triển liên tục
- 🎯 **Mobile DNA**: Core essence của mobile video editing

### 3.2 Branding

- **Package Scope**: `@helix/*`
- **GitHub Org**: `helix-video-editor` (hoặc `helix-sdk`)
- **Domain**: `helix-editor.dev` (available)
- **Colors**: Purple gradient (#7C3AED → #06B6D4) - modern, tech
- **Tagline**: "Mobile-first video editing, evolved."

---

## 4. KIẾN TRÚC TỔNG THỂ

### 4.1 Monorepo Structure

```
helix/
├── .github/
│   ├── copilot-instructions.md       # AI coding guidelines
│   └── workflows/                    # CI/CD pipelines
├── packages/
│   ├── core/                         # ✅ DONE - Zero-dependency foundation
│   │   ├── src/
│   │   │   ├── types/               # TypeScript definitions
│   │   │   ├── constants/           # BREAKPOINTS, TOUCH_TARGET, etc.
│   │   │   ├── utils/               # Device detection, formatters
│   │   │   └── index.ts
│   │   ├── dist/                    # Built files (4 files, 7.5KB)
│   │   └── package.json             # v0.0.0, zero dependencies
│   ├── timeline/                    # Timeline management
│   ├── canvas/                      # Konva.js canvas rendering
│   ├── player/                      # Video playback
│   ├── studio/                      # Main editor UI
│   └── wasm-*/                      # WASM wrapper packages
├── rust-workspace/                  # ✅ CONFIGURED
│   ├── Cargo.toml                   # Workspace config
│   └── crates/
│       ├── audio-processor/         # ✅ Fade in/out implemented
│       ├── video-processor/         # TODO
│       └── timeline-engine/         # TODO
├── apps/
│   ├── docs/                        # Docusaurus docs site
│   └── examples/                    # Demo applications
├── tooling/
│   ├── biome-config/                # Shared Biome config
│   └── typescript-config/           # Shared tsconfig
├── MOBILE_VIDEO_EDITOR_PLAN.md      # This file
├── package.json                     # Root workspace
├── pnpm-workspace.yaml
├── turbo.json
├── biome.jsonc
└── tsconfig.base.json
```

### 4.2 Package Dependencies

```
@helix/core (zero dependencies)
    ↓
@helix/timeline, @helix/canvas, @helix/wasm-audio
    ↓
@helix/player (depends on timeline)
    ↓
@helix/studio (depends on all above)
```

### 4.3 Technology Stack

**Frontend:**
- React 19 (with Compiler for auto-optimization)
- TypeScript 5.9+ (strict mode, exactOptionalPropertyTypes)
- Stitches CSS-in-JS (design system)
- Konva.js (canvas rendering, lighter than Fabric.js)
- Radix UI (accessible primitives)

**Build Tools:**
- Vite 6.4+ (fast builds, HMR)
- Turborepo 2.6+ (monorepo orchestration, caching)
- pnpm 9.0+ (fast, disk-efficient)
- Biome 1.9+ (10-100x faster than ESLint+Prettier)

**Testing:**
- Vitest 2.1+ (fast, Vite-powered)
- Testing Library (component testing)
- Playwright (E2E - future)

**Performance:**
- Rust/WASM (audio/video processing)
- Web Workers (heavy computations)
- IndexedDB (offline storage)
- Service Workers (PWA)

**DevOps:**
- Changesets (versioning, changelogs)
- GitHub Actions (CI/CD)
- Chromatic (Storybook deployment)

---

## 5. CHI TIẾT KỸ THUẬT

### 5.1 @helix/core Package (✅ COMPLETED)

**Status**: Built & Tested
- 📦 Size: 7.5KB (uncompressed), ~3KB (gzipped)
- ✅ Zero external dependencies
- ✅ 17 unit tests passing
- ✅ TypeScript declarations generated

**Exports**:
```typescript
// Types
export type {
  Size, Position, Point,
  VideoElement, AudioElement, TextElement,
  DeviceCapabilities, Theme, ColorScheme
} from './types';

// Constants
export {
  BREAKPOINTS,      // 320px → 905px
  TOUCH_TARGET,     // 44-60px (WCAG AAA)
  VIDEO_PRESET,     // Vertical HD, Square, Horizontal
  AUDIO,            // 48kHz sample rate
  PERFORMANCE       // 60fps targets, debounce/throttle timings
} from './constants';

// Utilities
export {
  generateId,              // Unique ID generation
  clamp, lerp, mapRange,   // Math utilities
  formatTime,              // 0:00 or 1:23:45
  formatFileSize,          // 1.5 MB
  debounce, throttle,      // Performance utilities
  fitSize,                 // Aspect ratio calculation
  detectDeviceCapabilities // Mobile/tablet/desktop detection
} from './utils';
```

### 5.2 Mobile-First Constants

**BREAKPOINTS** (Mobile-first design):
```typescript
export const BREAKPOINTS = {
  MOBILE_SM: 320,   // iPhone SE
  MOBILE_MD: 375,   // iPhone 12/13/14
  MOBILE_LG: 428,   // iPhone 14 Pro Max
  TABLET_SM: 768,   // iPad Mini
  TABLET_LG: 905,   // iPad Pro 11"
  DESKTOP: 1024     // Fallback for desktop
} as const;
```

**TOUCH_TARGET** (WCAG AAA compliance):
```typescript
export const TOUCH_TARGET = {
  MIN: 44,          // WCAG 2.1 Level AAA minimum
  COMFORTABLE: 48,  // Comfortable size
  LARGE: 60         // Large buttons
} as const;
```

**VIDEO_PRESET** (Mobile-optimized):
```typescript
export const VIDEO_PRESET = {
  VERTICAL_HD: { width: 720, height: 1280 },    // 9:16 (Stories, Reels)
  SQUARE: { width: 1080, height: 1080 },        // 1:1 (Instagram posts)
  HORIZONTAL_HD: { width: 1280, height: 720 }   // 16:9 (YouTube)
} as const;
```

**PERFORMANCE** (60fps target):
```typescript
export const PERFORMANCE = {
  TARGET_FPS: 60,
  FRAME_TIME: 16,           // 1000ms / 60fps
  DEBOUNCE_DELAY: 150,      // User input debounce
  THROTTLE_DELAY: 16,       // Scroll/resize throttle (60fps)
  IDLE_TIMEOUT: 3000,       // Idle detection
  CACHE_DURATION: 86400000  // 24 hours
} as const;
```

### 5.3 Design System (Week 2 - TODO)

**Theme Tokens**:
```typescript
// colors.ts
export const colors = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    // ... 200-900
  },
  primary: {
    50: '#faf5ff',
    500: '#7C3AED',  // Purple
    900: '#581c87'
  },
  secondary: {
    50: '#ecfeff',
    500: '#06B6D4',  // Cyan
    900: '#164e63'
  },
  // semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6'
};

// spacing.ts (4px base unit)
export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  // ... up to 16 (64px)
};

// typography.ts
export const fontSize = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem'  // 36px
};
```

### 5.4 Rust/WASM Modules (Week 3+ - TODO)

**audio-processor** (✅ Partially done):
```rust
// Current: Fade in/out implemented
pub fn apply_fade_in(samples: &mut [f32], duration_ms: u32, sample_rate: u32);
pub fn apply_fade_out(samples: &mut [f32], duration_ms: u32, sample_rate: u32);

// TODO:
pub fn encode_mp3(samples: &[f32], sample_rate: u32) -> Vec<u8>;
pub fn resample_audio(samples: &[f32], from_rate: u32, to_rate: u32) -> Vec<f32>;
pub fn mix_tracks(tracks: Vec<&[f32]>, volumes: Vec<f32>) -> Vec<f32>;
```

**Performance Target**: 20-50x faster than JavaScript (lamejs)

---

## 6. ROADMAP TRIỂN KHAI

### Week 1: Foundation (✅ COMPLETED - Nov 16, 2025)

**Setup**:
- ✅ Monorepo structure (pnpm + Turbo + Biome)
- ✅ TypeScript strict config
- ✅ Changesets for versioning
- ✅ VSCode settings with Biome formatter
- ✅ Git repository: https://github.com/locT-581/helix.git

**@helix/core Package**:
- ✅ Types: 200+ lines (Size, Position, Elements, DeviceCapabilities, Theme)
- ✅ Constants: 150+ lines (BREAKPOINTS, TOUCH_TARGET, VIDEO_PRESET, AUDIO, PERFORMANCE)
- ✅ Utils: 180+ lines (generateId, formatters, math, debounce/throttle, device detection)
- ✅ Build: vite.config.ts with dts plugin
- ✅ Tests: 17 passing (formatTime, formatFileSize, clamp, lerp, debounce, throttle, fitSize)
- ✅ Zero dependencies confirmed

**Rust Workspace**:
- ✅ Cargo.toml configured
- ✅ Dependencies: mp3lame-encoder, rubato, symphonia, wasm-bindgen
- ✅ audio-processor crate with fade in/out

**Git Workflow**:
- ✅ Initial commit pushed to GitHub
- ✅ Professional commit message format established
- ✅ `.github/copilot-instructions.md` created with full guidelines

### Week 2: Design System (TODO - Nov 17-23, 2025)

**Stitches Setup**:
- [ ] Install `@stitches/react`
- [ ] Create `stitches.config.ts` with theme tokens
- [ ] Color system (neutral 50-900, primary, secondary, semantic)
- [ ] Spacing scale (1-16, 4px base)
- [ ] Typography scale (xs-4xl)
- [ ] Border radii (sm, md, lg, full)
- [ ] Shadow system (sm, md, lg)
- [ ] Dark theme (`createTheme`)
- [ ] Responsive utilities

**Primitive Components**:
- [ ] Button (variants: primary/secondary/ghost, sizes: sm/md/lg)
- [ ] Input (text, number, search with states)
- [ ] Select (Radix UI, mobile bottom sheet)
- [ ] Modal/Dialog (Radix UI with blur overlay)
- [ ] Sheet (bottom drawer for mobile)
- [ ] Slider (Radix UI, large touch target)
- [ ] Switch/Toggle (Radix UI)
- [ ] Icon (Lucide React integration)

**Layout Components**:
- [ ] Stack (Flexbox wrapper)
- [ ] Grid
- [ ] Container (max-width)
- [ ] Spacer

**Storybook**:
- [ ] Install Storybook 8
- [ ] Configure for Vite + React
- [ ] Stories for all components
- [ ] Deploy to Chromatic/Netlify

### Week 3-4: Rust/WASM (TODO - Nov 24 - Dec 7, 2025)

**WASM Build**:
- [ ] Install wasm-pack
- [ ] Configure wasm-bindgen
- [ ] Build audio-processor to WASM
- [ ] Create TypeScript wrapper package
- [ ] Add feature detection & fallback

**Audio Features**:
- [ ] MP3 encoding (replace lamejs)
- [ ] Audio resampling
- [ ] Multi-track mixing
- [ ] Volume normalization
- [ ] Audio effects (fade, reverb, etc.)

**Performance Tests**:
- [ ] Benchmark JS vs WASM encoding
- [ ] Memory profiling
- [ ] Mobile device testing (iOS/Android)

### Week 5-8: Timeline Package (TODO - Dec 8, 2025 - Jan 4, 2026)

**Core Timeline**:
- [ ] Element types (Video, Audio, Text, Image)
- [ ] Track management
- [ ] Visitor pattern for operations
- [ ] Undo/Redo with history
- [ ] Collision detection (interval tree)
- [ ] Duration calculations

**UI Components**:
- [ ] Timeline ruler (time markers)
- [ ] Track lanes (draggable)
- [ ] Playhead with scrubbing
- [ ] Element cards (resizable)
- [ ] Mobile-optimized gestures (pinch zoom, pan)

### Week 9-12: Canvas & Player (TODO - Jan 5 - Feb 1, 2026)

**Canvas Package**:
- [ ] Konva.js integration
- [ ] Element rendering (video, image, text, shapes)
- [ ] Transform controls (touch-optimized)
- [ ] Animations (position, scale, rotation, opacity)
- [ ] Effects (filters, masks, blending)

**Player Package**:
- [ ] Video synchronization
- [ ] Playback controls (play/pause/seek)
- [ ] Preview generation
- [ ] Real-time updates

### Week 13-15: Studio & Export (TODO - Feb 2-22, 2026)

**Studio App**:
- [ ] Editor layout (mobile-first)
- [ ] Tool panels (properties, effects, audio)
- [ ] Asset library (media management)
- [ ] Project persistence (IndexedDB)
- [ ] Keyboard shortcuts (desktop)

**Export**:
- [ ] WebCodecs API integration
- [ ] MediaRecorder fallback
- [ ] Progress tracking
- [ ] Quality presets

### Week 16: Launch (TODO - Feb 23-29, 2026)

**Documentation**:
- [ ] Docusaurus site
- [ ] Getting started guide
- [ ] API reference
- [ ] Component gallery

**Examples**:
- [ ] Basic editor demo
- [ ] React Native example
- [ ] PWA demo

**Publishing**:
- [ ] Version packages (v1.0.0)
- [ ] Publish to NPM
- [ ] GitHub releases
- [ ] Announce launch

---

## 7. CHECKLIST CHI TIẾT

### Week 1: Foundation (✅ COMPLETED)

**Setup:**
- [x] ✅ Create helix workspace (monorepo setup)
- [x] ✅ Configure pnpm workspace (pnpm-workspace.yaml)
- [x] ✅ Configure Turbo (turbo.json with build/lint/test tasks)
- [x] ✅ Configure Biome (biome.jsonc with strict rules)
- [x] ✅ Configure TypeScript base (tsconfig.base.json with exactOptionalPropertyTypes)
- [x] ✅ Configure Changesets (.changeset/config.json)
- [x] ✅ Configure VSCode settings (.vscode/settings.json with Biome)
- [x] ✅ Verify `pnpm install` works (276 packages installed)
- [x] ✅ Test `pnpm build` across all packages (@helix/core built successfully)
- [x] ✅ Test `pnpm check` (Biome linting - tsconfig comments issue noted)

**Core Package (@helix/core):**
- [x] ✅ Create package structure (src/types, src/constants, src/utils)
- [x] ✅ Define TypeScript types (200+ lines: Size, Position, Elements, DeviceCapabilities, Theme)
- [x] ✅ Define constants (150+ lines: BREAKPOINTS, TOUCH_TARGET, VIDEO_PRESET, AUDIO, PERFORMANCE)
- [x] ✅ Implement utilities (180+ lines: generateId, formatters, debounce/throttle, device detection)
- [x] ✅ Write unit tests (17 passed, 4 skipped browser-only tests)
- [x] ✅ Configure Vite build (vite.config.ts with dts plugin)
- [x] ✅ Export types/constants/utils (src/index.ts)
- [x] ✅ Generate TypeScript declarations (dist/*.d.ts)
- [x] ✅ Verify zero external dependencies (only devDependencies)
- [x] ✅ Build package successfully (4 files: index.js, types.js, constants.js, utils.js)

**Rust Workspace:**
- [x] ✅ Create Cargo workspace (rust-workspace/Cargo.toml)
- [x] ✅ Add audio dependencies (mp3lame-encoder, rubato, symphonia)
- [x] ✅ Add WASM dependencies (wasm-bindgen)
- [x] ✅ Create audio-processor crate (basic structure)
- [x] ✅ Implement fade in/out (completed)
- [ ] Create video-processor crate
- [ ] Create timeline-engine crate
- [ ] Write Rust integration tests
- [ ] Build WASM modules with wasm-pack
- [ ] Create TypeScript wrapper packages

**Git & GitHub:**
- [x] ✅ Initialize new Git repository (clean, no twick history)
- [x] ✅ Initial commit with professional message
- [x] ✅ Add remote: https://github.com/locT-581/helix.git
- [x] ✅ Push to GitHub main branch
- [x] ✅ Create `.github/copilot-instructions.md` with Git workflow guidelines
- [x] ✅ Update `MOBILE_VIDEO_EDITOR_PLAN.md` with Git workflow section

**Minor Issues:**
- ⚠️ Biome check fails on `tsconfig.base.json` (JSON doesn't support comments)
  - Not blocking - TypeScript compiler works fine
  - Can ignore or rename to `tsconfig.base.jsonc`

### Week 2: Design System (TODO)

**Stitches Setup:**
- [ ] Install `@stitches/react`
- [ ] Create `stitches.config.ts`
- [ ] Define color tokens (neutral, primary, secondary, functional)
- [ ] Define spacing scale (1-16)
- [ ] Define typography scale (xs-4xl)
- [ ] Define border radii (sm-full)
- [ ] Define shadows (sm, md, lg)
- [ ] Create dark theme (`createTheme`)
- [ ] Add responsive media queries
- [ ] Add utility functions (p, m, size, etc.)

**Primitive Components:**
- [ ] Button (variants, sizes, states, loading, icon support)
- [ ] Input (text, number, search, states, label, error message)
- [ ] Select/Dropdown (Radix UI, mobile bottom sheet)
- [ ] Modal/Dialog (Radix UI, overlay, trap focus)
- [ ] Sheet (bottom drawer, drag handle, swipe dismiss)
- [ ] Slider (Radix UI, large touch target, value label)
- [ ] Switch/Toggle (Radix UI, smooth animation)
- [ ] Icon (Lucide React, size variants, color support)

**Layout Components:**
- [ ] Stack (Flexbox wrapper)
- [ ] Grid
- [ ] Container (max-width wrapper)
- [ ] Spacer

**Storybook:**
- [ ] Install Storybook 8
- [ ] Configure for Vite + React
- [ ] Add Stitches addon
- [ ] Create stories for all components
- [ ] Deploy Storybook (Chromatic/Netlify)

---

## 8. METRICS & SUCCESS CRITERIA

### 8.1 Performance Targets

**Bundle Size:**
- Initial load: < 200KB (gzipped)
- WASM modules: < 500KB total
- Total app size: < 2MB

**Runtime Performance:**
- Time to interactive: < 3s (3G)
- Timeline rendering: 60fps with 1000+ elements
- Canvas rendering: 60fps with 50+ objects
- WASM audio encoding: 20-50x faster than JS
- Export speed: Real-time or faster (1080p)

**Lighthouse Scores:**
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
- PWA: 100

### 8.2 Quality Targets

**Test Coverage:**
- Unit tests: > 80% (Currently: 17 tests passing in @helix/core)
- Integration tests: Critical paths covered
- E2E tests: Main user flows covered

**Browser Support:**
- Chrome/Edge: 100% features
- Safari: 100% features
- Firefox: 90%+ features (no WebCodecs)

**Device Support:**
- iOS 14+: Full support
- Android 10+: Full support
- Tablets: Optimized layout

### 8.3 Adoption Metrics

**NPM:**
- Downloads: Track weekly
- GitHub Stars: Monitor growth
- Issues: Response time < 24h

**Community:**
- Documentation views
- Demo app visits
- Social engagement
- Community contributions

---

## 9. RISKS & MITIGATION

### 9.1 Technical Risks

**Risk: WebCodecs API Limited Support**
- **Impact**: Export may not work in Firefox
- **Mitigation**: 
  - Use MediaRecorder API fallback
  - Document browser limitations
  - Consider server-side export (future)

**Risk: WASM Performance on Low-End Devices**
- **Impact**: Slow processing on old phones
- **Mitigation**:
  - Graceful degradation to JS
  - Show performance warnings
  - Optimize WASM (SIMD, threading)

**Risk: Mobile Storage Limits**
- **Impact**: Users run out of storage
- **Mitigation**:
  - Quota warnings
  - Cleanup unused assets
  - Cloud sync (future)

### 9.2 Timeline Risks

**Risk: Feature Creep**
- **Impact**: Delays launch
- **Mitigation**:
  - Strict scope for v1.0
  - Backlog for future versions
  - Regular sprint reviews

**Risk: Underestimated Complexity**
- **Impact**: Timeline slips
- **Mitigation**:
  - Buffer time in schedule (2 weeks)
  - Prioritize MVP features
  - Cut non-essential features

### 9.3 Market Risks

**Risk: Competition (CapCut, etc.)**
- **Impact**: Lower adoption
- **Mitigation**:
  - Focus on customizability (USP)
  - Target developers (not end-users)
  - Emphasize open-source / embeddability

**Risk: Limited User Feedback**
- **Impact**: Wrong feature priorities
- **Mitigation**:
  - Early beta program
  - User interviews
  - Analytics tracking

---

## 10. NEXT STEPS

### Immediate Actions (Week 2):
1. ✅ Git workflow established & documented
2. ✅ Code pushed to GitHub: https://github.com/locT-581/helix.git
3. [ ] Install Stitches CSS-in-JS
4. [ ] Create theme tokens
5. [ ] Build first primitive components (Button, Input)
6. [ ] Setup Storybook

### Team Setup:
- **Frontend Developer**: Mobile UI, React components, design system
- **Backend/Rust Developer**: WASM modules, performance optimization
- **Designer**: UI/UX, mobile design, branding, Storybook
- **QA Engineer**: Testing, device testing, E2E automation

### Communication:
- **Daily Standups**: Progress updates (async via chat)
- **Weekly Sprint Planning**: Review priorities, adjust roadmap
- **Bi-weekly Demos**: Show progress to stakeholders
- **Retrospectives**: Learn & improve workflow

### Git Best Practices Reminder:
- ✅ Create feature branches for all work
- ✅ Use conventional commit messages
- ✅ Commit frequently (small, logical changes)
- ✅ Push to GitHub regularly (backup & collaboration)
- ✅ Create PRs for code review
- ✅ Create changesets for versioning
- ✅ Keep main branch stable

---

**Document Version**: 2.0  
**Last Updated**: November 16, 2025  
**Status**: Week 1 Complete ✅ | Week 2 Starting 🚀  
**Repository**: https://github.com/locT-581/helix.git
