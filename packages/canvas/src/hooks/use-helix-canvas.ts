/**
 * useHelixCanvas Hook - Konva.js Canvas Management
 * Adapted from useTwickCanvas (Fabric.js) for mobile-first Helix canvas
 * 
 * Key differences from Fabric.js:
 * - Konva.Stage instead of FabricCanvas
 * - Konva.Layer instead of canvas methods
 * - Event names: mouseup → click, drag → dragend
 * - No built-in controls (use Transformer separately)
 * - Different event data structure
 */

import { useRef, useState } from "react";
import Konva from "konva";
import type { Dimensions } from "@helix/media";
import type {
  CanvasMetadata,
  CanvasProps,
  CanvasElement,
  CaptionProps,
} from "../types";
import {
  clearCanvas,
  convertToVideoPosition,
  createCanvas,
  getCanvasContext,
  getCurrentFrameEffect,
  reorderElementsByZIndex,
} from "../helpers/canvas.util";
import { CANVAS_OPERATIONS, ELEMENT_TYPES } from "../helpers/constants";
import {
  addImageElement,
  addVideoElement,
  addRectElement,
  addTextElement,
  addCaptionElement,
  addBackgroundColor,
  addCircleElement,
} from "../components/elements";

/**
 * Custom hook to manage a Konva.js canvas and associated operations.
 * Provides functionality for canvas initialization, element management,
 * and event handling for interactive canvas operations.
 *
 * @param onCanvasReady - Callback executed when the canvas is ready
 * @param onCanvasOperation - Callback executed on canvas operations such as item selection or updates
 * @returns Object containing canvas-related functions and state
 *
 * @example
 * ```js
 * const { helixStage, buildCanvas, addElementToCanvas } = useHelixCanvas({
 *   onCanvasReady: (stage) => console.log('Canvas ready:', stage),
 *   onCanvasOperation: (operation, data) => console.log('Operation:', operation, data)
 * });
 * ```
 */
