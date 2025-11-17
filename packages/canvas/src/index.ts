/**
 * @helix/canvas - Mobile Canvas Engine
 * 
 * Mobile-first canvas component built with Konva.js for touch-optimized
 * video editing. Adapted from @twick/canvas with 80% code reuse.
 * 
 * @example
 * ```jsx
 * import { 
 *   createCanvas, 
 *   addImageElement, 
 *   addTextElement,
 *   CANVAS_OPERATIONS 
 * } from '@helix/canvas';
 * 
 * const { stage, canvasMetadata } = createCanvas({
 *   videoSize: { width: 1920, height: 1080 },
 *   canvasSize: { width: 800, height: 600 },
 *   container: containerElement
 * });
 * ```
 */

// Types
export type {
  CanvasProps,
  CanvasMetadata,
  FrameEffect,
  CanvasElement,
  CanvasElementProps,
  CaptionProps,
} from "./types";

// Constants
export { CANVAS_OPERATIONS, DEFAULT_TEXT_PROPS, DEFAULT_CAPTION_PROPS } from "./helpers/constants";

// Canvas Utilities
export {
  createCanvas,
  reorderElementsByZIndex,
  getCanvasContext,
  clearCanvas,
  convertToCanvasPosition,
  convertToVideoPosition,
  getCurrentFrameEffect,
} from "./helpers/canvas.util";

// Text effect utilities (NEW - Week 11)
export { 
  applyTextEffect, 
  resetTextEffect,
  type TextEffectConfig 
} from "./helpers/text-effects";

// Component exports - Element rendering functions
export {
  addTextElement,
  addCaptionElement,
  addVideoElement,
  addImageElement,
  addRectElement,
  addCircleElement,
  addBackgroundColor,
} from "./components/elements";

// Hooks exports
export { useHelixCanvas } from "./hooks/use-helix-canvas";
export { useCanvasGestures } from "./hooks/use-canvas-gestures";
export { useTouchTransformControls } from "./components/touch-transform-controls";
export { useMediaUpload, type UploadedMedia, type MediaUploadOptions } from "./hooks/use-media-upload";

// Browser utilities
export { assertBrowser, assertCanvasSupport } from "./helpers/browser";
