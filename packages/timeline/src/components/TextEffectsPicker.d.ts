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
import React from 'react';
import { ElementTextEffect } from '../core/addOns/text-effect';
export interface TextEffectsPickerProps {
    isOpen: boolean;
    onClose: () => void;
    initialEffect?: ElementTextEffect | undefined;
    onApply: (effect: ElementTextEffect) => void;
}
export declare const TextEffectsPicker: React.FC<TextEffectsPickerProps>;
//# sourceMappingURL=TextEffectsPicker.d.ts.map