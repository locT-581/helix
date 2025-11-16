import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { styled, type CSS, type VariantProps } from '../stitches.config';

/**
 * Touch-optimized Input component
 * Follows WCAG AAA guidelines with 44px minimum touch target
 */
const StyledInput = styled('input', {
  // Base styles
  width: '100%',
  fontFamily: '$body',
  fontSize: '$md',
  fontWeight: '$normal',
  lineHeight: '$normal',
  color: '$textPrimary',
  backgroundColor: '$background',
  border: '2px solid $border',
  borderRadius: '$md',
  outline: 'none',
  transition: 'all $fast',
  touchTarget: 44, // WCAG AAA minimum

  // Placeholder
  '&::placeholder': {
    color: '$textTertiary',
  },

  // Focus styles
  '&:focus': {
    borderColor: '$borderFocus',
    boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1)', // Primary with opacity
  },

  // Disabled state
  '&:disabled': {
    cursor: 'not-allowed',
    opacity: 0.5,
    backgroundColor: '$neutral100',
  },

  variants: {
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
        px: '$5',
        py: '$4',
        minHeight: '60px', // TOUCH_TARGET.COMFORTABLE
      },
    },

    state: {
      error: {
        borderColor: '$error',
        '&:focus': {
          borderColor: '$error',
          boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
        },
      },
      success: {
        borderColor: '$success',
        '&:focus': {
          borderColor: '$success',
          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)',
        },
      },
      warning: {
        borderColor: '$warning',
        '&:focus': {
          borderColor: '$warning',
          boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.1)',
        },
      },
    },

    fullWidth: {
      true: {
        width: '100%',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

const InputWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  width: '100%',
});

const InputLabel = styled('label', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textPrimary',
  cursor: 'pointer',
});

const InputHelperText = styled('span', {
  fontSize: '$xs',
  lineHeight: '$tight',
  
  variants: {
    state: {
      default: {
        color: '$textSecondary',
      },
      error: {
        color: '$error',
      },
      success: {
        color: '$success',
      },
      warning: {
        color: '$warning',
      },
    },
  },

  defaultVariants: {
    state: 'default',
  },
});

const InputIconWrapper = styled('div', {
  position: 'relative',
  width: '100%',

  variants: {
    hasIconLeft: {
      true: {},
    },
    hasIconRight: {
      true: {},
    },
  },
});

const IconLeft = styled('div', {
  position: 'absolute',
  left: '$3',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$textTertiary',
  pointerEvents: 'none',
  size: '$5',
});

const IconRight = styled('div', {
  position: 'absolute',
  right: '$3',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '$textTertiary',
  pointerEvents: 'none',
  size: '$5',
});

export type InputVariants = VariantProps<typeof StyledInput>;

export type InputProps = Omit<ComponentPropsWithoutRef<'input'>, 'size'> &
  InputVariants & {
    /** Input label */
    label?: string | undefined;
    /** Helper text displayed below input */
    helperText?: string | undefined;
    /** Icon to display on the left */
    iconLeft?: ReactNode | undefined;
    /** Icon to display on the right */
    iconRight?: ReactNode | undefined;
    /** Custom CSS styles */
    css?: CSS;
    /** Error message (sets state to error automatically) */
    error?: string | undefined;
  };

/**
 * Input component
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   type="email"
 *   placeholder="you@example.com"
 *   helperText="We'll never share your email"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   label="Search"
 *   type="text"
 *   iconLeft={<SearchIcon />}
 *   placeholder="Search videos..."
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 * ```
 */
export const Input = ({
  label,
  helperText,
  iconLeft,
  iconRight,
  error,
  state,
  size = 'md',
  css: customCss,
  id,
  ...props
}: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const finalState = error ? 'error' : state;
  const finalHelperText = error || helperText;

  const inputElement = (
    <StyledInput
      {...props}
      id={inputId}
      size={size}
      state={finalState || undefined}
      css={{
        ...(iconLeft && { pl: '$10' }),
        ...(iconRight && { pr: '$10' }),
        ...(customCss as object),
      }}
    />
  );

  const content = (
    <>
      {iconLeft || iconRight ? (
        <InputIconWrapper
          hasIconLeft={!!iconLeft}
          hasIconRight={!!iconRight}
        >
          {iconLeft && <IconLeft>{iconLeft}</IconLeft>}
          {inputElement}
          {iconRight && <IconRight>{iconRight}</IconRight>}
        </InputIconWrapper>
      ) : (
        inputElement
      )}
      {finalHelperText && (
        <InputHelperText state={finalState || 'default'}>
          {finalHelperText}
        </InputHelperText>
      )}
    </>
  );

  if (label) {
    return (
      <InputWrapper>
        <InputLabel htmlFor={inputId}>{label}</InputLabel>
        {content}
      </InputWrapper>
    );
  }

  return <InputWrapper>{content}</InputWrapper>;
};
