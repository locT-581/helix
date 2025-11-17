/**
 * Easing Functions
 * 
 * Standard easing functions for animations and transitions.
 * Based on CSS easing functions and Robert Penner's easing equations.
 * 
 * All functions take a value t in range [0, 1] and return eased value in [0, 1].
 * 
 * @packageDocumentation
 */

/**
 * Easing function type
 * @param t - Time progress (0 to 1)
 * @returns Eased value (0 to 1)
 */
export type EasingFunction = (t: number) => number;

/**
 * Linear easing (no easing)
 * @param t - Progress (0-1)
 * @returns Same as input
 */
export const linear: EasingFunction = (t: number): number => t;

/**
 * Ease in (slow start)
 * Quadratic: t^2
 */
export const easeIn: EasingFunction = (t: number): number => t * t;

/**
 * Ease out (slow end)
 * Quadratic: 1 - (1-t)^2
 */
export const easeOut: EasingFunction = (t: number): number => 
  1 - (1 - t) * (1 - t);

/**
 * Ease in-out (slow start and end)
 * Quadratic
 */
export const easeInOut: EasingFunction = (t: number): number => 
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/**
 * Ease in cubic (very slow start)
 * Cubic: t^3
 */
export const easeInCubic: EasingFunction = (t: number): number => 
  t * t * t;

/**
 * Ease out cubic (very slow end)
 * Cubic: 1 - (1-t)^3
 */
export const easeOutCubic: EasingFunction = (t: number): number => 
  1 - Math.pow(1 - t, 3);

/**
 * Ease in-out cubic (very slow start and end)
 * Cubic
 */
export const easeInOutCubic: EasingFunction = (t: number): number => 
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Ease in quart (extremely slow start)
 * Quartic: t^4
 */
export const easeInQuart: EasingFunction = (t: number): number => 
  t * t * t * t;

/**
 * Ease out quart (extremely slow end)
 * Quartic: 1 - (1-t)^4
 */
export const easeOutQuart: EasingFunction = (t: number): number => 
  1 - Math.pow(1 - t, 4);

/**
 * Ease in-out quart (extremely slow start and end)
 * Quartic
 */
export const easeInOutQuart: EasingFunction = (t: number): number => 
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

/**
 * Ease in quint
 * Quintic: t^5
 */
export const easeInQuint: EasingFunction = (t: number): number => 
  t * t * t * t * t;

/**
 * Ease out quint
 * Quintic: 1 - (1-t)^5
 */
export const easeOutQuint: EasingFunction = (t: number): number => 
  1 - Math.pow(1 - t, 5);

/**
 * Ease in-out quint
 * Quintic
 */
export const easeInOutQuint: EasingFunction = (t: number): number => 
  t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

/**
 * Ease in sine
 * Sine: 1 - cos(t * PI/2)
 */
export const easeInSine: EasingFunction = (t: number): number => 
  1 - Math.cos((t * Math.PI) / 2);

/**
 * Ease out sine
 * Sine: sin(t * PI/2)
 */
export const easeOutSine: EasingFunction = (t: number): number => 
  Math.sin((t * Math.PI) / 2);

/**
 * Ease in-out sine
 * Sine: -(cos(PI * t) - 1) / 2
 */
export const easeInOutSine: EasingFunction = (t: number): number => 
  -(Math.cos(Math.PI * t) - 1) / 2;

/**
 * Ease in expo (exponential)
 * 2^(10 * (t - 1))
 */
export const easeInExpo: EasingFunction = (t: number): number => 
  t === 0 ? 0 : Math.pow(2, 10 * t - 10);

/**
 * Ease out expo (exponential)
 * 1 - 2^(-10 * t)
 */
export const easeOutExpo: EasingFunction = (t: number): number => 
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/**
 * Ease in-out expo (exponential)
 */
export const easeInOutExpo: EasingFunction = (t: number): number => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5
    ? Math.pow(2, 20 * t - 10) / 2
    : (2 - Math.pow(2, -20 * t + 10)) / 2;
};

