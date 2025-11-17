/**
 * TextEditor Component
 *
 * Mobile-optimized text editor with bottom sheet UI.
 * Based on CapCut/TikTok text editing patterns.
 *
 * Features:
 * - Mobile keyboard support
 * - Font picker (horizontal carousel)
 * - Size/spacing sliders (44px touch targets)
 * - Color picker (swatches grid)
 * - Text alignment buttons
 */
import React from 'react';
export interface TextEditorProps {
    isOpen: boolean;
    onClose: () => void;
    initialText?: string;
    initialFontSize?: number;
    initialColor?: string;
    initialAlignment?: 'left' | 'center' | 'right';
    onApply: (config: TextConfig) => void;
}
export interface TextConfig {
    text: string;
    fontFamily: string;
    fontSize: number;
    color: string;
    backgroundColor?: string;
    textAlign: 'left' | 'center' | 'right';
    letterSpacing: number;
}
export declare const TextEditor: React.FC<TextEditorProps>;
//# sourceMappingURL=TextEditor.d.ts.map