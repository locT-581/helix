import type { ComponentPropsWithoutRef } from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { styled, type CSS } from '../stitches.config';

/**
 * Touch-optimized Switch component (Radix UI wrapper)
 * Follows WCAG AAA guidelines with 44px minimum touch target
 */
const StyledSwitch = styled(SwitchPrimitive.Root, {
  all: 'unset',
  position: 'relative',
  backgroundColor: '$neutral300',
  borderRadius: '$full',
  cursor: 'pointer',
  transition: 'background-color $fast',
  WebkitTapHighlightColor: 'transparent',

  // Size variants
  width: '52px',
  height: '32px',

  // Touch target padding (invisible but tappable)
  '&::before': {
    content: '',
    position: 'absolute',
    top: '-6px',
    left: '-6px',
    right: '-6px',
    bottom: '-6px',
    borderRadius: '$full',
  },

  '&[data-state="checked"]': {
    backgroundColor: '$primary500',
  },

  '&:hover': {
    '&[data-state="unchecked"]': {
      backgroundColor: '$neutral400',
    },
    '&[data-state="checked"]': {
      backgroundColor: '$primary600',
    },
  },

  '&:focus-visible': {
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.2)',
  },

  '&[data-disabled]': {
    cursor: 'not-allowed',
    opacity: 0.5,
  },

  variants: {
    size: {
      sm: {
        width: '40px',
        height: '24px',
      },
      md: {
        width: '52px',
        height: '32px',
      },
      lg: {
        width: '64px',
        height: '40px',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

const StyledThumb = styled(SwitchPrimitive.Thumb, {
  display: 'block',
  backgroundColor: '$background',
  borderRadius: '$full',
  boxShadow: '$md',
  transition: 'transform $fast',
  willChange: 'transform',

  // Default size (md)
  size: '28px',
  transform: 'translateX(2px)',

  '&[data-state="checked"]': {
    transform: 'translateX(22px)',
  },

  variants: {
    size: {
      sm: {
        size: '20px',
        transform: 'translateX(2px)',
        '&[data-state="checked"]': {
          transform: 'translateX(18px)',
        },
      },
      md: {
        size: '28px',
        transform: 'translateX(2px)',
        '&[data-state="checked"]': {
          transform: 'translateX(22px)',
        },
      },
      lg: {
        size: '36px',
        transform: 'translateX(2px)',
        '&[data-state="checked"]': {
          transform: 'translateX(26px)',
        },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

const SwitchWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',

  variants: {
    fullWidth: {
      true: {
        justifyContent: 'space-between',
        width: '100%',
      },
    },
  },
});

const SwitchLabel = styled('label', {
  fontSize: '$md',
  fontWeight: '$medium',
  color: '$textPrimary',
  cursor: 'pointer',
  userSelect: 'none',
  flexGrow: 1,

  // Ensure touch target for label
  minHeight: '44px',
  display: 'flex',
  alignItems: 'center',
});

const SwitchDescription = styled('span', {
  fontSize: '$sm',
  color: '$textSecondary',
  display: 'block',
  mt: '$1',
});

export type SwitchSize = 'sm' | 'md' | 'lg';

export type SwitchProps = Omit<
  ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
  'asChild'
> & {
  /** Switch label */
  label?: string | undefined;
  /** Description text below label */
  description?: string | undefined;
  /** Switch size */
  size?: SwitchSize | undefined;
  /** Full width layout (label on left, switch on right) */
  fullWidth?: boolean | undefined;
  /** Custom CSS styles */
  css?: CSS;
};

/**
 * Switch component (Radix UI wrapper)
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Enable notifications"
 *   description="Receive updates about your video exports"
 *   defaultChecked
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Switch
 *   label="Dark mode"
 *   size="lg"
 *   fullWidth
 *   onCheckedChange={(checked) => console.log('Dark mode:', checked)}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Switch size="sm" />
 * ```
 */
export const Switch = ({
  label,
  description,
  size = 'md',
  fullWidth,
  id,
  css: customCss,
  ...props
}: SwitchProps) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  const switchElement = (
    <StyledSwitch {...props} id={switchId} size={size} css={customCss as object | undefined}>
      <StyledThumb size={size} />
    </StyledSwitch>
  );

  if (label) {
    return (
      <SwitchWrapper fullWidth={fullWidth || undefined}>
        <SwitchLabel htmlFor={switchId}>
          <div>
            {label}
            {description && (
              <SwitchDescription>{description}</SwitchDescription>
            )}
          </div>
        </SwitchLabel>
        {switchElement}
      </SwitchWrapper>
    );
  }

  return switchElement;
};
