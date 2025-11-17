/**
 * Text effect rendering utilities for canvas.
 * Applies text effects (typewriter, elastic, bounce, etc.) to Konva.Text elements
 * with easing functions for smooth animations.
 * 
 * NEW CODE - Not in Twick (Twick doesn't have canvas text effect rendering).
 * Integrates @helix/timeline TextElement effects with @helix/canvas rendering.
 */

import type Konva from "konva";
import type { ElementTextEffect, EasingFunction } from "@helix/timeline";
import { 
  applyEasing,
} from "@helix/timeline";

/**
 * Configuration for applying text effects during canvas rendering.
 */
export interface TextEffectConfig {
  /** The Konva.Text element to apply effects to */
  textElement: Konva.Text;
  /** The text effect configuration from timeline */
  effect: ElementTextEffect;
  /** Current playback time in seconds */
  currentTime: number;
  /** Element start time in timeline */
  startTime: number;
  /** Element end time in timeline */
  endTime: number;
  /** Optional easing function (defaults to linear) */
  easing?: EasingFunction;
}

/**
 * Apply a text effect to a Konva.Text element based on current playback time.
 * Calculates effect progress with easing and updates text properties accordingly.
 * 
 * @param config - The text effect configuration
 * 
 * @example
 * ```ts
 * import { applyTextEffect } from '@helix/canvas';
 * import { TextElement } from '@helix/timeline';
 * 
 * const textElement = new TextElement('Hello World');
 * const effect = new ElementTextEffect('typewriter');
 * effect.setDuration(2.0);
 * 
 * textElement.setTextEffect(effect);
 * 
 * // During playback
 * applyTextEffect({
 *   textElement: konvaText,
 *   effect: textElement.getTextEffect()!,
 *   currentTime: 1.5,
 *   startTime: 0,
 *   endTime: 5,
 *   easing: 'easeInOut'
 * });
 * ```
 */
export const applyTextEffect = (config: TextEffectConfig): void => {
  const {
    textElement,
    effect,
    currentTime,
    startTime,
    easing = 'linear'
  } = config;

  const effectName = effect.getName();
  const effectDuration = effect.getDuration() ?? 1;
  const effectDelay = effect.getDelay() ?? 0;
  
  // Calculate effect start and end times relative to element
  const effectStartTime = startTime + effectDelay;
  const effectEndTime = effectStartTime + effectDuration;

  // Check if effect should be active
  if (currentTime < effectStartTime) {
    // Before effect starts - hide or show depending on effect type
    if (effectName === 'fade' || effectName === 'slide') {
      textElement.opacity(0);
    } else if (effectName === 'typewriter' || effectName === 'streaming') {
      textElement.text(''); // No text visible yet
    }
    return;
  }

  if (currentTime >= effectEndTime) {
    // After effect completes - show full text
    const fullText = textElement.getAttr('fullText') || textElement.text();
    textElement.text(fullText);
    textElement.opacity(1);
    textElement.x(textElement.getAttr('originalX') ?? textElement.x());
    textElement.y(textElement.getAttr('originalY') ?? textElement.y());
    textElement.scaleX(1);
    textElement.scaleY(1);
    return;
  }

  // Effect is active - calculate progress (0 to 1)
  const rawProgress = (currentTime - effectStartTime) / effectDuration;
  const progress = Math.max(0, Math.min(1, rawProgress));

  // Apply easing to progress
  const easedProgress = applyEasing(0, 1, progress, easing);

  // Apply effect based on type
  switch (effectName) {
    case 'typewriter':
      applyTypewriterEffect(textElement, easedProgress);
      break;
    case 'streaming':
      applyStreamingEffect(textElement, easedProgress);
      break;
    case 'elastic':
      applyElasticEffect(textElement, easedProgress);
      break;
    case 'bounce':
      applyBounceEffect(textElement, easedProgress);
      break;
    case 'fade':
      applyFadeEffect(textElement, easedProgress);
      break;
    case 'slide':
      applySlideEffect(textElement, easedProgress);
      break;
    default:
      // No effect - show full text
      const fullText = textElement.getAttr('fullText') || textElement.text();
      textElement.text(fullText);
      textElement.opacity(1);
  }
};

/**
 * Typewriter effect - reveals text character by character.
 */
const applyTypewriterEffect = (textElement: Konva.Text, progress: number): void => {
  const fullText = textElement.getAttr('fullText') || textElement.text();
  
  // Store full text on first call
  if (!textElement.getAttr('fullText')) {
    textElement.setAttr('fullText', fullText);
  }

  // Calculate characters to show
  const charsToShow = Math.floor(fullText.length * progress);
  const visibleText = fullText.substring(0, charsToShow);
  
  textElement.text(visibleText);
  textElement.opacity(1);
};

