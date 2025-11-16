import { createStitches } from '@stitches/react';
import type { PropertyValue } from '@stitches/react';
import { BREAKPOINTS, TOUCH_TARGET } from '@helix/core';

/**
 * Stitches CSS-in-JS configuration for Helix
 * Mobile-first design system with touch-optimized components
 */
export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      // Neutral colors (gray scale)
      neutral50: '#FAFAFA',
      neutral100: '#F5F5F5',
      neutral200: '#E5E5E5',
      neutral300: '#D4D4D4',
      neutral400: '#A3A3A3',
      neutral500: '#737373',
      neutral600: '#525252',
      neutral700: '#404040',
      neutral800: '#262626',
      neutral900: '#171717',

      // Primary color (purple)
      primary50: '#FAF5FF',
      primary100: '#F3E8FF',
      primary200: '#E9D5FF',
      primary300: '#D8B4FE',
      primary400: '#C084FC',
      primary500: '#A855F7', // Main primary
      primary600: '#9333EA',
      primary700: '#7E22CE',
      primary800: '#6B21A8',
      primary900: '#581C87',

      // Secondary color (cyan)
      secondary50: '#ECFEFF',
      secondary100: '#CFFAFE',
      secondary200: '#A5F3FC',
      secondary300: '#67E8F9',
      secondary400: '#22D3EE',
      secondary500: '#06B6D4', // Main secondary
      secondary600: '#0891B2',
      secondary700: '#0E7490',
      secondary800: '#155E75',
      secondary900: '#164E63',

      // Semantic colors
      success: '#10B981',
      successLight: '#D1FAE5',
      successDark: '#065F46',

      error: '#EF4444',
      errorLight: '#FEE2E2',
      errorDark: '#991B1B',

      warning: '#F59E0B',
      warningLight: '#FEF3C7',
      warningDark: '#92400E',

      info: '#3B82F6',
      infoLight: '#DBEAFE',
      infoDark: '#1E3A8A',

      // Background colors
      background: '#FFFFFF',
      backgroundElevated: '#FAFAFA',
      backgroundOverlay: 'rgba(0, 0, 0, 0.5)',

      // Text colors
      textPrimary: '#171717',
      textSecondary: '#525252',
      textTertiary: '#A3A3A3',
      textInverse: '#FFFFFF',

      // Border colors
      border: '#E5E5E5',
      borderFocus: '$primary500',
    },

    space: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px', // TOUCH_TARGET.MIN (WCAG AAA)
      12: '48px',
      13: '52px',
      14: '56px',
      15: '60px', // TOUCH_TARGET.COMFORTABLE
      16: '64px',
    },

    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },

    fonts: {
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    },

    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },

    lineHeights: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },

    letterSpacings: {
      tight: '-0.01em',
      normal: '0',
      wide: '0.01em',
    },

    sizes: {
      1: '4px',
      2: '8px',
      3: '12px',
      4: '16px',
      5: '20px',
      6: '24px',
      7: '28px',
      8: '32px',
      9: '36px',
      10: '40px',
      11: '44px',
      12: '48px',
      13: '52px',
      14: '56px',
      15: '60px',
      16: '64px',
      full: '100%',
      screenWidth: '100vw',
      screenHeight: '100vh',
    },

    borderWidths: {
      thin: '1px',
      medium: '2px',
      thick: '4px',
    },

    borderStyles: {},

    radii: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },

    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },

    zIndices: {
      base: '0',
      dropdown: '1000',
      sticky: '1100',
      fixed: '1200',
      overlay: '1300',
      modal: '1400',
      popover: '1500',
      toast: '1600',
    },

    transitions: {
      fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
      normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
      slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },

  media: {
    xs: `(min-width: ${BREAKPOINTS.MOBILE_SM}px)`, // 320px
    sm: `(min-width: ${BREAKPOINTS.MOBILE}px)`, // 375px
    md: `(min-width: ${BREAKPOINTS.MOBILE_LG}px)`, // 428px
    lg: `(min-width: ${BREAKPOINTS.TABLET_LG}px)`, // 768px
    xl: `(min-width: ${BREAKPOINTS.DESKTOP}px)`, // 905px
    motion: '(prefers-reduced-motion: no-preference)',
    hover: '(hover: hover) and (pointer: fine)',
    dark: '(prefers-color-scheme: dark)',
  },

  utils: {
    // Margin
    m: (value: PropertyValue<'margin'>) => ({
      margin: value,
    }),
    mt: (value: PropertyValue<'marginTop'>) => ({
      marginTop: value,
    }),
    mr: (value: PropertyValue<'marginRight'>) => ({
      marginRight: value,
    }),
    mb: (value: PropertyValue<'marginBottom'>) => ({
      marginBottom: value,
    }),
    ml: (value: PropertyValue<'marginLeft'>) => ({
      marginLeft: value,
    }),
    mx: (value: PropertyValue<'marginLeft'>) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value: PropertyValue<'marginTop'>) => ({
      marginTop: value,
      marginBottom: value,
    }),

    // Padding
    p: (value: PropertyValue<'padding'>) => ({
      padding: value,
    }),
    pt: (value: PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
    }),
    pr: (value: PropertyValue<'paddingRight'>) => ({
      paddingRight: value,
    }),
    pb: (value: PropertyValue<'paddingBottom'>) => ({
      paddingBottom: value,
    }),
    pl: (value: PropertyValue<'paddingLeft'>) => ({
      paddingLeft: value,
    }),
    px: (value: PropertyValue<'paddingLeft'>) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: PropertyValue<'paddingTop'>) => ({
      paddingTop: value,
      paddingBottom: value,
    }),

    // Size
    size: (value: PropertyValue<'width'>) => ({
      width: value,
      height: value,
    }),

    // Linear gradient
    linearGradient: (value: PropertyValue<'backgroundImage'>) => ({
      backgroundImage: `linear-gradient(${value})`,
    }),

    // Touch-friendly tap area
    touchTarget: (minSize: number = TOUCH_TARGET.MIN) => ({
      minWidth: `${minSize}px`,
      minHeight: `${minSize}px`,
    }),
  },
});

