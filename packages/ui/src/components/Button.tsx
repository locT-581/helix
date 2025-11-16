import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { styled, type CSS, type VariantProps } from '../stitches.config';

/**
 * Touch-optimized Button component
 * Follows WCAG AAA guidelines with 44px minimum touch target
 */
const StyledButton = styled('button', {
  // Base styles
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  fontWeight: '$medium',
  lineHeight: '$normal',
  borderRadius: '$md',
  border: 'none',
  outline: 'none',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all $fast',
  touchTarget: 44, // WCAG AAA minimum

  // Focus styles
  '&:focus-visible': {
    outline: '2px solid $borderFocus',
    outlineOffset: '2px',
  },

  // Disabled state
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  // Active state (touch feedback)
  '&:active:not(:disabled)': {
    transform: 'scale(0.98)',
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary500',
        color: '$textInverse',

        '@hover': {
          '&:hover:not(:disabled)': {
            backgroundColor: '$primary600',
          },
        },

        '&:active:not(:disabled)': {
          backgroundColor: '$primary700',
        },
      },

      secondary: {
        backgroundColor: '$secondary500',
        color: '$textInverse',

        '@hover': {
          '&:hover:not(:disabled)': {
            backgroundColor: '$secondary600',
          },
        },

        '&:active:not(:disabled)': {
          backgroundColor: '$secondary700',
        },
      },

      outline: {
        backgroundColor: 'transparent',
        color: '$primary500',
        border: '2px solid $primary500',

        '@hover': {
          '&:hover:not(:disabled)': {
            backgroundColor: '$primary50',
          },
        },

        '&:active:not(:disabled)': {
          backgroundColor: '$primary100',
        },
      },

      ghost: {
        backgroundColor: 'transparent',
        color: '$textPrimary',

        '@hover': {
          '&:hover:not(:disabled)': {
            backgroundColor: '$neutral100',
          },
        },

        '&:active:not(:disabled)': {
          backgroundColor: '$neutral200',
        },
      },

      danger: {
        backgroundColor: '$error',
        color: '$textInverse',

        '@hover': {
          '&:hover:not(:disabled)': {
            backgroundColor: '$errorDark',
          },
        },

        '&:active:not(:disabled)': {
          backgroundColor: '$errorDark',
        },
      },
    },

    size: {
      sm: {
        fontSize: '$sm',
        px: '$3',
        py: '$2',
        minHeight: '36px',
      },
      md: {
        fontSize: '$md',
        px: '$4',
        py: '$3',
        minHeight: '44px', // TOUCH_TARGET.MIN
      },
      lg: {
        fontSize: '$lg',
        px: '$6',
        py: '$4',
        minHeight: '60px', // TOUCH_TARGET.COMFORTABLE
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export type ButtonVariants = VariantProps<typeof StyledButton>;

export type ButtonProps = ComponentPropsWithoutRef<'button'> &
  ButtonVariants & {
    /** Button content */
    children: ReactNode;
    /** Custom CSS styles */
    css?: CSS;
    /** Loading state - shows spinner */
    loading?: boolean | undefined;
    /** Icon to display before text */
    iconLeft?: ReactNode | undefined;
    /** Icon to display after text */
    iconRight?: ReactNode | undefined;
  };

/**
 * Button component
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="lg" onClick={() => console.log('Clicked')}>
 *   Edit Video
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="outline" iconLeft={<PlayIcon />}>
 *   Play
 * </Button>
 * ```
 */
export const Button = ({
  children,
  loading,
  disabled,
  iconLeft,
  iconRight,
  css: customCss,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      {...props}
      disabled={disabled || loading}
      css={{
        cursor: loading ? 'wait' : undefined,
        opacity: loading ? 0.7 : undefined,
        ...(customCss as object),
      }}
    >
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {iconLeft}
          {children}
          {iconRight}
        </>
      )}
    </StyledButton>
  );
};

/**
 * Simple loading spinner
 * TODO: Replace with proper icon from lucide-react
 */
const LoadingSpinner = styled('span', {
  display: 'inline-block',
  size: '16px',
  border: '2px solid currentColor',
  borderRightColor: 'transparent',
  borderRadius: '$full',
  animation: 'spin 0.6s linear infinite',

  '@keyframes spin': {
    to: { transform: 'rotate(360deg)' },
  },
});
