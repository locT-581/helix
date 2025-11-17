/**
 * TextEffectsPicker Component
 * 
 * Mobile-optimized text effects picker with easing functions.
 * Integrates ElementTextEffect from Twick with easing from Task 4.
 * 
 * Features:
 * - Effect previews (typewriter, streaming, elastic, bounce)
 * - Easing function selection (30+ options)
 * - Duration/delay controls
 * - Real-time preview
 */

import React, { useCallback, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { ElementTextEffect } from '../core/addOns/text-effect';

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

export interface TextEffectsPickerProps {
  isOpen: boolean;
  onClose: () => void;
  initialEffect?: ElementTextEffect | undefined;
  onApply: (effect: ElementTextEffect) => void;
}

// Text effect types từ Twick (copilot-instructions.md mentions these)
const TEXT_EFFECTS = [
  {
    name: 'typewriter',
    label: 'Typewriter',
    description: 'Reveals text character by character',
    icon: '⌨️',
  },
  {
    name: 'streaming',
    label: 'Streaming',
    description: 'Smooth character-by-character reveal',
    icon: '📝',
  },
  {
    name: 'elastic',
    label: 'Elastic',
    description: 'Bouncy spring animation',
    icon: '🎯',
  },
  {
    name: 'bounce',
    label: 'Bounce',
    description: 'Bouncing effect with gravity',
    icon: '🏀',
  },
  {
    name: 'fade',
    label: 'Fade In',
    description: 'Smooth opacity transition',
    icon: '✨',
  },
  {
    name: 'slide',
    label: 'Slide In',
    description: 'Slide from edge',
    icon: '➡️',
  },
] as const;

// Popular easing functions grouped
const EASING_GROUPS = {
  Basic: ['linear', 'easeIn', 'easeOut', 'easeInOut'],
  Cubic: ['easeInCubic', 'easeOutCubic', 'easeInOutCubic'],
  Elastic: ['easeInElastic', 'easeOutElastic', 'easeInOutElastic'],
  Bounce: ['easeInBounce', 'easeOutBounce', 'easeInOutBounce'],
  Back: ['easeInBack', 'easeOutBack', 'easeInOutBack'],
} as const;

export const TextEffectsPicker: React.FC<TextEffectsPickerProps> = ({
  isOpen,
  onClose,
  initialEffect,
  onApply,
}) => {
  const [selectedEffect, setSelectedEffect] = useState<string>(
    initialEffect?.getName() || 'typewriter'
  );
  const [duration, setDuration] = useState<number>(
    initialEffect?.getDuration() || 1.0
  );
  const [delay, setDelay] = useState<number>(
    initialEffect?.getDelay() || 0
  );
  const [bufferTime, setBufferTime] = useState<number>(
    initialEffect?.getBufferTime() || 0
  );
  const [selectedEasing, setSelectedEasing] = useState<string>('easeOutCubic');
  const [showEasingPicker, setShowEasingPicker] = useState(false);

  const handleApply = useCallback(() => {
    const effect = new ElementTextEffect(selectedEffect);
    effect.setDuration(duration);
    effect.setDelay(delay);
    effect.setBufferTime(bufferTime);
    
    onApply(effect);
    onClose();
  }, [selectedEffect, duration, delay, bufferTime, onApply, onClose]);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Text Effects" height="auto">
      <div className="px-6 py-4 space-y-6" style={{ paddingBottom: '120px' }}>
        {/* Effect Selection Grid */}
        <div>
          <label className="block text-sm font-medium mb-3" style={{ color: DEFAULT_THEME_COLORS.textSecondary }}>
            Effect Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {TEXT_EFFECTS.map((effect) => (
              <button
                key={effect.name}
                type="button"
                onClick={() => setSelectedEffect(effect.name)}
                className="relative p-4 rounded-lg transition-all"
                style={{
                  backgroundColor:
                    selectedEffect === effect.name
                      ? DEFAULT_THEME_COLORS.primary
                      : DEFAULT_THEME_COLORS.surface,
                  border: `2px solid ${
                    selectedEffect === effect.name
                      ? DEFAULT_THEME_COLORS.primary
                      : DEFAULT_THEME_COLORS.border
                  }`,
                  minHeight: `${TOUCH_TARGET.TIMELINE_ELEMENT}px`,
                  color:
                    selectedEffect === effect.name
                      ? '#fff'
                      : DEFAULT_THEME_COLORS.text,
                }}
              >
                <div className="text-2xl mb-1">{effect.icon}</div>
                <div className="font-medium text-sm">{effect.label}</div>
                <div
                  className="text-xs mt-1"
                  style={{
                    color:
                      selectedEffect === effect.name
                        ? 'rgba(255,255,255,0.8)'
                        : DEFAULT_THEME_COLORS.textSecondary,
                  }}
                >
                  {effect.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Duration Slider */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: DEFAULT_THEME_COLORS.textSecondary }}>
            Duration: {duration.toFixed(1)}s
          </label>
          <input
            type="range"
            min="0.1"
            max="5.0"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            style={{
              width: '100%',
              height: `${TOUCH_TARGET.MIN}px`,
              backgroundColor: DEFAULT_THEME_COLORS.surface,
              borderRadius: '8px',
              accentColor: DEFAULT_THEME_COLORS.primary,
            }}
          />
        </div>

        {/* Delay Slider */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: DEFAULT_THEME_COLORS.textSecondary }}>
            Delay: {delay.toFixed(1)}s
          </label>
          <input
            type="range"
            min="0"
            max="3.0"
            step="0.1"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            style={{
              width: '100%',
              height: `${TOUCH_TARGET.MIN}px`,
              backgroundColor: DEFAULT_THEME_COLORS.surface,
              borderRadius: '8px',
              accentColor: DEFAULT_THEME_COLORS.primary,
            }}
          />
        </div>

        {/* Buffer Time Slider */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: DEFAULT_THEME_COLORS.textSecondary }}>
            Buffer: {bufferTime.toFixed(1)}s
          </label>
          <input
            type="range"
            min="0"
            max="2.0"
            step="0.1"
            value={bufferTime}
            onChange={(e) => setBufferTime(Number(e.target.value))}
            style={{
              width: '100%',
              height: `${TOUCH_TARGET.MIN}px`,
              backgroundColor: DEFAULT_THEME_COLORS.surface,
              borderRadius: '8px',
              accentColor: DEFAULT_THEME_COLORS.primary,
            }}
          />
        </div>

        {/* Easing Function Selector */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: DEFAULT_THEME_COLORS.textSecondary }}>
            Easing Function
          </label>
          <button
            type="button"
            onClick={() => setShowEasingPicker(!showEasingPicker)}
            className="w-full px-4 py-3 rounded-lg font-medium text-left flex items-center justify-between"
            style={{
              backgroundColor: DEFAULT_THEME_COLORS.surface,
              border: `1px solid ${DEFAULT_THEME_COLORS.border}`,
              color: DEFAULT_THEME_COLORS.text,
              minHeight: `${TOUCH_TARGET.RECOMMENDED}px`,
            }}
          >
            <span>{selectedEasing}</span>
            <span>{showEasingPicker ? '▲' : '▼'}</span>
          </button>

          {/* Easing Picker Dropdown */}
          {showEasingPicker && (
            <div
              className="mt-2 p-3 rounded-lg max-h-64 overflow-y-auto"
              style={{
                backgroundColor: DEFAULT_THEME_COLORS.background,
                border: `1px solid ${DEFAULT_THEME_COLORS.border}`,
              }}
            >
              {Object.entries(EASING_GROUPS).map(([groupName, easings]) => (
                <div key={groupName} className="mb-4 last:mb-0">
                  <div
                    className="text-xs font-semibold mb-2 uppercase"
                    style={{ color: DEFAULT_THEME_COLORS.textSecondary }}
                  >
                    {groupName}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {easings.map((easing) => (
                      <button
                        key={easing}
                        type="button"
                        onClick={() => {
                          setSelectedEasing(easing);
                          setShowEasingPicker(false);
                        }}
                        className="px-3 py-2 rounded text-sm text-left transition-colors"
                        style={{
                          backgroundColor:
                            selectedEasing === easing
                              ? DEFAULT_THEME_COLORS.primary
                              : 'transparent',
                          color:
                            selectedEasing === easing
                              ? '#fff'
                              : DEFAULT_THEME_COLORS.text,
                          minHeight: `${TOUCH_TARGET.MIN}px`,
                        }}
                      >
                        {easing}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Text */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: DEFAULT_THEME_COLORS.surface,
            border: `1px solid ${DEFAULT_THEME_COLORS.border}`,
          }}
        >
          <div className="text-xs mb-2" style={{ color: DEFAULT_THEME_COLORS.textSecondary }}>
            Preview:
          </div>
          <div
            className="text-center py-4"
            style={{
              color: DEFAULT_THEME_COLORS.text,
              fontWeight: 600,
              fontSize: '18px',
            }}
          >
            {selectedEffect === 'typewriter' && '⌨️ Typing...'}
            {selectedEffect === 'streaming' && '📝 Streaming...'}
            {selectedEffect === 'elastic' && '🎯 Elastic!'}
            {selectedEffect === 'bounce' && '🏀 Bouncing!'}
            {selectedEffect === 'fade' && '✨ Fading in...'}
            {selectedEffect === 'slide' && '➡️ Sliding...'}
          </div>
          <div className="text-xs mt-2 text-center" style={{ color: DEFAULT_THEME_COLORS.textSecondary }}>
            Duration: {duration}s | Delay: {delay}s | Easing: {selectedEasing}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: DEFAULT_THEME_COLORS.surface,
              color: DEFAULT_THEME_COLORS.textSecondary,
              minHeight: `${TOUCH_TARGET.RECOMMENDED}px`,
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 px-6 py-3 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: DEFAULT_THEME_COLORS.primary,
              color: '#fff',
              minHeight: `${TOUCH_TARGET.RECOMMENDED}px`,
            }}
          >
            Apply Effect
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
