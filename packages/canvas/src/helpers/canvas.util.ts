import Konva from "konva";
import type { CanvasMetadata, CanvasProps } from "../types";
import type { Dimensions, Position } from "@helix/media";
import { assertBrowser, assertCanvasSupport } from "./browser";

/**
 * Creates and initializes a Konva Stage with specified configurations.
 * Sets up a stage with proper scaling, background, and interaction settings
 * based on the provided video and canvas dimensions.
 *
 * Adapted from @twick/canvas createCanvas for mobile-first Konva.js
 *
 * @param videoSize - The dimensions of the video
 * @param canvasSize - The dimensions of the canvas
 * @param container - The HTML container for the stage
 * @param backgroundColor - Background color of the stage
 * @param selectionBorderColor - Border color for selected objects
 * @param selectionLineWidth - Width of the selection border
 * @returns Object containing the initialized stage and its metadata
 *
 * @example
 * ```js
 * const { stage, canvasMetadata } = createCanvas({
 *   videoSize: { width: 1920, height: 1080 },
 *   canvasSize: { width: 800, height: 600 },
 *   container: containerElement,
 *   backgroundColor: "#000000",
 *   selectionBorderColor: "#2563eb"
 * });
 * ```
 */
export const createCanvas = ({
  videoSize,
  canvasSize,
  container,
  backgroundColor = "#000000",
}: CanvasProps): { stage: Konva.Stage; canvasMetadata: CanvasMetadata } => {
  assertBrowser();
  assertCanvasSupport();

  // Metadata for scaling and positioning on the canvas
  const canvasMetadata: CanvasMetadata = {
    width: canvasSize.width,
    height: canvasSize.height,
    aspectRatio: canvasSize.width / canvasSize.height,
    scaleX: canvasSize.width / videoSize.width,
    scaleY: canvasSize.height / videoSize.height,
  };

  // Create Konva Stage (equivalent to Fabric Canvas)
  const stage = new Konva.Stage({
    container,
    width: canvasSize.width,
    height: canvasSize.height,
  });

  // Create main layer for elements
  const layer = new Konva.Layer();

  // Add background rectangle (Konva doesn't have native backgroundColor)
  const background = new Konva.Rect({
    x: 0,
    y: 0,
    width: canvasSize.width,
    height: canvasSize.height,
    fill: backgroundColor,
    listening: false, // Non-interactive background
  });
  layer.add(background);

  // Add layer to stage
  stage.add(layer);

  // Configure selection styling (will be applied to transformer)
  stage.container().style.touchAction = 'none'; // Better mobile support

  return {
    stage,
    canvasMetadata,
  };
};

/**
 * Reorders elements on the stage based on their zIndex property.
 * Sorts all layer children by their zIndex and re-orders them to maintain
 * proper layering order for visual elements.
 *
 * Adapted from @twick/canvas reorderElementsByZIndex for Konva API
 *
 * @param stage - The Konva Stage instance
 *
 * @example
 * ```js
 * reorderElementsByZIndex(stage);
 * // Elements are now properly layered based on zIndex
 * ```
 */
export const reorderElementsByZIndex = (stage: Konva.Stage) => {
  if (!stage) return;

  const layer = stage.getLayers()[0];
  if (!layer) return;

  const children = layer.getChildren();
  
  // Sort children by zIndex (ascending order)
  const sorted = children.sort((a, b) => {
    const aIndex = a.getAttr('zIndex') || 0;
    const bIndex = b.getAttr('zIndex') || 0;
    return aIndex - bIndex;
  });

  // Remove all children
  layer.removeChildren();

  // Re-add in sorted order
  sorted.forEach((child) => layer.add(child));

  // Re-render
  layer.batchDraw();
};

/**
 * Retrieves the context of a Konva stage.
 * 
 * Adapted from @twick/canvas getCanvasContext for Konva API
 * 
 * @param stage - The Konva Stage instance
 * @returns The Konva context or null
 */
export const getCanvasContext = (
  stage: Konva.Stage | null | undefined
) => {
  if (!stage) return null;
  const layer = stage.getLayers()[0];
  if (!layer) return null;
  return layer.getContext();
};

