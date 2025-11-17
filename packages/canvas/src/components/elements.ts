/**
 * Element rendering utilities for Konva.js canvas
 * Adapted from Twick Fabric.js implementation for mobile-first Helix canvas
 * 
 * Key differences from Fabric.js:
 * - Konva.Text instead of FabricText
 * - Konva.Image instead of FabricImage  
 * - Konva.Rect instead of Rect
 * - Konva.Circle instead of Circle
 * - Konva.Group instead of Group
 * - No built-in controls (use Transformer separately)
 * - Different property names (e.g., x/y instead of left/top)
 */

import Konva from "konva";
import { convertToCanvasPosition } from "../helpers/canvas.util";
import type {
  CanvasElement,
  CanvasMetadata,
  CaptionProps,
  FrameEffect,
} from "../types";
import {
  DEFAULT_CAPTION_PROPS,
  DEFAULT_TEXT_PROPS,
} from "../helpers/constants";
import { getObjectFitSize } from "@helix/media";
import { getThumbnail } from "@helix/media";

/**
 * Add a text element to the canvas.
 * Creates and configures a Konva.Text object with specified properties
 * including position, styling, and transformation.
 *
 * @param element - The canvas element configuration
 * @param index - The z-index of the element
 * @param layer - The Konva.Layer instance to add the text to
 * @param canvasMetadata - Metadata about the canvas including scale and dimensions
 * @returns The configured Konva.Text object
 *
 * @example
 * ```js
 * const textElement = addTextElement({
 *   element: { id: "text1", props: { text: "Hello", x: 100, y: 100 } },
 *   index: 1,
 *   layer: konvaLayer,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
export const addTextElement = ({
  element,
  index,
  layer,
  canvasMetadata,
}: {
  element: CanvasElement;
  index: number;
  layer: Konva.Layer;
  canvasMetadata: CanvasMetadata;
}): Konva.Text => {
  const { x, y } = convertToCanvasPosition(
    element.props?.x || 0,
    element.props?.y || 0,
    canvasMetadata
  );

  const shadowColor = element.props?.shadowColor;
  const shadowBlur = element.props?.shadowBlur;
  
  const text = new Konva.Text({
    id: element.id,
    x,
    y,
    text: element.props?.text || element.t || "",
    offsetX: 0, // Will be set after measuring text width
    offsetY: 0, // Will be set after measuring text height
    rotation: element.props?.rotation || 0,
    fontSize: Math.round(
      (element.props?.fontSize || DEFAULT_TEXT_PROPS.size) *
        canvasMetadata.scaleX
    ),
    fontFamily: element.props?.fontFamily || DEFAULT_TEXT_PROPS.family,
    fontStyle: `${element.props?.fontStyle || "normal"} ${element.props?.fontWeight || "normal"}`,
    fill: element.props?.fill || DEFAULT_TEXT_PROPS.fill,
    opacity: element.props?.opacity ?? 1,
    align: element.props?.textAlign || "center",
    stroke: element.props?.stroke || DEFAULT_TEXT_PROPS.stroke,
    strokeWidth: element.props?.lineWidth || DEFAULT_TEXT_PROPS.lineWidth,
    ...(shadowColor ? { shadowColor } : {}),
    ...(shadowBlur ? { shadowBlur: shadowBlur / 2 } : {}),
    shadowOffsetX:
      element.props?.shadowOffset?.length && element.props?.shadowOffset?.length > 1
        ? element.props.shadowOffset[0] / 2
        : 1,
    shadowOffsetY:
      element.props?.shadowOffset?.length && element.props?.shadowOffset.length > 1
        ? element.props.shadowOffset[1] / 2
        : 1,
    draggable: true,
    name: "element", // For filtering elements
  });

  // Center text by setting offset to half of text dimensions
  text.offsetX(text.width() / 2);
  text.offsetY(text.height() / 2);

  // Add to layer first, then set zIndex
  layer.add(text);
  text.setAttr("zIndex", index);
  return text;
};

/**
 * Sets image properties for a Konva.Image object.
 * Configures position, size, and metadata for image elements
 * on the canvas with proper scaling and positioning.
 *
 * @param img - The Konva.Image object to configure
 * @param element - The canvas element configuration
 * @param index - The z-index of the element
 * @param canvasMetadata - Metadata about the canvas including scale and dimensions
 *
 * @example
 * ```js
 * setImageProps({
 *   img: konvaImage,
 *   element: { id: "img1", props: { width: 200, height: 150, x: 50, y: 50 } },
 *   index: 2,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
const setImageProps = ({
  img,
  element,
  index,
  canvasMetadata,
}: {
  img: Konva.Image;
  element: CanvasElement;
  index: number;
  canvasMetadata: CanvasMetadata;
}): void => {
  const width =
    (element.props?.width || 0) * canvasMetadata.scaleX || canvasMetadata.width;
  const height =
    (element.props?.height || 0) * canvasMetadata.scaleY ||
    canvasMetadata.height;
  const { x, y } = convertToCanvasPosition(
    element.props?.x || 0,
    element.props?.y || 0,
    canvasMetadata
  );

  img.setAttrs({
    id: element.id,
    x,
    y,
    width,
    height,
    offsetX: width / 2, // Center image
    offsetY: height / 2,
    opacity: element.props?.opacity ?? 1,
    draggable: true,
    name: "element",
  });

  img.setAttr("zIndex", index);
};

/**
 * Add a caption element to the canvas based on provided props.
 * Creates a text element with caption-specific styling including
 * shadows, positioning, and font properties.
 *
 * @param element - The canvas element configuration
 * @param index - The z-index of the element
 * @param layer - The Konva.Layer instance
 * @param captionProps - Default and user-defined caption properties
 * @param canvasMetadata - Metadata about the canvas including scale and dimensions
 * @returns The configured Konva.Text caption object
 *
 * @example
 * ```js
 * const captionElement = addCaptionElement({
 *   element: { id: "caption1", props: { text: "Caption", pos: { x: 100, y: 100 } } },
 *   index: 3,
 *   layer: konvaLayer,
 *   captionProps: { font: { size: 24, family: "Arial" } },
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
export const addCaptionElement = ({
  element,
  index,
  layer,
  captionProps,
  canvasMetadata,
}: {
  element: CanvasElement;
  index: number;
  layer: Konva.Layer;
  captionProps: CaptionProps;
  canvasMetadata: CanvasMetadata;
}): Konva.Text => {
  const { x, y } = convertToCanvasPosition(
    (captionProps?.applyToAll ? captionProps?.x : element.props?.x) ?? 0,
    (captionProps?.applyToAll ? captionProps?.y : element.props?.y) ?? 0,
    canvasMetadata
  );

  const shadowOffsetX =
    (captionProps?.applyToAll
      ? captionProps?.shadowOffset?.[0]
      : element.props?.shadowOffset?.[0] ?? captionProps?.shadowOffset?.[0]) ??
    DEFAULT_CAPTION_PROPS.shadowOffset?.[0] ??
    0;
  const shadowOffsetY =
    (captionProps?.applyToAll
      ? captionProps?.shadowOffset?.[1]
      : element.props?.shadowOffset?.[1] ?? captionProps?.shadowOffset?.[1]) ??
    DEFAULT_CAPTION_PROPS.shadowOffset?.[1] ??
    0;
  const shadowBlur =
    (captionProps?.applyToAll
      ? captionProps?.shadowBlur
      : element.props?.shadowBlur ?? captionProps?.shadowBlur) ??
    DEFAULT_CAPTION_PROPS.shadowBlur;
  const shadowColor =
    (captionProps?.applyToAll
      ? captionProps?.shadowColor
      : element.props?.shadowColor ?? captionProps?.shadowColor) ??
    DEFAULT_CAPTION_PROPS.shadowColor;

  const caption = new Konva.Text({
    id: element.id,
    x,
    y,
    text: element.props?.text || element.t || "",
    rotation: element.props?.rotation || 0,
    fontSize: Math.round(
      ((captionProps?.applyToAll
        ? captionProps?.font?.size
        : captionProps?.font?.size) ??
        DEFAULT_CAPTION_PROPS.size) * canvasMetadata.scaleX
    ),
    fontFamily:
      (captionProps?.applyToAll
        ? captionProps?.font?.family
        : captionProps?.font?.family) ??
      DEFAULT_CAPTION_PROPS.family,
    fill:
      (captionProps?.applyToAll
        ? captionProps.color?.text
        : element.props?.fill ?? captionProps.color?.text) ??
      DEFAULT_CAPTION_PROPS.fill,
    fontStyle: `${
      (captionProps?.applyToAll
        ? captionProps?.font?.weight
        : element.props?.fontWeight ?? captionProps?.font?.weight) ??
      DEFAULT_CAPTION_PROPS.fontWeight
    }`,
    stroke:
      (captionProps?.applyToAll
        ? captionProps?.stroke
        : element.props?.stroke ?? captionProps?.stroke) ??
      DEFAULT_CAPTION_PROPS.stroke,
    strokeWidth:
      (captionProps?.applyToAll
        ? captionProps?.lineWidth
        : element.props?.lineWidth ?? captionProps?.lineWidth) ??
      DEFAULT_CAPTION_PROPS.lineWidth,
    opacity:
      (captionProps?.applyToAll
        ? captionProps?.opacity
        : element.props?.opacity ?? captionProps?.opacity) ?? 1,
    shadowOffsetX,
    shadowOffsetY,
    ...(shadowBlur !== undefined ? { shadowBlur } : {}),
    ...(shadowColor ? { shadowColor } : {}),
    draggable: false, // Captions are typically not draggable
    name: "caption",
  });

  // Center caption
  caption.offsetX(caption.width() / 2);
  caption.offsetY(caption.height() / 2);

  layer.add(caption);
  caption.setAttr("zIndex", index);
  return caption;
};

/**
 * Add a video frame as element into a Konva.Image object and optionally groups it with a frame.
 * Creates a video element by extracting a frame at the specified time and applying
 * optional frame effects for enhanced visual presentation.
 *
 * @param element - The video element containing properties like source and frame information
 * @param index - The z-index for ordering the element on the canvas
 * @param layer - The Konva.Layer instance
 * @param snapTime - The time to snap the video frame with respect to full video duration
 * @param canvasMetadata - Metadata of the canvas, including dimensions and scale factors
 * @param currentFrameEffect - Optional frame effect to apply to the image
 * @returns A Konva.Image object or a Konva.Group with an image and frame
 *
 * @example
 * ```js
 * const videoElement = await addVideoElement({
 *   element: {
 *     id: "video1",
 *     props: { src: "video.mp4", x: 100, y: 100 }
 *   },
 *   index: 2,
 *   layer: konvaLayer,
 *   snapTime: 5.0,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 },
 *   currentFrameEffect: { shape: "circle", radius: 50 }
 * });
 * ```
 */
