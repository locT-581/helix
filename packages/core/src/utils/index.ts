/**
 * @helix/core - Utility Functions
 *
 * Lightweight, mobile-optimized utilities.
 * Zero dependencies, tree-shakeable.
 */

import type { DeviceCapabilities, Size, TimeRange } from '../types';
import { BREAKPOINTS, PERFORMANCE } from '../constants';

/**
 * Generate unique ID (lightweight alternative to uuid)
 * Format: timestamp + random string
 */
export const generateId = (): string => {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 9);
  return `${timestamp}-${randomStr}`;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Check if two time ranges overlap
 */
export const isTimeRangeOverlap = (a: TimeRange, b: TimeRange): boolean => {
  return a.start < b.end && b.start < a.end;
};

/**
 * Calculate duration from time range
 */
export const calculateDuration = (range: TimeRange): number => {
  return Math.max(0, range.end - range.start);
};

/**
 * Format time in MM:SS or HH:MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Format file size in human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

/**
 * Debounce function (for mobile input optimization)
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = PERFORMANCE.DEBOUNCE_DELAY
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttle function (for scroll/drag optimization)
 */
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number = PERFORMANCE.THROTTLE_DELAY
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Detect device capabilities (mobile-first)
 */
export const detectDeviceCapabilities = (): DeviceCapabilities => {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobile|android|iphone|ipad|ipod/.test(userAgent);
  const isTablet = /ipad|tablet/.test(userAgent) || (isMobile && window.innerWidth >= BREAKPOINTS.TABLET);

  // Check WebAssembly support
  const supportsWasm = typeof WebAssembly === 'object';

  // Check WebGL support
  let supportsWebGL = false;
  let maxTextureSize: number | undefined;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    supportsWebGL = !!gl;
    if (gl && 'getParameter' in gl) {
      const glContext = gl as WebGLRenderingContext;
      maxTextureSize = glContext.getParameter(glContext.MAX_TEXTURE_SIZE) as number;
    }
  } catch {
    supportsWebGL = false;
  }

  // Network info (if available)
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection;
  const connectionType = connection?.effectiveType as DeviceCapabilities['connectionType'] || 'unknown';

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    hasTouch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    supportsWasm,
    supportsWebGL,
    maxTextureSize,
    hardwareConcurrency: navigator.hardwareConcurrency || 4,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number }).deviceMemory,
    connectionType,
  };
};

/**
 * Calculate aspect ratio from size
 */
export const calculateAspectRatio = (size: Size): number => {
  return size.width / size.height;
};

/**
 * Fit size within bounds while maintaining aspect ratio
 */
export const fitSize = (size: Size, bounds: Size): Size => {
  const aspectRatio = calculateAspectRatio(size);
  const boundsRatio = calculateAspectRatio(bounds);

  if (aspectRatio > boundsRatio) {
    // Width constrained
    return {
      width: bounds.width,
      height: bounds.width / aspectRatio,
    };
  }
  // Height constrained
  return {
    width: bounds.height * aspectRatio,
    height: bounds.height,
  };
};

/**
 * Check if value is defined (not null or undefined)
 */
export const isDefined = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};

/**
 * Deep clone object (simple, fast alternative to structuredClone)
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Request idle callback wrapper (fallback for unsupported browsers)
 */
export const requestIdleTask = (callback: () => void): void => {
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (callback: () => void) => void }).requestIdleCallback(callback);
  } else {
    setTimeout(callback, 1);
  }
};

/**
 * Linear interpolation (lerp) for smooth animations
 */
export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * clamp(t, 0, 1);
};

/**
 * Map value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  const t = (value - inMin) / (inMax - inMin);
  return lerp(outMin, outMax, t);
};
