/**
 * Touch-friendly transform controls for mobile devices
 * 44x44px minimum touch targets (WCAG AAA)
 * Handles element selection, drag, scale, rotate on touch devices
 */

import type Konva from 'konva';
import { useEffect, useRef } from 'react';

/**
 * Minimum touch target size (WCAG AAA)
 */
const MIN_TOUCH_TARGET = 44;

interface TouchTransformControlsProps {
  layer: Konva.Layer | null;
  stage: Konva.Stage | null;
  enabled?: boolean;
  onTransformStart?: (target: Konva.Node) => void;
  onTransformEnd?: (target: Konva.Node) => void;
}

interface TransformConfig {
  rotateAnchorOffset: number;
  enabledAnchors: string[];
  anchorSize: number;
  anchorStroke: string;
  anchorFill: string;
  anchorStrokeWidth: number;
  borderStroke: string;
  borderStrokeWidth: number;
  borderDash: number[];
}

/**
 * Get mobile-optimized transform configuration
 * Ensures all touch targets are at least 44x44px (WCAG AAA)
 */
const getMobileTransformConfig = (): TransformConfig => ({
  rotateAnchorOffset: MIN_TOUCH_TARGET, // 44px offset for rotate handle
  enabledAnchors: [
    'top-left',
    'top-right',
    'bottom-left',
    'bottom-right',
  ],
  anchorSize: MIN_TOUCH_TARGET / 2, // 22px radius = 44px diameter
  anchorStroke: '#4285f4', // Google Blue
  anchorFill: '#ffffff',
  anchorStrokeWidth: 2,
  borderStroke: '#4285f4',
  borderStrokeWidth: 2,
  borderDash: [4, 4],
});

/**
 * Touch-friendly transform controls component
 * Provides mobile-optimized handles for dragging, scaling, and rotating elements
 * 
 * @example
 * ```tsx
 * <TouchTransformControls
 *   layer={layer}
 *   stage={stage}
 *   enabled={true}
 *   onTransformStart={(target) => console.log('Transform start:', target.id())}
 *   onTransformEnd={(target) => console.log('Transform end:', target.id())}
 * />
 * ```
 */
export const useTouchTransformControls = ({
  layer,
  stage,
  enabled = true,
  onTransformStart,
  onTransformEnd,
}: TouchTransformControlsProps) => {
  const transformerRef = useRef<Konva.Transformer | null>(null);
  const selectedNodeRef = useRef<Konva.Node | null>(null);

  useEffect(() => {
    if (!layer || !stage || !enabled) return;

    // Dynamically import Konva.Transformer to avoid SSR issues
    import('konva').then(({ default: KonvaModule }) => {
      // Create transformer with mobile-friendly config
      const config = getMobileTransformConfig();
      const transformer = new KonvaModule.Transformer({
        ...config,
        keepRatio: true, // Maintain aspect ratio by default
        centeredScaling: false,
        rotationSnaps: [0, 45, 90, 135, 180, 225, 270, 315], // Snap to 45° increments
        rotationSnapTolerance: 10, // 10° snap tolerance
      });

      transformerRef.current = transformer;
      layer.add(transformer);

      // Handle element selection
      const handleClick = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
        if (!enabled) return;

        // Check if clicked on empty area
        if (e.target === stage) {
          transformer.nodes([]);
          selectedNodeRef.current = null;
          layer.batchDraw();
          return;
        }

        // Check if clicked on transformer itself
        if (e.target.getClassName() === 'Transformer') {
          return;
        }

        // Select the clicked element
        const clickedNode = e.target;

        // Don't select background elements
        if (clickedNode.id() === 'background') {
          transformer.nodes([]);
          selectedNodeRef.current = null;
          layer.batchDraw();
          return;
        }

        // Attach transformer to clicked element
        transformer.nodes([clickedNode]);
        selectedNodeRef.current = clickedNode;
        layer.batchDraw();

        if (onTransformStart) {
          onTransformStart(clickedNode);
        }
      };

      // Handle transform end
      const handleTransformEnd = () => {
        if (selectedNodeRef.current && onTransformEnd) {
          onTransformEnd(selectedNodeRef.current);
        }
      };

      stage.on('click tap', handleClick);
      transformer.on('transformend', handleTransformEnd);

      // Cleanup
      return () => {
        stage.off('click tap', handleClick);
        transformer.off('transformend', handleTransformEnd);
        transformer.destroy();
        transformerRef.current = null;
      };
    });
  }, [layer, stage, enabled, onTransformStart, onTransformEnd]);

  /**
   * Select element programmatically
   */
  const selectElement = (node: Konva.Node | null) => {
    if (!transformerRef.current || !layer) return;

    if (node) {
      transformerRef.current.nodes([node]);
      selectedNodeRef.current = node;
    } else {
      transformerRef.current.nodes([]);
      selectedNodeRef.current = null;
    }

    layer.batchDraw();
  };

  /**
   * Deselect current element
   */
  const deselectElement = () => {
    selectElement(null);
  };

  /**
   * Get currently selected element
   */
  const getSelectedElement = (): Konva.Node | null => {
    return selectedNodeRef.current;
  };

  return {
    selectElement,
    deselectElement,
    getSelectedElement,
    transformer: transformerRef.current,
  };
};