/**
 * Dark theme
 * Follows system preference via media query
 */
export const darkTheme = createTheme('dark-theme', {
  colors: {
    // Neutral colors (inverted)
    neutral50: '#171717',
    neutral100: '#262626',
    neutral200: '#404040',
    neutral300: '#525252',
    neutral400: '#737373',
    neutral500: '#A3A3A3',
    neutral600: '#D4D4D4',
    neutral700: '#E5E5E5',
    neutral800: '#F5F5F5',
    neutral900: '#FAFAFA',

    // Primary color (slightly brighter)
    primary500: '#C084FC',
    primary600: '#A855F7',

    // Secondary color (slightly brighter)
    secondary500: '#22D3EE',
    secondary600: '#06B6D4',

    // Semantic colors (adjusted for dark)
    success: '#34D399',
    successLight: '#065F46',
    successDark: '#D1FAE5',

    error: '#F87171',
    errorLight: '#991B1B',
    errorDark: '#FEE2E2',

    warning: '#FBBF24',
    warningLight: '#92400E',
    warningDark: '#FEF3C7',

    info: '#60A5FA',
    infoLight: '#1E3A8A',
    infoDark: '#DBEAFE',

    // Background colors
    background: '#0A0A0A',
    backgroundElevated: '#171717',
    backgroundOverlay: 'rgba(0, 0, 0, 0.75)',

    // Text colors
    textPrimary: '#FAFAFA',
    textSecondary: '#D4D4D4',
    textTertiary: '#737373',
    textInverse: '#171717',

    // Border colors
    border: '#404040',
    borderFocus: '$primary500',
  },
});

/**
 * Global styles
 * Applied once at app root
 */
export const globalStyles = globalCss({
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  'html, body': {
    fontFamily: '$body',
    fontSize: '$md',
    lineHeight: '$normal',
    color: '$textPrimary',
    backgroundColor: '$background',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    WebkitTapHighlightColor: 'transparent',
  },

  'h1, h2, h3, h4, h5, h6': {
    fontWeight: '$bold',
    lineHeight: '$tight',
  },

  a: {
    color: '$primary500',
    textDecoration: 'none',

    '@hover': {
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  },

  button: {
    fontFamily: 'inherit',
    cursor: 'pointer',
  },

  'input, textarea, select': {
    fontFamily: 'inherit',
    fontSize: 'inherit',
  },
});

/**
 * Type exports for use in components
 */
export type CSS = Parameters<typeof css>[0];
export type { VariantProps } from '@stitches/react';
