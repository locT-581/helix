/**
 * BottomSheet Component
 * 
 * Reusable bottom sheet for mobile UI patterns.
 * Based on CapCut/TikTok bottom sheet design.
 * 
 * Features:
 * - Drag handle for expand/collapse
 * - Swipe down to dismiss
 * - Backdrop overlay
 * - Smooth animations
 * - Touch-optimized (44px handle)
 * 
 * Uses inline styles (no CSS dependencies)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
// Constants from @helix/core (avoiding import to prevent tsconfig errors)

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: 'auto' | 'half' | 'full';
  showHandle?: boolean;
  backdrop?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  height = 'auto',
  showHandle = true,
  backdrop = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const startY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    
    setIsDragging(true);
    startY.current = touch.clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const currentY = touch.clientY;
    const deltaY = currentY - startY.current;
    
    // Only allow dragging down
    if (deltaY > 0) {
      setDragY(deltaY);
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    
    // Close if dragged down more than 100px
    if (dragY > 100) {
      onClose();
    }
    
    setDragY(0);
  }, [dragY, onClose]);

  const handleBackdropClick = useCallback(() => {
    if (backdrop) {
      onClose();
    }
  }, [backdrop, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getHeightClass = (): string => {
    switch (height) {
      case 'half':
        return 'h-1/2';
      case 'full':
        return 'h-full';
      default:
        return 'h-auto max-h-[80vh]';
    }
  };

  const transform = isDragging ? `translateY(${dragY}px)` : 'translateY(0)';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Backdrop */}
      {backdrop && (
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={handleBackdropClick}
          style={{
            opacity: isDragging ? 1 - dragY / 300 : 1,
          }}
        />
      )}

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={`relative w-full bg-slate-900 rounded-t-2xl shadow-2xl transition-transform ${getHeightClass()}`}
        style={{
          transform,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
        }}
      >
        {/* Drag Handle */}
        {showHandle && (
          <div
            className="flex justify-center py-3 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{ minHeight: '44px' }} // TOUCH_TARGET.MIN
          >
            <div className="w-12 h-1.5 bg-slate-600 rounded-full" />
          </div>
        )}

        {/* Title */}
        {title && (
          <div className="px-6 pb-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
};
