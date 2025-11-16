import type { ReactNode } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { ChevronDown, Check } from 'lucide-react';
import { styled, type CSS } from '../stitches.config';

/**
 * Touch-optimized Select component (Radix UI wrapper)
 * Follows WCAG AAA guidelines with 44px minimum touch target
 */
const StyledTrigger = styled(SelectPrimitive.Trigger, {
  // Base styles
  all: 'unset',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$2',
  width: '100%',
  fontFamily: '$body',
  fontSize: '$md',
  fontWeight: '$normal',
  lineHeight: '$normal',
  color: '$textPrimary',
  backgroundColor: '$background',
  border: '2px solid $border',
  borderRadius: '$md',
  px: '$4',
  py: '$3',
  minHeight: '44px', // WCAG AAA
  cursor: 'pointer',
  transition: 'all $fast',

  '&:hover': {
    borderColor: '$neutral400',
  },

  '&:focus': {
    borderColor: '$borderFocus',
    boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1)',
  },

  '&[data-placeholder]': {
    color: '$textTertiary',
  },

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
        minHeight: '44px',
      },
      lg: {
        fontSize: '$lg',
        px: '$5',
        py: '$4',
        minHeight: '60px',
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
});

const StyledIcon = styled(SelectPrimitive.Icon, {
  color: '$textSecondary',
  display: 'flex',
  alignItems: 'center',
  transition: 'transform $fast',

  '[data-state="open"] &': {
    transform: 'rotate(180deg)',
  },
});

const StyledContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  backgroundColor: '$backgroundElevated',
  borderRadius: '$md',
  border: '1px solid $border',
  boxShadow: '$lg',
  zIndex: '$dropdown',

  // Animation
  '@motion': {
    '&[data-state="open"]': {
      animation: 'fadeIn $fast',
    },
    '&[data-state="closed"]': {
      animation: 'fadeOut $fast',
    },
  },

  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.96)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1)',
    },
  },

  '@keyframes fadeOut': {
    from: {
      opacity: 1,
      transform: 'scale(1)',
    },
    to: {
      opacity: 0,
      transform: 'scale(0.96)',
    },
  },
});

const StyledViewport = styled(SelectPrimitive.Viewport, {
  padding: '$2',
});

const StyledItem = styled(SelectPrimitive.Item, {
  all: 'unset',
  display: 'flex',
  alignItems: 'center',
  gap: '$2',
  fontSize: '$md',
  lineHeight: '$normal',
  color: '$textPrimary',
  borderRadius: '$sm',
  px: '$4',
  py: '$3',
  minHeight: '44px', // Touch target
  position: 'relative',
  userSelect: 'none',
  cursor: 'pointer',
  transition: 'background $fast',

  '&[data-disabled]': {
    color: '$textTertiary',
    pointerEvents: 'none',
  },

  '&[data-highlighted]': {
    outline: 'none',
    backgroundColor: '$primary50',
    color: '$primary700',
  },

  '&[data-state="checked"]': {
    backgroundColor: '$primary100',
    color: '$primary700',
  },
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: 'absolute',
  right: '$2',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  size: '$5',
  color: '$primary500',
});

const StyledLabel = styled(SelectPrimitive.Label, {
  fontSize: '$xs',
  fontWeight: '$semibold',
  color: '$textSecondary',
  px: '$4',
  py: '$2',
  lineHeight: '$normal',
  textTransform: 'uppercase',
  letterSpacing: '$wide',
});

const StyledSeparator = styled(SelectPrimitive.Separator, {
  height: '1px',
  backgroundColor: '$border',
  my: '$2',
});

const SelectWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
  width: '100%',
});

const SelectLabel = styled('label', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textPrimary',
  cursor: 'pointer',
});

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectProps {
  /** Select label */
  label?: string | undefined;
  /** Placeholder text */
  placeholder?: string | undefined;
  /** Select size */
  size?: SelectSize | undefined;
  /** Custom CSS styles */
  css?: CSS;
  /** Default value */
  defaultValue?: string | undefined;
  /** Controlled value */
  value?: string | undefined;
  /** Change handler */
  onValueChange?: ((value: string) => void) | undefined;
  /** Disabled state */
  disabled?: boolean | undefined;
  /** Required field */
  required?: boolean | undefined;
  /** Children (SelectItem, SelectGroup, etc.) */
  children: ReactNode;
}

/**
 * Select component (Radix UI wrapper)
 *
 * @example
 * ```tsx
 * <Select label="Video Quality" placeholder="Select quality">
 *   <SelectItem value="720p">720p HD</SelectItem>
 *   <SelectItem value="1080p">1080p Full HD</SelectItem>
 *   <SelectItem value="4k">4K Ultra HD</SelectItem>
 * </Select>
 * ```
 *
 * @example
 * ```tsx
 * <Select placeholder="Choose category">
 *   <SelectGroup>
 *     <SelectGroupLabel>Effects</SelectGroupLabel>
 *     <SelectItem value="blur">Blur</SelectItem>
 *     <SelectItem value="sharpen">Sharpen</SelectItem>
 *   </SelectGroup>
 *   <SelectSeparator />
 *   <SelectGroup>
 *     <SelectGroupLabel>Filters</SelectGroupLabel>
 *     <SelectItem value="grayscale">Grayscale</SelectItem>
 *     <SelectItem value="sepia">Sepia</SelectItem>
 *   </SelectGroup>
 * </Select>
 * ```
 */
export const Select = ({
  label,
  placeholder,
  size = 'md',
  css: customCss,
  children,
  ...props
}: SelectProps) => {
  const selectElement = (
    <SelectPrimitive.Root {...props}>
      <StyledTrigger size={size} css={customCss as object | undefined}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <StyledIcon>
          <ChevronDown size={20} />
        </StyledIcon>
      </StyledTrigger>

      <SelectPrimitive.Portal>
        <StyledContent position="popper" sideOffset={4}>
          <StyledViewport>{children}</StyledViewport>
        </StyledContent>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );

  if (label) {
    return (
      <SelectWrapper>
        <SelectLabel>{label}</SelectLabel>
        {selectElement}
      </SelectWrapper>
    );
  }

  return selectElement;
};

/**
 * SelectItem component
 */
export interface SelectItemProps {
  value: string;
  children: ReactNode;
  disabled?: boolean | undefined;
}

export const SelectItem = ({ value, children, disabled }: SelectItemProps) => {
  return (
    <StyledItem value={value} disabled={disabled || undefined}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <StyledItemIndicator>
        <Check size={16} />
      </StyledItemIndicator>
    </StyledItem>
  );
};

/**
 * SelectGroup component
 */
export interface SelectGroupProps {
  children: ReactNode;
}

export const SelectGroup = ({ children }: SelectGroupProps) => {
  return <SelectPrimitive.Group>{children}</SelectPrimitive.Group>;
};

/**
 * SelectGroupLabel component
 */
export interface SelectGroupLabelProps {
  children: ReactNode;
}

export const SelectGroupLabel = ({ children }: SelectGroupLabelProps) => {
  return <StyledLabel>{children}</StyledLabel>;
};

/**
 * SelectSeparator component
 */
export const SelectSeparator = () => {
  return <StyledSeparator />;
};
