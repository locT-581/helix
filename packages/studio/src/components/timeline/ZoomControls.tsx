/**
 * ZoomControls - Timeline zoom control buttons
 * 
 * Provides +/- buttons to control timeline zoom level:
 * - Touch-friendly 44x44px buttons (WCAG AAA)
 * - Zoom in/out with incremental steps
 * - Visual feedback on min/max zoom
 * - Haptic feedback on interaction
 * 
 * @module ZoomControls
 */

import { styled } from '@helix/ui';
import { TOUCH_TARGET } from '@helix/core';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { triggerHaptic, HapticPattern } from '../../hooks/use-haptic';
import type { JSX } from 'react';

/**
 * Props for ZoomControls component
 */
export interface ZoomControlsProps {
  /** Current zoom level (0.5 - 5) */
  zoom: number;
  /** Minimum zoom level */
  minZoom?: number;
  /** Maximum zoom level */
  maxZoom?: number;
  /** Zoom step increment */
  step?: number;
  /** Callback when zoom changes */
  onZoomChange?: (zoom: number) => void;
}

/**
 * Controls container
 * - Fixed position (top-right of timeline)
 * - Flex layout for buttons
 * - Semi-transparent background
 */
const ControlsContainer = styled('div', {
  position: 'absolute',
  top: '$2',
  right: '$2',
  display: 'flex',
  gap: '$1',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  borderRadius: '$md',
  padding: '$1',
  backdropFilter: 'blur(4px)',
  zIndex: 10,
});

/**
 * Zoom button
 * - Touch-friendly size (44x44px)
 * - Icon-only (no text)
 * - Disabled state when at min/max
 */
const ZoomButton = styled('button', {
  width: TOUCH_TARGET.MIN,
  height: TOUCH_TARGET.MIN,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '$neutral700',
  border: '1px solid $neutral600',
  borderRadius: '$sm',
  color: '$neutral100',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  touchAction: 'manipulation',
  WebkitTapHighlightColor: 'transparent',
  
  '&:hover:not(:disabled)': {
    backgroundColor: '$neutral600',
    borderColor: '$neutral500',
  },
  
  '&:active:not(:disabled)': {
    backgroundColor: '$neutral500',
    transform: 'scale(0.95)',
  },
  
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  
  // Focus visible for keyboard navigation
  '&:focus-visible': {
    outline: '2px solid $primary',
    outlineOffset: '2px',
  },
});

/**
 * Zoom level indicator
 * - Shows current zoom percentage
 * - Small font for compact display
 */
const ZoomIndicator = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 $2',
  fontSize: '$xs',
  fontWeight: '$medium',
  color: '$neutral300',
  whiteSpace: 'nowrap',
  userSelect: 'none',
});

/**
 * ZoomControls component
 * 
 * Zoom control buttons for timeline:
 * - Zoom in (+) button
 * - Zoom out (-) button
 * - Current zoom percentage display
 * - Haptic feedback on interaction
 * 
 * @example
 * ```tsx
 * <ZoomControls
 *   zoom={1.5}
 *   minZoom={0.5}
 *   maxZoom={5}
 *   step={0.25}
 *   onZoomChange={(zoom) => setZoom(zoom)}
 * />
 * ```
 */
export const ZoomControls = ({
  zoom,
  minZoom = 0.5,
  maxZoom = 5,
  step = 0.25,
  onZoomChange,
}: ZoomControlsProps): JSX.Element => {
  /**
   * Check if at min/max zoom
   */
  const isAtMin = zoom <= minZoom;
  const isAtMax = zoom >= maxZoom;

  /**
   * Handle zoom in
   */
  const handleZoomIn = (): void => {
    if (isAtMax) return;
    
    const newZoom = Math.min(zoom + step, maxZoom);
    onZoomChange?.(newZoom);
    
    // Haptic feedback
    triggerHaptic(HapticPattern.Light);
  };

  /**
   * Handle zoom out
   */
  const handleZoomOut = (): void => {
    if (isAtMin) return;
    
    const newZoom = Math.max(zoom - step, minZoom);
    onZoomChange?.(newZoom);
    
    // Haptic feedback
    triggerHaptic(HapticPattern.Light);
  };

  /**
   * Format zoom as percentage
   */
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <ControlsContainer>
      <ZoomButton
        onClick={handleZoomOut}
        disabled={isAtMin}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <ZoomOut size={20} />
      </ZoomButton>
      
      <ZoomIndicator>
        {zoomPercentage}%
      </ZoomIndicator>
      
      <ZoomButton
        onClick={handleZoomIn}
        disabled={isAtMax}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <ZoomIn size={20} />
      </ZoomButton>
    </ControlsContainer>
  );
};