/**
 * Streaming effect - smooth reveal with fade-in per character.
 */
const applyStreamingEffect = (textElement: Konva.Text, progress: number): void => {
  const fullText = textElement.getAttr('fullText') || textElement.text();
  
  if (!textElement.getAttr('fullText')) {
    textElement.setAttr('fullText', fullText);
  }

  // Smoother reveal than typewriter
  const charsToShow = Math.ceil(fullText.length * progress);
  const visibleText = fullText.substring(0, charsToShow);
  
  // Fade in last few characters for smooth effect
  const lastCharOpacity = progress < 1 ? (progress * fullText.length) % 1 : 1;
  
  textElement.text(visibleText);
  textElement.opacity(lastCharOpacity < 0.1 ? lastCharOpacity + 0.9 : 1);
};

/**
 * Elastic effect - bounces text with spring animation.
 */
const applyElasticEffect = (textElement: Konva.Text, progress: number): void => {
  const fullText = textElement.getAttr('fullText') || textElement.text();
  
  if (!textElement.getAttr('fullText')) {
    textElement.setAttr('fullText', fullText);
  }

  // Store original position
  if (textElement.getAttr('originalX') === undefined) {
    textElement.setAttr('originalX', textElement.x());
    textElement.setAttr('originalY', textElement.y());
  }

  textElement.text(fullText);
  textElement.opacity(1);

  // Elastic scale effect (overshoots then settles)
  if (progress < 1) {
    const amplitude = 0.3;
    const decay = 4;
    const elasticScale = 1 + amplitude * Math.sin(progress * Math.PI * decay) * (1 - progress);
    textElement.scaleX(elasticScale);
    textElement.scaleY(elasticScale);
  } else {
    textElement.scaleX(1);
    textElement.scaleY(1);
  }
};

/**
 * Bounce effect - text bounces in like a ball.
 */
const applyBounceEffect = (textElement: Konva.Text, progress: number): void => {
  const fullText = textElement.getAttr('fullText') || textElement.text();
  
  if (!textElement.getAttr('fullText')) {
    textElement.setAttr('fullText', fullText);
  }

  // Store original position
  if (textElement.getAttr('originalY') === undefined) {
    textElement.setAttr('originalX', textElement.x());
    textElement.setAttr('originalY', textElement.y());
  }

  const originalY = textElement.getAttr('originalY');
  
  textElement.text(fullText);
  textElement.opacity(1);

  // Bounce from above with decreasing bounces
  if (progress < 1) {
    const bounceHeight = 100; // pixels
    const bounces = 3;
    const bounceY = bounceHeight * Math.abs(Math.sin(progress * Math.PI * bounces)) * (1 - progress);
    textElement.y(originalY - bounceY);
  } else {
    textElement.y(originalY);
  }
};

/**
 * Fade effect - smooth opacity transition.
 */
const applyFadeEffect = (textElement: Konva.Text, progress: number): void => {
  const fullText = textElement.getAttr('fullText') || textElement.text();
  
  if (!textElement.getAttr('fullText')) {
    textElement.setAttr('fullText', fullText);
  }

  textElement.text(fullText);
  textElement.opacity(progress);
};

/**
 * Slide effect - text slides in from the right.
 */
const applySlideEffect = (textElement: Konva.Text, progress: number): void => {
  const fullText = textElement.getAttr('fullText') || textElement.text();
  
  if (!textElement.getAttr('fullText')) {
    textElement.setAttr('fullText', fullText);
  }

  // Store original position
  if (textElement.getAttr('originalX') === undefined) {
    textElement.setAttr('originalX', textElement.x());
    textElement.setAttr('originalY', textElement.y());
  }

  const originalX = textElement.getAttr('originalX');
  const slideDistance = 200; // pixels
  
  textElement.text(fullText);
  textElement.opacity(progress);
  
  // Slide from right to original position
  const currentX = originalX + slideDistance * (1 - progress);
  textElement.x(currentX);
};

/**
 * Reset text element to default state (no effects).
 * Useful when removing effects or switching between elements.
 * 
 * @param textElement - The Konva.Text element to reset
 */
export const resetTextEffect = (textElement: Konva.Text): void => {
  const fullText = textElement.getAttr('fullText');
  const originalX = textElement.getAttr('originalX');
  const originalY = textElement.getAttr('originalY');

  if (fullText) {
    textElement.text(fullText);
  }

  if (originalX !== undefined) {
    textElement.x(originalX);
  }

  if (originalY !== undefined) {
    textElement.y(originalY);
  }

  textElement.opacity(1);
  textElement.scaleX(1);
  textElement.scaleY(1);

  // Clear stored attributes
  textElement.setAttr('fullText', undefined);
  textElement.setAttr('originalX', undefined);
  textElement.setAttr('originalY', undefined);
};
