/**
 * @helix/core - Constants
 *
 * Mobile-optimized constants for Helix video editor.
 * Lightweight, zero dependencies.
 */

/**
 * Element type constants (aligned with ElementType)
 */
export const ELEMENT_TYPE = {
  VIDEO: 'video',
  AUDIO: 'audio',
  IMAGE: 'image',
  TEXT: 'text',
  CAPTION: 'caption',
  RECT: 'rect',
  CIRCLE: 'circle',
  ICON: 'icon',
} as const;

/**
 * Track type constants
 */
export const TRACK_TYPE = {
  VIDEO: 'video',
  AUDIO: 'audio',
  OVERLAY: 'overlay',
} as const;

/**
 * Mobile breakpoints (mobile-first approach)
 */
export const BREAKPOINTS = {
  MOBILE_SM: 320, // Small phones
  MOBILE: 375, // Standard phones
  MOBILE_LG: 428, // Large phones
  TABLET: 600, // Tablets
  TABLET_LG: 768, // Large tablets
  DESKTOP: 905, // Desktop (optional enhancement)
} as const;

/**
 * Touch target sizes (WCAG AAA compliance)
 */
export const TOUCH_TARGET = {
  MIN: 44, // Minimum tap target
  RECOMMENDED: 48, // Recommended size
  TIMELINE_ELEMENT: 60, // Timeline element height
  MODAL_HANDLE: 40, // Bottom sheet handle
} as const;

/**
 * Timeline constants (mobile-optimized)
 */
export const TIMELINE = {
  MIN_ZOOM: 0.1, // 10% zoom
  MAX_ZOOM: 10.0, // 1000% zoom
  DEFAULT_ZOOM: 1.0,
  SNAP_THRESHOLD: 0.1, // Seconds for magnetic snapping
  MIN_ELEMENT_DURATION: 0.1, // Minimum 100ms
  TIMELINE_HEIGHT: 120, // Mobile timeline height
  TRACK_HEIGHT: 60, // Single track height
  PLAYHEAD_WIDTH: 2, // Playhead line width
} as const;

/**
 * Video encoding presets (mobile-optimized)
 */
export const VIDEO_PRESET = {
  // Vertical (Stories, Reels, TikTok)
  VERTICAL_HD: { width: 720, height: 1280, fps: 30 },
  VERTICAL_FHD: { width: 1080, height: 1920, fps: 30 },

  // Square (Instagram posts)
  SQUARE_SD: { width: 640, height: 640, fps: 30 },
  SQUARE_HD: { width: 1080, height: 1080, fps: 30 },

  // Horizontal (YouTube, landscape)
  HORIZONTAL_HD: { width: 1280, height: 720, fps: 30 },
  HORIZONTAL_FHD: { width: 1920, height: 1080, fps: 30 },
} as const;

/**
 * Audio constants
 */
export const AUDIO = {
  SAMPLE_RATE: 48000, // High quality for mobile
  SAMPLE_RATE_LOW: 44100, // Fallback
  CHANNELS: 2, // Stereo
  MIN_VOLUME: 0,
  MAX_VOLUME: 1,
  DEFAULT_VOLUME: 0.8,
  DEFAULT_FADE: 0.5, // 500ms default fade
} as const;

/**
 * Storage limits (mobile-aware)
 */
export const STORAGE = {
  QUOTA_WARNING: 0.8, // Warn at 80% quota
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB per file (mobile limit)
  MAX_PROJECT_SIZE: 500 * 1024 * 1024, // 500MB total project
  CACHE_SIZE: 50 * 1024 * 1024, // 50MB cache
} as const;

/**
 * Performance thresholds (mobile-focused)
 */
export const PERFORMANCE = {
  TARGET_FPS: 60,
  LOW_END_FPS: 30,
  MAX_TIMELINE_ELEMENTS: 100, // Soft limit for mobile
  DEBOUNCE_DELAY: 150, // ms for user input
  THROTTLE_DELAY: 16, // ~60fps for scroll/drag
  RENDER_BATCH_SIZE: 10, // Virtual scrolling batch
} as const;

/**
 * Error codes
 */
export const ERROR_CODE = {
  MEDIA_LOAD_ERROR: 'MEDIA_LOAD_ERROR',
  UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  WASM_INIT_ERROR: 'WASM_INIT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

/**
 * Animation durations (smooth on mobile)
 */
export const ANIMATION_DURATION = {
  INSTANT: 0,
  FAST: 150, // ms
  NORMAL: 250,
  SLOW: 350,
  BOTTOM_SHEET: 300, // Bottom sheet slide
  MODAL: 200,
} as const;

/**
 * Z-index layers (prevent conflicts)
 */
export const Z_INDEX = {
  BACKGROUND: 0,
  TIMELINE: 10,
  CANVAS: 20,
  CONTROLS: 30,
  BOTTOM_SHEET: 40,
  MODAL: 50,
  TOAST: 60,
  TOOLTIP: 70,
} as const;

/**
 * Supported file formats (mobile-compatible)
 */
export const SUPPORTED_FORMATS = {
  VIDEO: ['.mp4', '.webm', '.mov'],
  AUDIO: ['.mp3', '.wav', '.m4a', '.aac'],
  IMAGE: ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
} as const;

/**
 * Default theme colors (mobile-optimized contrast)
 */
export const DEFAULT_THEME_COLORS = {
  primary: '#7C3AED', // Deep purple
  secondary: '#06B6D4', // Cyan
  accent: '#3B82F6', // Electric blue
  background: '#0F172A', // Dark slate
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  border: '#334155',
} as const;
