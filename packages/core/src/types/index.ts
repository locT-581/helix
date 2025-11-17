/**
 * @helix/core - Core Types
 *
 * Fundamental type definitions for Helix video editor.
 * Mobile-optimized, zero dependencies.
 */

// Export types
export type * from './export';

/**
 * Base dimension interface for video/canvas sizing
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Position on 2D plane (canvas/screen coordinates)
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Rectangle bounds (position + size)
 */
export interface Rect extends Position, Size {}

/**
 * Time range in seconds
 */
export interface TimeRange {
  start: number;
  end: number;
}

/**
 * Element types supported in timeline
 */
export type ElementType =
  | 'video'
  | 'audio'
  | 'image'
  | 'text'
  | 'caption'
  | 'rect'
  | 'circle'
  | 'icon';

/**
 * Base properties for all timeline elements
 */
export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  start: number; // seconds
  end: number; // seconds
  trackId: string;
  locked?: boolean;
  visible?: boolean;
}

/**
 * Media element base (video, audio, image)
 */
export interface MediaElement extends BaseElement {
  src: string;
  volume?: number; // 0-1
  muted?: boolean;
}

/**
 * Video element properties
 */
export interface VideoElement extends MediaElement {
  type: 'video';
  width: number;
  height: number;
  playbackRate?: number; // 0.25-4.0
  trim?: TimeRange; // source trim
}

/**
 * Audio element properties
 */
export interface AudioElement extends MediaElement {
  type: 'audio';
  fadeIn?: number; // seconds
  fadeOut?: number; // seconds
}

/**
 * Image element properties
 */
export interface ImageElement extends MediaElement {
  type: 'image';
  width: number;
  height: number;
  fit?: 'cover' | 'contain' | 'fill' | 'none';
}

/**
 * Text element properties (mobile-optimized)
 */
export interface TextElement extends BaseElement {
  type: 'text';
  content: string;
  fontSize: number; // Responsive: 12-96
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  textAlign?: 'left' | 'center' | 'right';
  position?: Position;
  width?: number;
  animation?: TextAnimation;
}

/**
 * Text animation types (lightweight)
 */
export type TextAnimation = 'none' | 'fade' | 'slide' | 'typewriter' | 'bounce';

/**
 * Track in timeline (container for elements)
 */
export interface Track {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'overlay';
  elements: BaseElement[];
  locked?: boolean;
  visible?: boolean;
  collapsed?: boolean; // Mobile: collapse tracks to save space
}

/**
 * Timeline project structure
 */
export interface Project {
  id: string;
  name: string;
  version: number;
  tracks: Track[];
  duration: number; // seconds
  resolution: Size;
  fps?: number; // Default 30
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mobile device capabilities detection
 */
export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  supportsWasm: boolean;
  supportsWebGL: boolean;
  maxTextureSize?: number | undefined;
  hardwareConcurrency: number; // CPU cores
  deviceMemory?: number | undefined; // GB
  connectionType?: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'wifi' | 'unknown';
}

/**
 * Theme color palette (mobile-first)
 */
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  warning: string;
  success: string;
  border: string;
}

/**
 * Theme configuration
 */
export interface Theme {
  colors: ThemeColors;
  spacing: number; // Base unit (4px)
  borderRadius: number; // Base radius (8px)
  fontFamily: string;
}

/**
 * Error types for better error handling
 */
export type ErrorCode =
  | 'MEDIA_LOAD_ERROR'
  | 'UNSUPPORTED_FORMAT'
  | 'QUOTA_EXCEEDED'
  | 'NETWORK_ERROR'
  | 'WASM_INIT_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Helix error with code and context
 */
export interface HelixError extends Error {
  code: ErrorCode;
  context?: Record<string, unknown>;
}
