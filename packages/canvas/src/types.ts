import type { Dimensions, Position } from "@helix/media";

/**
 * Configuration properties for creating and initializing a canvas (Konva Stage).
 * Defines the video and canvas dimensions, styling options, and interaction settings.
 *
 * Adapted from @twick/canvas CanvasProps for Konva.js
 *
 * @example
 * ```js
 * const canvasProps: CanvasProps = {
 *   videoSize: { width: 1920, height: 1080 },
 *   canvasSize: { width: 800, height: 600 },
 *   container: containerElement,
 *   backgroundColor: "#000000",
 *   selectionBorderColor: "#2563eb",
 *   selectionLineWidth: 2
 * };
 * ```
 */
export type CanvasProps = {
  /** Dimensions of the video content */
  videoSize: Dimensions;
  /** Dimensions of the canvas element */
  canvasSize: Dimensions;
  /** HTML container element for the Konva stage */
  container: HTMLDivElement | string;
  /** Background color of the canvas */
  backgroundColor?: string;
  /** Border color for selected objects (used with Transformer) */
  selectionBorderColor?: string;
  /** Width of the selection border */
  selectionLineWidth?: number;
};

/**
 * Metadata about the canvas including dimensions and scaling factors.
 * Contains calculated values for coordinate transformations between video and canvas spaces.
 *
 * 100% reused from @twick/canvas (no changes)
 *
 * @example
 * ```js
 * const metadata: CanvasMetadata = {
 *   width: 800,
 *   height: 600,
 *   aspectRatio: 1.33,
 *   scaleX: 0.416,
 *   scaleY: 0.556
 * };
 * ```
 */
export type CanvasMetadata = {
  /** Width of the canvas in pixels */
  width: number;
  /** Height of the canvas in pixels */
  height: number;
  /** Aspect ratio of the canvas (width / height) */
  aspectRatio: number;
  /** Horizontal scaling factor from video to canvas */
  scaleX: number;
  /** Vertical scaling factor from video to canvas */
  scaleY: number;
};

/**
 * Frame effect configuration for canvas elements.
 * Defines visual effects that can be applied to elements during specific time ranges.
 *
 * 100% reused from @twick/canvas (no changes)
 *
 * @example
 * ```js
 * const frameEffect: FrameEffect = {
 *   s: 0,
 *   e: 5,
 *   props: {
 *     shape: "circle",
 *     radius: 50,
 *     rotation: 45,
 *     framePosition: { x: 100, y: 100 },
 *     frameSize: [200, 200]
 *   }
 * };
 * ```
 */
export type FrameEffect = {
  /** Start time of the effect in seconds */
  s: number;
  /** End time of the effect in seconds */
  e: number;
  /** Effect properties and configuration */
  props: {
    /** Shape type for the frame effect */
    shape?: "circle" | "rect";
    /** Radius for circular effects */
    radius?: number;
    /** Rotation angle in degrees */
    rotation?: number;
    /** Position of the frame effect */
    framePosition?: Position;
    /** Size of the frame effect [width, height] */
    frameSize?: [number, number];
  };
};

/**
 * Canvas element configuration for various element types.
 * Defines the structure for text, image, video, and other elements on the canvas.
 *
 * Adapted from @twick/canvas CanvasElement - mostly reused
 *
 * @example
 * ```js
 * const canvasElement: CanvasElement = {
 *   id: "element-1",
 *   type: "text",
 *   props: {
 *     text: "Hello World",
 *     x: 100,
 *     y: 100,
 *     fontSize: 48
 *   },
 *   s: 0,
 *   e: 10,
 *   frameEffects: [frameEffect]
 * };
 * ```
 */