export const addVideoElement = async ({
  element,
  index,
  layer,
  snapTime,
  canvasMetadata,
  currentFrameEffect,
}: {
  element: CanvasElement;
  index: number;
  layer: Konva.Layer;
  snapTime: number;
  canvasMetadata: CanvasMetadata;
  currentFrameEffect?: FrameEffect;
}): Promise<Konva.Image | Konva.Group | undefined> => {
  try {
    const thumbnailUrl = await getThumbnail(
      element?.props?.src || "",
      snapTime
    );
    if (!thumbnailUrl) {
      console.error("Failed to get thumbnail");
      return;
    }

    return addImageElement({
      imageUrl: thumbnailUrl,
      element,
      index,
      layer,
      canvasMetadata,
      ...(currentFrameEffect ? { currentFrameEffect } : {}),
    });
  } catch (error) {
    console.error("Error loading video thumbnail:", error);
  }
};

/**
 * Add an image element to the canvas and optionally group it with a frame.
 * Loads an image from URL and creates a Konva.Image object with proper
 * positioning, scaling, and optional frame effects.
 *
 * @param imageUrl - Optional URL of the image to be added to the canvas
 * @param element - The image element containing properties like source and frame information
 * @param index - The z-index for ordering the element on the canvas
 * @param layer - The Konva.Layer instance
 * @param canvasMetadata - Metadata of the canvas including dimensions and scale factors
 * @param currentFrameEffect - Optional frame effect to apply to the image
 * @returns A Konva.Image object or a Konva.Group with an image and frame
 *
 * @example
 * ```js
 * const imageElement = await addImageElement({
 *   imageUrl: "https://example.com/image.jpg",
 *   element: { id: "img1", props: { src: "image.jpg", width: 200, height: 150 } },
 *   index: 4,
 *   layer: konvaLayer,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
export const addImageElement = async ({
  imageUrl,
  element,
  index,
  layer,
  canvasMetadata,
  currentFrameEffect,
}: {
  imageUrl?: string;
  element: CanvasElement;
  index: number;
  layer: Konva.Layer;
  canvasMetadata: CanvasMetadata;
  currentFrameEffect?: FrameEffect;
}): Promise<Konva.Image | Konva.Group | undefined> => {
  try {
    // Load the image
    const imageObj = new Image();
    imageObj.crossOrigin = "anonymous";
    
    return new Promise((resolve, reject) => {
      imageObj.onload = () => {
        const img = new Konva.Image({
          image: imageObj,
          draggable: false,
          name: "element",
        });

        // Return the group if a frame is defined, otherwise return the image
        if (element.frame) {
          const group = addMediaGroup({
            element,
            img,
            index,
            layer,
            canvasMetadata,
            ...(currentFrameEffect ? { currentFrameEffect } : {}),
          });
          resolve(group);
        } else {
          setImageProps({ img, element, index, canvasMetadata });
          layer.add(img);
          resolve(img);
        }
      };

      imageObj.onerror = () => {
        console.error("Error loading image:", imageUrl || element.props.src);
        reject(new Error("Failed to load image"));
      };

      imageObj.src = imageUrl || element.props.src || "";
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

/**
 * Add a Konva.Group combining an image and its associated frame.
 * Applies styling, positioning, and scaling based on the given properties
 * and creates a grouped element for complex visual effects.
 *
 * @param element - The image element containing properties like frame, position, and styling
 * @param img - The Konva.Image object to be included in the group
 * @param index - The z-index for ordering the group on the canvas
 * @param layer - The Konva.Layer instance
 * @param canvasMetadata - Metadata of the canvas including dimensions and scale factors
 * @param currentFrameEffect - Optional current frame effect to override default frame properties
 * @returns A Konva.Group containing the image and frame with configured properties
 *
 * @example
 * ```js
 * const mediaGroup = addMediaGroup({
 *   element: { id: "group1", frame: { size: [200, 150], x: 100, y: 100 } },
 *   img: konvaImage,
 *   index: 5,
 *   layer: konvaLayer,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
const addMediaGroup = ({
  element,
  img,
  index,
  layer,
  canvasMetadata,
  currentFrameEffect,
}: {
  element: CanvasElement;
  img: Konva.Image;
  index: number;
  layer: Konva.Layer;
  canvasMetadata: CanvasMetadata;
  currentFrameEffect?: FrameEffect;
}): Konva.Group => {
  let frameSize;
  let angle;
  let framePosition;
  let frameRadius = 0;
  
  if (currentFrameEffect) {
    frameSize = {
      width:
        (currentFrameEffect.props.frameSize?.[0] || 0) *
          canvasMetadata.scaleX || canvasMetadata.width,
      height:
        (currentFrameEffect.props.frameSize?.[1] || 0) *
          canvasMetadata.scaleY || canvasMetadata.height,
    };
    angle = currentFrameEffect.props.rotation || 0;
    framePosition = currentFrameEffect.props.framePosition;
    if (currentFrameEffect.props.shape === "circle") {
      frameRadius = frameSize.width / 2;
    } else {
      frameRadius = currentFrameEffect?.props?.radius || 0;
    }
  } else {
    frameRadius = element?.frame?.radius || 0;
    frameSize = {
      width:
        (element?.frame?.size?.[0] || 0) * canvasMetadata.scaleX ||
        canvasMetadata.width,
      height:
        (element?.frame?.size?.[1] || 0) * canvasMetadata.scaleY ||
        canvasMetadata.height,
    };
    angle = element?.frame?.rotation || 0;
    framePosition = {
      x: element?.frame?.x || 0,
      y: element?.frame?.y || 0,
    };
  }

  const imageElement = img.image();
  if (!imageElement) {
    throw new Error("Image element not loaded");
  }

  // Type assertion for HTMLImageElement
  const imgEl = imageElement as HTMLImageElement;
  const newSize = getObjectFitSize(
    element.objectFit ?? "contain",
    { width: imgEl.width, height: imgEl.height },
    frameSize
  );

  const frameRect = new Konva.Rect({
    width: frameSize.width,
    height: frameSize.height,
    stroke: element?.frame?.stroke || "#ffffff",
    strokeWidth: element?.frame?.lineWidth || 0,
    cornerRadius: frameRadius || 0,
    offsetX: frameSize.width / 2,
    offsetY: frameSize.height / 2,
  });

  // Scale image to fit frame
  img.setAttrs({
    width: imgEl.width,
    height: imgEl.height,
    scaleX: newSize.width / imgEl.width,
    scaleY: newSize.height / imgEl.height,
    opacity: element.props?.opacity ?? 1,
    offsetX: imgEl.width / 2,
    offsetY: imgEl.height / 2,
  });

  const { x, y } = convertToCanvasPosition(
    framePosition?.x || 0,
    framePosition?.y || 0,
    canvasMetadata
  );

  const group = new Konva.Group({
    id: element.id,
    x,
    y,
    rotation: angle,
    draggable: true,
    name: "element",
    clipFunc: (ctx) => {
      // Clip to frame shape
      if (currentFrameEffect?.props.shape === "circle" || frameRadius > 0) {
        ctx.beginPath();
        ctx.arc(0, 0, frameSize.width / 2, 0, Math.PI * 2);
        ctx.closePath();
      } else {
        ctx.rect(
          -frameSize.width / 2,
          -frameSize.height / 2,
          frameSize.width,
          frameSize.height
        );
      }
    },
  });

  group.add(frameRect);
  group.add(img);
  
  layer.add(group);
  group.setAttr("zIndex", index);
  return group;
};

/**
 * Add a rectangular element to the canvas.
 * Creates a Konva.Rect with specified properties including
 * position, size, styling, and transformation.
 *
 * @param element - The canvas element containing properties for the rectangle
 * @param index - The zIndex value used to determine the rendering order
 * @param layer - The Konva.Layer instance
 * @param canvasMetadata - Metadata containing canvas scaling and dimensions
 * @returns A Konva.Rect object configured with the specified properties
 *
 * @example
 * ```js
 * const rectElement = addRectElement({
 *   element: { id: "rect1", props: { width: 100, height: 50, x: 200, y: 150 } },
 *   index: 6,
 *   layer: konvaLayer,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
export const addRectElement = ({
  element,
  index,
  layer,
  canvasMetadata,
}: {
  element: CanvasElement;
  index: number;
  layer: Konva.Layer;
  canvasMetadata: CanvasMetadata;
}): Konva.Rect => {
  const { x, y } = convertToCanvasPosition(
    element.props?.x || 0,
    element.props?.y || 0,
    canvasMetadata
  );

  const width = (element.props?.width || 0) * canvasMetadata.scaleX;
  const height = (element.props?.height || 0) * canvasMetadata.scaleY;

  const rect = new Konva.Rect({
    id: element.id,
    x,
    y,
    width,
    height,
    offsetX: width / 2, // Center the rectangle
    offsetY: height / 2,
    rotation: element.props?.rotation || 0,
    cornerRadius: (element.props?.radius || 0) * canvasMetadata.scaleX,
    stroke: element.props?.stroke || "#000000",
    strokeWidth: (element.props?.lineWidth || 0) * canvasMetadata.scaleX,
    fill: element.props?.fill || "#000000",
    opacity: element.props?.opacity || 1,
    draggable: true,
    name: "element",
  });

  layer.add(rect);
  rect.setAttr("zIndex", index);
  return rect;
};

/**
 * Add a circle element to the canvas.
 * Creates a Konva.Circle with specified properties including
 * position, radius, styling, and transformation.
 *
 * @param element - The canvas element containing properties for the circle
 * @param index - The zIndex value used to determine the rendering order
 * @param layer - The Konva.Layer instance
 * @param canvasMetadata - Metadata containing canvas scaling and dimensions
 * @returns A Konva.Circle object configured with the specified properties
 *
 * @example
 * ```js
 * const circleElement = addCircleElement({
 *   element: { id: "circle1", props: { radius: 50, x: 300, y: 200 } },
 *   index: 7,
 *   layer: konvaLayer,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
export const addCircleElement = ({
  element,
  index,
  layer,
  canvasMetadata,
}: {
  element: CanvasElement;
  index: number;
  layer: Konva.Layer;
  canvasMetadata: CanvasMetadata;
}): Konva.Circle => {
  const { x, y } = convertToCanvasPosition(
    element.props?.x || 0,
    element.props?.y || 0,
    canvasMetadata
  );

  const circle = new Konva.Circle({
    id: element.id,
    x,
    y,
    radius: (element.props?.radius || 0) * canvasMetadata.scaleX,
    fill: element.props?.fill || "#000000",
    stroke: element.props?.stroke || "#000000",
    strokeWidth: (element.props?.lineWidth || 0) * canvasMetadata.scaleX,
    draggable: true,
    name: "element",
  });

  layer.add(circle);
  circle.setAttr("zIndex", index);
  return circle;
};

/**
 * Add a background color to the canvas.
 * Creates a full-canvas rectangle with the specified background color
 * that serves as the base layer for other elements.
 *
 * @param element - The canvas element containing properties for the background
 * @param index - The zIndex value used to determine the rendering order
 * @param layer - The Konva.Layer instance
 * @param canvasMetadata - Metadata containing canvas scaling and dimensions
 * @returns A Konva.Rect object configured with the specified properties
 *
 * @example
 * ```js
 * const bgElement = addBackgroundColor({
 *   element: { id: "bg1", backgroundColor: "#ffffff" },
 *   index: 0,
 *   layer: konvaLayer,
 *   canvasMetadata: { scaleX: 1, scaleY: 1, width: 800, height: 600 }
 * });
 * ```
 */
export const addBackgroundColor = ({
  element,
  index,
  layer,
  canvasMetadata,
}: {
  element: CanvasElement;
  index: number;
  layer: Konva.Layer;
  canvasMetadata: CanvasMetadata;
}): Konva.Rect => {
  const bgRect = new Konva.Rect({
    x: canvasMetadata.width / 2,
    y: canvasMetadata.height / 2,
    width: canvasMetadata.width,
    height: canvasMetadata.height,
    offsetX: canvasMetadata.width / 2,
    offsetY: canvasMetadata.height / 2,
    fill: element.backgroundColor ?? "#000000",
    draggable: false,
    listening: false, // Don't respond to events
    name: "background",
  });

  layer.add(bgRect);
  bgRect.setAttr("zIndex", index - 0.5);
  return bgRect;
};
