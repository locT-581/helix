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

import React, { useCallback, useState } from 'react';
import { BottomSheet } from './BottomSheet';

// Constants from @helix/core (avoiding import to prevent tsconfig errors)
const TOUCH_TARGET = {
  MIN: 44,
  RECOMMENDED: 48,
  TIMELINE_ELEMENT: 60,
  MODAL_HANDLE: 40,
} as const;

const DEFAULT_THEME_COLORS = {
  primary: '#7C3AED',
  secondary: '#06B6D4',
  accent: '#3B82F6',
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  border: '#334155',
} as const;

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

const FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Playfair', value: 'Playfair Display, serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Open Sans', value: 'Open Sans, sans-serif' },
  { name: 'Raleway', value: 'Raleway, sans-serif' },
];

const COLOR_PRESETS = [
  DEFAULT_THEME_COLORS.text, // White
  '#000000', // Black
  DEFAULT_THEME_COLORS.primary, // Purple
  DEFAULT_THEME_COLORS.secondary, // Cyan
  DEFAULT_THEME_COLORS.accent, // Blue
  DEFAULT_THEME_COLORS.error, // Red
  DEFAULT_THEME_COLORS.warning, // Orange
  DEFAULT_THEME_COLORS.success, // Green
  '#EC4899', // Pink
  '#F59E0B', // Yellow
  '#8B5CF6', // Violet
  '#14B8A6', // Teal
];

export const TextEditor: React.FC<TextEditorProps> = ({
  isOpen,
  onClose,
  initialText = '',
  initialFontSize = 24,
  initialColor = DEFAULT_THEME_COLORS.text,
  initialAlignment = 'center',
  onApply,
}) => {
  const [text, setText] = useState(initialText);
  const [fontFamily, setFontFamily] = useState(FONTS[0]?.value ?? 'Inter');
  const [fontSize, setFontSize] = useState(initialFontSize);
  const [color, setColor] = useState(initialColor);
  const [backgroundColor, setBackgroundColor] = useState<string | undefined>(undefined);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>(initialAlignment);
  const [letterSpacing, setLetterSpacing] = useState(0);

  const handleApply = useCallback(() => {
    onApply({
      text,
      fontFamily,
      fontSize,
      color,
      ...(backgroundColor ? { backgroundColor } : {}),
      textAlign,
      letterSpacing,
    });
    onClose();
  }, [text, fontFamily, fontSize, color, backgroundColor, textAlign, letterSpacing, onApply, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Edit Text" height="auto">
      <div className="px-6 py-4 space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text..."
            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
            rows={3}
            autoFocus
            style={{ minHeight: `${TOUCH_TARGET.RECOMMENDED}px` }}
          />
        </div>

        {/* Font Picker - Horizontal Carousel */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Font</label>
          <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {FONTS.map((font) => (
              <button
                key={font.value}
                type="button"
                onClick={() => setFontFamily(font.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                  fontFamily === font.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                style={{
                  fontFamily: font.value,
                  minWidth: '80px',
                  minHeight: `${TOUCH_TARGET.MIN}px`,
                }}
              >
                {font.name}
              </button>
            ))}
          </div>
        </div>

        {/* Font Size Slider */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Size: {fontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="96"
            step="1"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            style={{ height: `${TOUCH_TARGET.MIN}px` }}
          />
        </div>

        {/* Letter Spacing Slider */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Spacing: {letterSpacing}px
          </label>
          <input
            type="range"
            min="-5"
            max="20"
            step="1"
            value={letterSpacing}
            onChange={(e) => setLetterSpacing(Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
            style={{ height: `${TOUCH_TARGET.MIN}px` }}
          />
        </div>

        {/* Text Color Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Text Color</label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PRESETS.map((presetColor) => (
              <button
                key={presetColor}
                type="button"
                onClick={() => setColor(presetColor)}
                className={`rounded-lg transition-transform ${
                  color === presetColor ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 scale-110' : ''
                }`}
                style={{
                  backgroundColor: presetColor,
                  width: `${TOUCH_TARGET.MIN}px`,
                  height: `${TOUCH_TARGET.MIN}px`,
                }}
                aria-label={`Color ${presetColor}`}
              />
            ))}
          </div>
        </div>

        {/* Background Color Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Background (Optional)</label>
          <div className="grid grid-cols-6 gap-2">
            <button
              type="button"
              onClick={() => setBackgroundColor(undefined)}
              className={`rounded-lg border-2 border-dashed transition-transform ${
                backgroundColor === undefined
                  ? 'border-purple-500 ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 scale-110'
                  : 'border-slate-600'
              }`}
              style={{
                width: `${TOUCH_TARGET.MIN}px`,
                height: `${TOUCH_TARGET.MIN}px`,
              }}
              aria-label="No background"
            >
              <span className="text-xs text-slate-400">None</span>
            </button>
            {COLOR_PRESETS.slice(0, 5).map((presetColor) => (
              <button
                key={`bg-${presetColor}`}
                type="button"
                onClick={() => setBackgroundColor(presetColor)}
                className={`rounded-lg transition-transform ${
                  backgroundColor === presetColor
                    ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 scale-110'
                    : ''
                }`}
                style={{
                  backgroundColor: presetColor,
                  width: `${TOUCH_TARGET.MIN}px`,
                  height: `${TOUCH_TARGET.MIN}px`,
                }}
                aria-label={`Background ${presetColor}`}
              />
            ))}
          </div>
        </div>

        {/* Text Alignment */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Alignment</label>
          <div className="flex gap-2">
            {['left', 'center', 'right'].map((align) => (
              <button
                key={align}
                type="button"
                onClick={() => setTextAlign(align as 'left' | 'center' | 'right')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  textAlign === align
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                style={{ minHeight: `${TOUCH_TARGET.MIN}px` }}
              >
                {align.charAt(0).toUpperCase() + align.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Text Preview */}
        <div className="border border-slate-700 rounded-lg p-4 bg-slate-800">
          <p className="text-sm text-slate-400 mb-2">Preview:</p>
          <div
            style={{
              fontFamily,
              fontSize: `${fontSize}px`,
              color,
              backgroundColor,
              textAlign,
              letterSpacing: `${letterSpacing}px`,
              padding: backgroundColor ? '8px' : '0',
              borderRadius: backgroundColor ? '4px' : '0',
            }}
          >
            {text || 'Enter text to preview...'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 px-6 py-3 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors"
            style={{ minHeight: `${TOUCH_TARGET.RECOMMENDED}px` }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            style={{ minHeight: `${TOUCH_TARGET.RECOMMENDED}px` }}
          >
            Apply
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