export const useHelixCanvas = ({
  onCanvasReady,
  onCanvasOperation,
}: {
  onCanvasReady?: (stage: Konva.Stage) => void;
  onCanvasOperation?: (operation: string, data: any) => void;
}) => {
  const [helixStage, setHelixStage] = useState<Konva.Stage | null>(null); // Konva Stage instance
  const [helixLayer, setHelixLayer] = useState<Konva.Layer | null>(null); // Main layer for elements
  const elementMap = useRef<Record<string, any>>({}); // Maps element IDs to their data
  const elementFrameMap = useRef<Record<string, any>>({}); // Maps element IDs to their frame effects
  const helixStageRef = useRef<Konva.Stage | null>(null);
  const helixLayerRef = useRef<Konva.Layer | null>(null);
  const videoSizeRef = useRef<Dimensions>({ width: 1, height: 1 }); // Stores the video dimensions
  const canvasResolutionRef = useRef<Dimensions>({ width: 1, height: 1 }); // Stores the canvas dimensions
  const captionPropsRef = useRef<CaptionProps | null>(null);
  const canvasMetadataRef = useRef<CanvasMetadata>({
    width: 0,
    height: 0,
    aspectRatio: 0,
    scaleX: 1,
    scaleY: 1,
  }); // Metadata for the canvas

  /**
   * Updates canvas metadata when the video size changes.
   * Recalculates scale factors based on the new video dimensions
   * to maintain proper coordinate mapping between canvas and video.
   *
   * @param videoSize - New video dimensions
   *
   * @example
   * ```js
   * onVideoSizeChange({ width: 1920, height: 1080 });
   * ```
   */
  const onVideoSizeChange = (videoSize: Dimensions): void => {
    if (videoSize) {
      videoSizeRef.current = videoSize;
      canvasMetadataRef.current.scaleX =
        canvasMetadataRef.current.width / videoSize.width;
      canvasMetadataRef.current.scaleY =
        canvasMetadataRef.current.height / videoSize.height;
    }
  };

  /**
   * Initializes the Konva.js Stage and Layer with the provided configuration.
   * Creates a new stage instance with the specified properties and sets up
   * event listeners for interactive operations.
   *
   * @param props - Canvas configuration properties including size, colors, and behavior settings
   *
   * @example
   * ```js
   * buildCanvas({
   *   videoSize: { width: 1920, height: 1080 },
   *   canvasSize: { width: 800, height: 600 },
   *   container: containerElement,
   *   backgroundColor: "#000000"
   * });
   * ```
   */
  const buildCanvas = ({
    videoSize,
    canvasSize,
    container,
    backgroundColor = "#000000",
    forceBuild = false,
  }: CanvasProps & { forceBuild?: boolean }): void => {
    if (!container) return;

    if (
      !forceBuild &&
      canvasResolutionRef.current.width === canvasSize.width &&
      canvasResolutionRef.current.height === canvasSize.height
    ) {
      return;
    }

    // Dispose of the old stage if it exists
    if (helixStageRef.current) {
      console.log("Destroying helixStage");
      helixStageRef.current.off("click", handleClick);
      helixStageRef.current.off("dragend", handleDragEnd);
      helixStageRef.current.off("transformend", handleTransformEnd);
      helixStageRef.current.destroy();
    }

    // Create a new stage and layer, update metadata
    const { stage, canvasMetadata } = createCanvas({
      videoSize,
      canvasSize,
      container,
      backgroundColor,
    });
    
    // Get main layer from stage
    const layer = stage.children[0] as Konva.Layer;
    
    canvasMetadataRef.current = canvasMetadata;
    videoSizeRef.current = videoSize;
    
    // Attach event listeners
    stage.on("click", handleClick);
    stage.on("dragend", handleDragEnd);
    stage.on("transformend", handleTransformEnd);
    
    canvasResolutionRef.current = canvasSize;
    setHelixStage(stage);
    setHelixLayer(layer);
    helixStageRef.current = stage;
    helixLayerRef.current = layer;
    
    // Notify when canvas is ready
    if (onCanvasReady) {
      onCanvasReady(stage);
    }
  };

  /**
   * Handles click events on the canvas.
   * Processes user interactions for element selection.
   *
   * @param event - Konva KonvaEventObject containing interaction details
   */
  const handleClick = (event: Konva.KonvaEventObject<MouseEvent>): void => {
    const target = event.target;
    if (target && target !== helixStageRef.current) {
      const elementId = target.id();
      if (elementId && elementMap.current[elementId]) {
        onCanvasOperation?.(
          CANVAS_OPERATIONS.ITEM_SELECTED,
          elementMap.current[elementId]
        );
      }
    }
  };

  /**
   * Handles drag end events on the canvas.
   * Updates element position after dragging.
   *
   * @param event - Konva KonvaEventObject containing drag details
   */
  const handleDragEnd = (event: Konva.KonvaEventObject<DragEvent>): void => {
    const target = event.target;
    if (!target || target === helixStageRef.current) return;

    const elementId = target.id();
    if (!elementId || !elementMap.current[elementId]) return;

    const { x, y } = convertToVideoPosition(
      target.x(),
      target.y(),
      canvasMetadataRef.current,
      videoSizeRef.current
    );

    if (elementMap.current[elementId].type === "caption") {
      if (captionPropsRef.current?.applyToAll) {
        onCanvasOperation?.(CANVAS_OPERATIONS.CAPTION_PROPS_UPDATED, {
          element: elementMap.current[elementId],
          props: {
            ...captionPropsRef.current,
            x,
            y,
          },
        });
      } else {
        elementMap.current[elementId] = {
          ...elementMap.current[elementId],
          props: {
            ...elementMap.current[elementId].props,
            x,
            y,
          },
        };
        onCanvasOperation?.(
          CANVAS_OPERATIONS.ITEM_UPDATED,
          elementMap.current[elementId]
        );
      }
    } else {
      // Update element position
      elementMap.current[elementId] = {
        ...elementMap.current[elementId],
        props: {
          ...elementMap.current[elementId].props,
          rotation: target.rotation(),
          x,
          y,
        },
      };
      onCanvasOperation?.(
        CANVAS_OPERATIONS.ITEM_UPDATED,
        elementMap.current[elementId]
      );
    }
  };

  /**
   * Handles transform end events on the canvas.
   * Updates element properties after scaling or rotating with Transformer.
   *
   * @param event - Konva KonvaEventObject containing transform details
   */
  const handleTransformEnd = (event: Konva.KonvaEventObject<Event>): void => {
    const target = event.target;
    if (!target || target === helixStageRef.current) return;

    const elementId = target.id();
    if (!elementId || !elementMap.current[elementId]) return;

    const { x, y } = convertToVideoPosition(
      target.x(),
      target.y(),
      canvasMetadataRef.current,
      videoSizeRef.current
    );

    // Handle groups (images/videos with frames)
    if (target.getClassName() === "Group") {
      const currentFrameEffect = elementFrameMap.current[elementId];
      let updatedFrameSize;
      
      if (currentFrameEffect) {
        updatedFrameSize = [
          currentFrameEffect.props.frameSize[0] * target.scaleX(),
          currentFrameEffect.props.frameSize[1] * target.scaleY(),
        ];
      } else {
        updatedFrameSize = [
          elementMap.current[elementId].frame.size[0] * target.scaleX(),
          elementMap.current[elementId].frame.size[1] * target.scaleY(),
        ];
      }

      if (currentFrameEffect) {
        elementMap.current[elementId] = {
          ...elementMap.current[elementId],
          frameEffects: (
            elementMap.current[elementId].frameEffects || []
          ).map((frameEffect: any) =>
            frameEffect.id === currentFrameEffect?.id
              ? {
                  ...frameEffect,
                  props: {
                    ...frameEffect.props,
                    framePosition: { x, y },
                    frameSize: updatedFrameSize,
                    rotation: target.rotation(),
                  },
                }
              : frameEffect
          ),
        };
        elementFrameMap.current[elementId] = {
          ...elementFrameMap.current[elementId],
          framePosition: { x, y },
          frameSize: updatedFrameSize,
        };
      } else {
        elementMap.current[elementId] = {
          ...elementMap.current[elementId],
          frame: {
            ...elementMap.current[elementId].frame,
            rotation: target.rotation(),
            size: updatedFrameSize,
            x,
            y,
          },
        };
      }
    } else if (target.getClassName() === "Text") {
      // Handle text elements
      elementMap.current[elementId] = {
        ...elementMap.current[elementId],
        props: {
          ...elementMap.current[elementId].props,
          rotation: target.rotation(),
          x,
          y,
        },
      };
    } else if (target.getClassName() === "Circle") {
      // Handle circle elements
      const radius = Number(
        (
          elementMap.current[elementId].props.radius * target.scaleX()
        ).toFixed(2)
      );
      elementMap.current[elementId] = {
        ...elementMap.current[elementId],
        props: {
          ...elementMap.current[elementId].props,
          rotation: target.rotation(),
          radius,
          height: radius * 2,
          width: radius * 2,
          x,
          y,
        },
      };
    } else {
      // Handle rect and other shape elements
      elementMap.current[elementId] = {
        ...elementMap.current[elementId],
        props: {
          ...elementMap.current[elementId].props,
          rotation: target.rotation(),
          width: elementMap.current[elementId].props.width * target.scaleX(),
          height: elementMap.current[elementId].props.height * target.scaleY(),
          x,
          y,
        },
      };
    }

    onCanvasOperation?.(
      CANVAS_OPERATIONS.ITEM_UPDATED,
      elementMap.current[elementId]
    );
  };

  /**
   * Sets elements to the canvas.
   * Adds multiple elements to the canvas with optional cleanup and ordering.
   * Supports batch operations for efficient element management.
   *
   * @param options - Object containing elements, seek time, and additional options
   *
   * @example
   * ```js
   * await setCanvasElements({
   *   elements: [element1, element2, element3],
   *   seekTime: 5.0,
   *   cleanAndAdd: true
   * });
   * ```
   */
  const setCanvasElements = async ({
    elements,
    seekTime = 0,
    captionProps,
    cleanAndAdd = false,
  }: {
    elements: CanvasElement[];
    seekTime?: number;
    captionProps?: CaptionProps;
    cleanAndAdd?: boolean;
  }): Promise<void> => {
    if (!helixStageRef.current || !helixLayerRef.current || !getCanvasContext(helixStageRef.current)) {
      console.warn("Canvas not properly initialized");
      return;
    }

    try {
      if (cleanAndAdd && getCanvasContext(helixStageRef.current)) {
        // Clear canvas before adding new elements
        clearCanvas(helixStageRef.current);
      }

      captionPropsRef.current = captionProps ?? null;
      
      await Promise.all(
        elements.map(async (element, index) => {
          try {
            if (!element) {
              console.warn("Element not found");
              return;
            }
            await addElementToCanvas({
              element,
              index,
              reorder: false,
              seekTime,
              ...(captionProps ? { captionProps } : {}),
            });
          } catch (error) {
            console.error(`Error adding element ${element.id}:`, error);
          }
        })
      );
      
      if (helixStageRef.current) {
        reorderElementsByZIndex(helixStageRef.current);
      }
    } catch (error) {
      console.error("Error in setCanvasElements:", error);
    }
  };

  /**
   * Add element to the canvas.
   * Adds a single element to the canvas based on its type and properties.
   * Handles different element types (video, image, text, etc.) with appropriate rendering.
   *
   * @param options - Object containing element data, index, and rendering options
   *
   * @example
   * ```js
   * await addElementToCanvas({
   *   element: videoElement,
   *   index: 0,
   *   reorder: true,
   *   seekTime: 2.5
   * });
   * ```
   */
  const addElementToCanvas = async ({
    element,
    index,
    reorder = true,
    seekTime,
    captionProps,
  }: {
    element: CanvasElement;
    index: number;
    reorder: boolean;
    seekTime?: number;
    captionProps?: CaptionProps;
  }): Promise<void> => {
    if (!helixStageRef.current || !helixLayerRef.current) {
      console.warn("Canvas not initialized");
      return;
    }

    const layer = helixLayerRef.current;

    // Add element based on type
    switch (element.type) {
      case ELEMENT_TYPES.VIDEO:
        const currentFrameEffect = getCurrentFrameEffect(
          element,
          seekTime || 0
        );
        elementFrameMap.current[element.id] = currentFrameEffect ?? undefined;
        const snapTime =
          ((seekTime || 0) - (element?.s || 0)) *
            (element?.props?.playbackRate || 1) +
          (element?.props?.time || 0);
        await addVideoElement({
          element,
          index,
          layer,
          canvasMetadata: canvasMetadataRef.current,
          ...(currentFrameEffect ? { currentFrameEffect } : {}),
          snapTime,
        });
        if (element.timelineType === "scene") {
          addBackgroundColor({
            element,
            index,
            layer,
            canvasMetadata: canvasMetadataRef.current,
          });
        }
        break;
      case ELEMENT_TYPES.IMAGE:
        await addImageElement({
          element,
          index,
          layer,
          canvasMetadata: canvasMetadataRef.current,
        });
        if (element.timelineType === "scene") {
          addBackgroundColor({
            element,
            index,
            layer,
            canvasMetadata: canvasMetadataRef.current,
          });
        }
        break;
      case ELEMENT_TYPES.RECT:
        addRectElement({
          element,
          index,
          layer,
          canvasMetadata: canvasMetadataRef.current,
        });
        break;
      case ELEMENT_TYPES.CIRCLE:
        addCircleElement({
          element,
          index,
          layer,
          canvasMetadata: canvasMetadataRef.current,
        });
        break;
      case ELEMENT_TYPES.TEXT:
        addTextElement({
          element,
          index,
          layer,
          canvasMetadata: canvasMetadataRef.current,
        });
        break;
      case ELEMENT_TYPES.CAPTION:
        if (captionProps) {
          addCaptionElement({
            element,
            index,
            layer,
            captionProps,
            canvasMetadata: canvasMetadataRef.current,
          });
        }
        break;
      default:
        break;
    }
    
    elementMap.current[element.id] = element;
    
    if (reorder && helixStageRef.current) {
      reorderElementsByZIndex(helixStageRef.current);
    }
  };

  return {
    helixStage,
    helixLayer,
    buildCanvas,
    onVideoSizeChange,
    addElementToCanvas,
    setCanvasElements,
  };
};
