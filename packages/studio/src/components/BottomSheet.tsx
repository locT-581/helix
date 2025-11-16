import { ReactNode, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { styled } from '@helix/ui';
import { clamp } from '@helix/core';

/**
 * BottomSheet Component
 * 
 * Mobile-first bottom sheet with swipe gestures and snap points.
 * Supports drag-to-dismiss, backdrop overlay, and smooth animations.
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <BottomSheet
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   snapPoints={[0.5, 0.9]}
 * >
 *   <h2>Properties Panel</h2>
 *   <VideoSettings />
 * </BottomSheet>
 * ```
 */

export interface BottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean;
  
  /** Callback when sheet should close */
  onClose: () => void;
  
  /** Sheet content */
  children: ReactNode;
  
  /** Snap points as viewport height percentage (0-1) */
  snapPoints?: number[];
  
  /** Initial snap point index */
  initialSnapPoint?: number;
  
  /** Enable backdrop overlay */
  showBackdrop?: boolean;
  
  /** Enable drag handle */
  showDragHandle?: boolean;
}

const Backdrop = styled(motion.div, {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 1000,
  
  // Prevent scroll on body when sheet is open
  touchAction: 'none',
});

const SheetContainer = styled(motion.div, {
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: '$surface',
  borderTopLeftRadius: '$4',
  borderTopRightRadius: '$4',
  boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.1)',
  zIndex: 1001,
  
  // Prevent content overflow
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
  
  // Touch optimization
  touchAction: 'pan-y',
  WebkitOverflowScrolling: 'touch',
});

const DragHandle = styled('div', {
  width: '$8', // 32px
  height: '$1', // 4px
  backgroundColor: '$border',
  borderRadius: '$full',
  margin: '$3 auto $2',
  flexShrink: 0,
  cursor: 'grab',
  
  '&:active': {
    cursor: 'grabbing',
  },
});

const SheetContent = styled('div', {
  flex: 1,
  overflow: 'auto',
  padding: '0 $4 $6',
  
  // Smooth scrolling
  WebkitOverflowScrolling: 'touch',
  overscrollBehavior: 'contain',
});

export const BottomSheet = ({
  isOpen,
  onClose,
  children,
  snapPoints = [0.5, 0.9],
  initialSnapPoint = 0,
  showBackdrop = true,
  showDragHandle = true,
}: BottomSheetProps) => {
  const controls = useAnimation();
  const currentSnapIndex = initialSnapPoint;
  
  // Calculate snap point heights
  const getSnapHeight = (snapPoint: number): number => {
    return window.innerHeight * snapPoint;
  };
  
  // Handle drag gesture
  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, vy], cancel }) => {
      // Swipe down to close
      if (my > 100 && vy > 0.5) {
        onClose();
        cancel();
        return;
      }
      
      // Constrain drag within bounds
      const currentHeight = getSnapHeight(snapPoints[currentSnapIndex] ?? 0.5);
      const newY = clamp(-my, 0, currentHeight);
      
      controls.start({
        y: down ? newY : 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });
    },
    {
      from: () => [0, controls],
      bounds: { top: -window.innerHeight, bottom: 0 },
      rubberband: true,
    }
  );
  
  // Animate in/out on open/close
  useEffect(() => {
    if (isOpen) {
      controls.start({
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });
    } else {
      controls.start({
        y: window.innerHeight,
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      });
    }
  }, [isOpen, controls]);
  
  if (!isOpen) return null;
  
  return (
    <>
      {showBackdrop && (
        <Backdrop
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}
      
      <SheetContainer
        initial={{ y: window.innerHeight }}
        animate={controls}
        style={{ height: `${(snapPoints[currentSnapIndex] ?? 0.5) * 100}vh` }}
        {...bind()}
      >
        {showDragHandle && <DragHandle />}
        <SheetContent>{children}</SheetContent>
      </SheetContainer>
    </>
  );
};