/**
 * Clears all elements from the stage and re-renders it.
 * Removes all objects except the background from the main layer
 * while preserving the background and triggers a re-render.
 *
 * Adapted from @twick/canvas clearCanvas for Konva API
 *
 * @param stage - The Konva Stage instance
 *
 * @example
 * ```js
 * clearCanvas(stage);
 * // Stage is now empty (except background) and ready for new elements
 * ```
 */
export const clearCanvas = (stage: Konva.Stage | null | undefined) => {
  try {
    if (!stage) return;
    
    const layer = stage.getLayers()[0];
    if (!layer) return;

    const children = layer.getChildren();
    
    // Keep only the background (first child is always background)
    const background = children[0];
    layer.removeChildren();
    
    if (background && background.getClassName() === 'Rect') {
      layer.add(background);
    }
    
    layer.batchDraw();
  } catch (error) {
    console.warn("Error clearing canvas:", error);
  }
};

/**
 * Converts a position from the video coordinate space to the canvas coordinate space.
 * Applies scaling and centering transformations to map video coordinates
 * to the corresponding canvas pixel positions.
 *
 * 100% reused from @twick/canvas (no changes)
 *
 * @param x - X-coordinate in video space
 * @param y - Y-coordinate in video space
 * @param canvasMetadata - Metadata containing canvas scaling and dimensions
 * @returns Object containing the corresponding position in canvas space
 *
 * @example
 * ```js
 * const canvasPos = convertToCanvasPosition(100, 200, canvasMetadata);
 * // canvasPos = { x: 450, y: 500 }
 * ```
 */
export const convertToCanvasPosition = (
  x: number,
  y: number,
  canvasMetadata: CanvasMetadata
): Position => {
  return {
    x: x * canvasMetadata.scaleX + canvasMetadata.width / 2,
    y: y * canvasMetadata.scaleY + canvasMetadata.height / 2,
  };
};

/**
 * Converts a position from the canvas coordinate space to the video coordinate space.
 * Applies inverse scaling and centering transformations to map canvas coordinates
 * back to the corresponding video coordinate positions.
 *
 * 100% reused from @twick/canvas (no changes)
 *
 * @param x - X-coordinate in canvas space
 * @param y - Y-coordinate in canvas space
 * @param canvasMetadata - Metadata containing canvas scaling and dimensions
 * @param videoSize - Dimensions of the video
 * @returns Object containing the corresponding position in video space
 *
 * @example
 * ```js
 * const videoPos = convertToVideoPosition(450, 500, canvasMetadata, videoSize);
 * // videoPos = { x: 100, y: 200 }
 * ```
 */
export const convertToVideoPosition = (
  x: number,
  y: number,
  canvasMetadata: CanvasMetadata,
  videoSize: Dimensions
): Position => {
  return {
    x: Number((x / canvasMetadata.scaleX - videoSize.width / 2).toFixed(2)),
    y: Number((y / canvasMetadata.scaleY - videoSize.height / 2).toFixed(2)),
  };
};

/**
 * Retrieves the current frame effect for a given seek time.
 * Searches through the item's frame effects to find the one that is active
 * at the specified seek time based on start and end time ranges.
 *
 * 100% reused from @twick/canvas (no changes)
 *
 * @param item - The item containing frame effects
 * @param seekTime - The current time to match against frame effects
 * @returns The current frame effect active at the given seek time, or undefined if none found
 *
 * @example
 * ```js
 * const currentEffect = getCurrentFrameEffect(videoElement, 5.5);
 * // Returns the frame effect active at 5.5 seconds, if any
 * ```
 */
export const getCurrentFrameEffect = (item: any, seekTime: number) => {
  let currentFrameEffect;
  const frameEffects = item?.frameEffects;
  
  if (!frameEffects) return currentFrameEffect;
  
  for (let i = 0; i < frameEffects.length; i++) {
    const effect = frameEffects[i];
    if (effect && effect.s <= seekTime && effect.e >= seekTime) {
      currentFrameEffect = effect;
      break;
    }
  }
  
  return currentFrameEffect;
};
