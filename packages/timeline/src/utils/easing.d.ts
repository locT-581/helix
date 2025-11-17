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
export declare const linear: EasingFunction;
/**
 * Ease in (slow start)
 * Quadratic: t^2
 */
export declare const easeIn: EasingFunction;
/**
 * Ease out (slow end)
 * Quadratic: 1 - (1-t)^2
 */
export declare const easeOut: EasingFunction;
/**
 * Ease in-out (slow start and end)
 * Quadratic
 */
export declare const easeInOut: EasingFunction;
/**
 * Ease in cubic (very slow start)
 * Cubic: t^3
 */
export declare const easeInCubic: EasingFunction;
/**
 * Ease out cubic (very slow end)
 * Cubic: 1 - (1-t)^3
 */
export declare const easeOutCubic: EasingFunction;
/**
 * Ease in-out cubic (very slow start and end)
 * Cubic
 */
export declare const easeInOutCubic: EasingFunction;
/**
 * Ease in quart (extremely slow start)
 * Quartic: t^4
 */
export declare const easeInQuart: EasingFunction;
/**
 * Ease out quart (extremely slow end)
 * Quartic: 1 - (1-t)^4
 */
export declare const easeOutQuart: EasingFunction;
/**
 * Ease in-out quart (extremely slow start and end)
 * Quartic
 */
export declare const easeInOutQuart: EasingFunction;
/**
 * Ease in quint
 * Quintic: t^5
 */
export declare const easeInQuint: EasingFunction;
/**
 * Ease out quint
 * Quintic: 1 - (1-t)^5
 */
export declare const easeOutQuint: EasingFunction;
/**
 * Ease in-out quint
 * Quintic
 */
export declare const easeInOutQuint: EasingFunction;
/**
 * Ease in sine
 * Sine: 1 - cos(t * PI/2)
 */
export declare const easeInSine: EasingFunction;
/**
 * Ease out sine
 * Sine: sin(t * PI/2)
 */
export declare const easeOutSine: EasingFunction;
/**
 * Ease in-out sine
 * Sine: -(cos(PI * t) - 1) / 2
 */
export declare const easeInOutSine: EasingFunction;
/**
 * Ease in expo (exponential)
 * 2^(10 * (t - 1))
 */
export declare const easeInExpo: EasingFunction;
/**
 * Ease out expo (exponential)
 * 1 - 2^(-10 * t)
 */
export declare const easeOutExpo: EasingFunction;
/**
 * Ease in-out expo (exponential)
 */
export declare const easeInOutExpo: EasingFunction;
/**
 * Ease in circ (circular)
 * 1 - sqrt(1 - t^2)
 */
export declare const easeInCirc: EasingFunction;
/**
 * Ease out circ (circular)
 * sqrt(1 - (t-1)^2)
 */
export declare const easeOutCirc: EasingFunction;
/**
 * Ease in-out circ (circular)
 */
export declare const easeInOutCirc: EasingFunction;
/**
 * Ease in back (overshoot)
 */
export declare const easeInBack: EasingFunction;
/**
 * Ease out back (overshoot)
 */
export declare const easeOutBack: EasingFunction;
/**
 * Ease in-out back (overshoot)
 */
export declare const easeInOutBack: EasingFunction;
/**
 * Ease in elastic (spring)
 */
export declare const easeInElastic: EasingFunction;
/**
 * Ease out elastic (spring)
 */
export declare const easeOutElastic: EasingFunction;
/**
 * Ease in-out elastic (spring)
 */
export declare const easeInOutElastic: EasingFunction;
/**
 * Ease in bounce
 */
export declare const easeInBounce: EasingFunction;
/**
 * Ease out bounce
 */
export declare const easeOutBounce: EasingFunction;
/**
 * Ease in-out bounce
 */
export declare const easeInOutBounce: EasingFunction;
/**
 * Map of easing function names to functions
 */
export declare const easingFunctions: Record<string, EasingFunction>;
/**
 * Get easing function by name
 * @param name - Easing function name
 * @returns Easing function or linear if not found
 */
export declare const getEasingFunction: (name: string) => EasingFunction;
/**
 * Apply easing to a value interpolation
 * @param start - Start value
 * @param end - End value
 * @param progress - Progress (0-1)
 * @param easing - Easing function or name
 * @returns Eased value
 */
export declare const applyEasing: (start: number, end: number, progress: number, easing?: EasingFunction | string) => number;
//# sourceMappingURL=easing.d.ts.map