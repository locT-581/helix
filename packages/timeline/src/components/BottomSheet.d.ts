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
import React from 'react';
export interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    height?: 'auto' | 'half' | 'full';
    showHandle?: boolean;
    backdrop?: boolean;
}
export declare const BottomSheet: React.FC<BottomSheetProps>;
//# sourceMappingURL=BottomSheet.d.ts.map