export type CanvasElement = {
  /** Unique identifier for the element */
  id: string;
  /** Type of element (text, image, video, etc.) */
  type: string;
  /** Element properties and styling */
  props: CanvasElementProps;
  /** Start time of the element in seconds */
  s?: number;
  /** End time of the element in seconds */
  e?: number;
  /** Text content for text elements */
  t?: string;
  /** Array of frame effects applied to the element */
  frameEffects?: FrameEffect[];
  /** Type of timeline element */
  timelineType?: string;
  /** Background color for the element */
  backgroundColor?: string;
  /** Object fit mode for media elements */
  objectFit?: "contain" | "cover" | "fill" | "none";
  /** Frame configuration for the element */
  frame?: {
    /** Size of the frame [width, height] */
    size?: [number, number];
    /** Rotation angle in degrees */
    rotation?: number;
    /** Horizontal scale factor */
    scaleX?: number;
    /** Vertical scale factor */
    scaleY?: number;
    /** Stroke color */
    stroke?: string;
    /** Stroke line width */
    lineWidth?: number;
    /** Corner radius for rounded rectangles */
    radius?: number;
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
  };
};

/**
 * Properties for canvas elements including styling, positioning, and media attributes.
 * Comprehensive type definition covering all possible element properties.
 *
 * Mostly reused from @twick/canvas CanvasElementProps
 *
 * @example
 * ```js
 * const elementProps: CanvasElementProps = {
 *   src: "image.jpg",
 *   text: "Sample Text",
 *   x: 100,
 *   y: 100,
 *   rotation: 45,
 *   scaleX: 1.5,
 *   scaleY: 1.5,
 *   opacity: 0.8
 * };
 * ```
 */
export type CanvasElementProps = {
  // Media properties
  /** Source URL for image/video elements */
  src?: string;
  /** Text content for text elements */
  text?: string;
  /** Playback rate for video elements */
  playbackRate?: number;
  /** Start time offset for video elements */
  time?: number;

  // Positioning & transforms
  /** X coordinate */
  x?: number;
  /** Y coordinate */
  y?: number;
  /** Width of the element */
  width?: number;
  /** Height of the element */
  height?: number;
  /** Rotation angle in degrees */
  rotation?: number;
  /** Horizontal scale factor */
  scaleX?: number;
  /** Vertical scale factor */
  scaleY?: number;

  // Styling
  /** Fill color */
  fill?: string;
  /** Stroke color */
  stroke?: string;
  /** Stroke line width */
  lineWidth?: number;
  /** Opacity (0-1) */
  opacity?: number;
  /** Background color */
  backgroundColor?: string;

  // Text-specific properties
  /** Font family */
  fontFamily?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font weight */
  fontWeight?: string | number;
  /** Text alignment */
  textAlign?: "left" | "center" | "right";
  /** Font style */
  fontStyle?: string;

  // Shadow properties
  /** Shadow color */
  shadowColor?: string;
  /** Shadow blur radius */
  shadowBlur?: number;
  /** Shadow offset [x, y] */
  shadowOffset?: [number, number];

  // Shape-specific properties
  /** Corner radius for rounded rectangles */
  radius?: number;
  /** Radius for circles */
  circleRadius?: number;

  // Frame & effects
  /** Frame size [width, height] */
  frameSize?: [number, number];
  /** Frame position */
  framePosition?: Position;

  // Z-ordering
  /** Z-index for layering */
  zIndex?: number;

  // Additional Konva-specific properties
  /** Whether the element is draggable */
  draggable?: boolean;
  /** Whether the element listens to events */
  listening?: boolean;
};

/**
 * Caption properties for subtitle/caption elements
 * 
 * Reused from @twick/canvas CaptionProps with full structure
 */
export type CaptionProps = {
  /** Font configuration for caption text */
  font?: {
    /** Font family */
    family?: string;
    /** Font size in pixels */
    size?: number;
    /** Text fill color */
    fill?: string;
    /** Font weight */
    weight?: string;
    /** Font style */
    style?: string;
  };
  /** Opacity value (0-1) */
  opacity?: number;
  /** Text stroke color */
  stroke?: string;
  /** Stroke line width */
  lineWidth?: number;
  /** Shadow color */
  shadowColor?: string;
  /** Shadow blur radius */
  shadowBlur?: number;
  /** Shadow offset [x, y] */
  shadowOffset?: [number, number];
  /** X coordinate */
  x: number;
  /** Y coordinate */
  y: number;
  /** Color configuration for caption styling */
  color?: {
    /** Text color */
    text?: string;
    /** Background color */
    background?: string;
    /** Highlight color */
    highlight?: string;
  };
  /** Apply styling to all captions */
  applyToAll?: boolean;
};