/**
 * Ease in circ (circular)
 * 1 - sqrt(1 - t^2)
 */
export const easeInCirc: EasingFunction = (t: number): number => 
  1 - Math.sqrt(1 - Math.pow(t, 2));

/**
 * Ease out circ (circular)
 * sqrt(1 - (t-1)^2)
 */
export const easeOutCirc: EasingFunction = (t: number): number => 
  Math.sqrt(1 - Math.pow(t - 1, 2));

/**
 * Ease in-out circ (circular)
 */
export const easeInOutCirc: EasingFunction = (t: number): number => 
  t < 0.5
    ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
    : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;

/**
 * Ease in back (overshoot)
 */
export const easeInBack: EasingFunction = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t * t * t - c1 * t * t;
};

/**
 * Ease out back (overshoot)
 */
export const easeOutBack: EasingFunction = (t: number): number => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};

/**
 * Ease in-out back (overshoot)
 */
export const easeInOutBack: EasingFunction = (t: number): number => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
    : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

/**
 * Ease in elastic (spring)
 */
export const easeInElastic: EasingFunction = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
};

/**
 * Ease out elastic (spring)
 */
export const easeOutElastic: EasingFunction = (t: number): number => {
  const c4 = (2 * Math.PI) / 3;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};

/**
 * Ease in-out elastic (spring)
 */
export const easeInOutElastic: EasingFunction = (t: number): number => {
  const c5 = (2 * Math.PI) / 4.5;
  return t === 0
    ? 0
    : t === 1
    ? 1
    : t < 0.5
    ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
    : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
};

/**
 * Ease in bounce
 */
export const easeInBounce: EasingFunction = (t: number): number => 
  1 - easeOutBounce(1 - t);

/**
 * Ease out bounce
 */
export const easeOutBounce: EasingFunction = (t: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;

  if (t < 1 / d1) {
    return n1 * t * t;
  } else if (t < 2 / d1) {
    return n1 * (t -= 1.5 / d1) * t + 0.75;
  } else if (t < 2.5 / d1) {
    return n1 * (t -= 2.25 / d1) * t + 0.9375;
  } else {
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  }
};

/**
 * Ease in-out bounce
 */
export const easeInOutBounce: EasingFunction = (t: number): number => 
  t < 0.5
    ? (1 - easeOutBounce(1 - 2 * t)) / 2
    : (1 + easeOutBounce(2 * t - 1)) / 2;

/**
 * Map of easing function names to functions
 */
export const easingFunctions: Record<string, EasingFunction> = {
  linear,
  easeIn,
  easeOut,
  easeInOut,
  easeInCubic,
  easeOutCubic,
  easeInOutCubic,
  easeInQuart,
  easeOutQuart,
  easeInOutQuart,
  easeInQuint,
  easeOutQuint,
  easeInOutQuint,
  easeInSine,
  easeOutSine,
  easeInOutSine,
  easeInExpo,
  easeOutExpo,
  easeInOutExpo,
  easeInCirc,
  easeOutCirc,
  easeInOutCirc,
  easeInBack,
  easeOutBack,
  easeInOutBack,
  easeInElastic,
  easeOutElastic,
  easeInOutElastic,
  easeInBounce,
  easeOutBounce,
  easeInOutBounce,
};

/**
 * Get easing function by name
 * @param name - Easing function name
 * @returns Easing function or linear if not found
 */
export const getEasingFunction = (name: string): EasingFunction => {
  return easingFunctions[name] || linear;
};

/**
 * Apply easing to a value interpolation
 * @param start - Start value
 * @param end - End value
 * @param progress - Progress (0-1)
 * @param easing - Easing function or name
 * @returns Eased value
 */
export const applyEasing = (
  start: number,
  end: number,
  progress: number,
  easing: EasingFunction | string = linear,
): number => {
  const easingFn = typeof easing === 'string' ? getEasingFunction(easing) : easing;
  const easedProgress = easingFn(Math.max(0, Math.min(1, progress)));
  return start + (end - start) * easedProgress;
};
