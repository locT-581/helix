/**
 * Vitest Setup File
 * Configures @testing-library/jest-dom custom matchers and global mocks
 */
import '@testing-library/jest-dom/vitest';

/**
 * Mock ResizeObserver for Radix UI components (Slider, etc.)
 * jsdom doesn't implement ResizeObserver by default
 */
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

/**
 * Mock PointerEvent.hasPointerCapture for Radix UI Select
 * jsdom doesn't fully implement PointerEvent API
 */
// @ts-expect-error - Polyfill for jsdom
HTMLElement.prototype.hasPointerCapture = () => false;
// @ts-expect-error - Polyfill for jsdom
HTMLElement.prototype.setPointerCapture = () => {};
// @ts-expect-error - Polyfill for jsdom
HTMLElement.prototype.releasePointerCapture = () => {};

/**
 * Mock scrollIntoView for Radix UI Select
 * jsdom doesn't implement scrollIntoView
 */
// @ts-expect-error - Polyfill for jsdom
HTMLElement.prototype.scrollIntoView = () => {};


