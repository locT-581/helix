import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateId,
  clamp,
  lerp,
  mapRange,
  formatTime,
  formatFileSize,
  debounce,
  throttle,
  fitSize,
  calculateAspectRatio,
  isDefined,
  deepClone,
  detectDeviceCapabilities,
} from './index';

describe('Math Utils', () => {
  describe('clamp', () => {
    it('should clamp value within min-max range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between values', () => {
      expect(lerp(0, 100, 0)).toBe(0);
      expect(lerp(0, 100, 1)).toBe(100);
      expect(lerp(0, 100, 0.5)).toBe(50);
      expect(lerp(10, 20, 0.25)).toBe(12.5);
    });
  });

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
      expect(mapRange(0, 0, 10, 100, 200)).toBe(100);
      expect(mapRange(10, 0, 10, 100, 200)).toBe(200);
    });
  });
});

describe('Format Utils', () => {
  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
      expect(id1).toMatch(/^[a-z0-9]+-[a-z0-9]+$/);
    });

    it('should generate ID with timestamp-random format', () => {
      const id = generateId();
      const parts = id.split('-');
      expect(parts.length).toBe(2);
      expect(parts[0].length).toBeGreaterThan(0);
      expect(parts[1].length).toBeGreaterThan(0);
    });
  });

  describe('formatTime', () => {
    it('should format seconds to MM:SS', () => {
      expect(formatTime(0)).toBe('0:00');
      expect(formatTime(59)).toBe('0:59');
      expect(formatTime(60)).toBe('1:00');
      expect(formatTime(125)).toBe('2:05');
    });

    it('should format seconds to HH:MM:SS when >= 1 hour', () => {
      expect(formatTime(3600)).toBe('1:00:00');
      expect(formatTime(3661)).toBe('1:01:01');
      expect(formatTime(7384)).toBe('2:03:04');
    });

    it('should handle fractional seconds', () => {
      expect(formatTime(1.5)).toBe('0:01');
      expect(formatTime(59.99)).toBe('0:59');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes with appropriate unit', () => {
      expect(formatFileSize(0)).toBe('0.0 B');
      expect(formatFileSize(512)).toBe('512.0 B');
      expect(formatFileSize(1024)).toBe('1.0 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
      expect(formatFileSize(1048576)).toBe('1.0 MB');
      expect(formatFileSize(1572864)).toBe('1.5 MB');
      expect(formatFileSize(1073741824)).toBe('1.0 GB');
    });
  });
});

describe('Function Utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('debounce', () => {
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

    it('should pass arguments correctly', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 100);

      debounced('test', 123);
      vi.advanceTimersByTime(100);

      expect(fn).toHaveBeenCalledWith('test', 123);
    });
  });

  describe('throttle', () => {
    it('should throttle function calls', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled();
      throttled();
      throttled();

      expect(fn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      throttled();

      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should pass arguments correctly', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 100);

      throttled('test', 456);
      expect(fn).toHaveBeenCalledWith('test', 456);
    });
  });
});

describe('Size Utils', () => {
  describe('calculateAspectRatio', () => {
    it('should calculate aspect ratio correctly', () => {
      expect(calculateAspectRatio({ width: 1920, height: 1080 })).toBeCloseTo(16 / 9);
      expect(calculateAspectRatio({ width: 720, height: 1280 })).toBeCloseTo(9 / 16);
      expect(calculateAspectRatio({ width: 1080, height: 1080 })).toBe(1);
    });
  });

  describe('fitSize', () => {
    it('should fit size within bounds maintaining aspect ratio', () => {
      const result = fitSize({ width: 1920, height: 1080 }, { width: 640, height: 640 });
      expect(result.width).toBe(640);
      expect(result.height).toBe(360);
    });

    it('should fit portrait video', () => {
      const result = fitSize({ width: 720, height: 1280 }, { width: 400, height: 400 });
      expect(result.width).toBe(225);
      expect(result.height).toBe(400);
    });

    it('should scale up if smaller than bounds', () => {
      const result = fitSize({ width: 640, height: 360 }, { width: 1920, height: 1080 });
      expect(result.width).toBe(1920);
      expect(result.height).toBe(1080);
    });

    it('should handle square aspect ratios', () => {
      const result = fitSize({ width: 1000, height: 1000 }, { width: 500, height: 500 });
      expect(result.width).toBe(500);
      expect(result.height).toBe(500);
    });
  });
});

describe('Utility Functions', () => {
  describe('isDefined', () => {
    it('should return true for defined values', () => {
      expect(isDefined(0)).toBe(true);
      expect(isDefined('')).toBe(true);
      expect(isDefined(false)).toBe(true);
      expect(isDefined([])).toBe(true);
      expect(isDefined({})).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(isDefined(null)).toBe(false);
      expect(isDefined(undefined)).toBe(false);
    });
  });

  describe('deepClone', () => {
    it('should deep clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = deepClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone arrays', () => {
      const arr = [1, 2, { a: 3 }];
      const cloned = deepClone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[2]).not.toBe(arr[2]);
    });
  });
});

describe('Device Utils', () => {
  describe('detectDeviceCapabilities', () => {
    // Skip tests that require browser globals in Node.js environment
    it.skip('should detect basic capabilities', () => {
      const caps = detectDeviceCapabilities();

      expect(caps).toHaveProperty('isMobile');
      expect(caps).toHaveProperty('isTablet');
      expect(caps).toHaveProperty('isDesktop');
      expect(caps).toHaveProperty('hasTouch');
      expect(caps).toHaveProperty('supportsWasm');
      expect(caps).toHaveProperty('supportsWebGL');
      expect(caps).toHaveProperty('hardwareConcurrency');
    });

    it.skip('should detect device type correctly', () => {
      const caps = detectDeviceCapabilities();
      const deviceTypes = [caps.isMobile, caps.isTablet, caps.isDesktop];
      
      // Exactly one device type should be true
      expect(deviceTypes.filter(Boolean).length).toBe(1);
    });

    it.skip('should detect WASM support', () => {
      const caps = detectDeviceCapabilities();
      expect(typeof caps.supportsWasm).toBe('boolean');
    });

    it.skip('should return hardwareConcurrency', () => {
      const caps = detectDeviceCapabilities();
      expect(caps.hardwareConcurrency).toBeGreaterThan(0);
    });
  });
});
