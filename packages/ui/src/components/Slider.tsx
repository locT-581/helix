import type { ComponentPropsWithoutRef } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { styled, type CSS } from '../stitches.config';

/**
 * Touch-optimized Slider component (Radix UI wrapper)
 * Follows WCAG AAA guidelines with 44px minimum touch target
 */
const StyledSlider = styled(SliderPrimitive.Root, {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  touchAction: 'none',
  width: '100%',
  height: '$11', // 44px - WCAG AAA touch target

  '&[data-orientation="vertical"]': {
    flexDirection: 'column',
    width: '$11',
    height: '200px',
  },

  '&[data-disabled]': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
});

const StyledTrack = styled(SliderPrimitive.Track, {
  backgroundColor: '$neutral200',
  position: 'relative',
  flexGrow: 1,
  borderRadius: '$full',
  height: '$1', // 4px track height

  '&[data-orientation="vertical"]': {
    width: '$1',
    height: '100%',
  },
});

const StyledRange = styled(SliderPrimitive.Range, {
  position: 'absolute',
  backgroundColor: '$primary500',
  borderRadius: '$full',
  height: '100%',

  '&[data-orientation="vertical"]': {
    width: '100%',
  },
});

const StyledThumb = styled(SliderPrimitive.Thumb, {
  all: 'unset',
  display: 'block',
  size: '$11', // 44px - WCAG AAA touch target
  backgroundColor: '$primary500',
  borderRadius: '$full',
  border: '3px solid $background',
  boxShadow: '$md',
  cursor: 'grab',
  transition: 'all $fast',

  '&:hover': {
    backgroundColor: '$primary600',
    transform: 'scale(1.1)',
  },

  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 4px rgba(168, 85, 247, 0.2)',
  },

  '&:active': {
    cursor: 'grabbing',
    transform: 'scale(1.15)',
  },

  '&[data-disabled]': {
    cursor: 'not-allowed',
    '&:hover': {
      transform: 'none',
    },
  },
});

const SliderWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$3',
  width: '100%',
});

const SliderHeader = styled('div', {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '$2',
});

const SliderLabel = styled('label', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textPrimary',
  cursor: 'pointer',
});

const SliderValue = styled('span', {
  fontSize: '$sm',
  fontWeight: '$medium',
  color: '$textSecondary',
  fontFamily: '$mono',
});

export type SliderProps = Omit<
  ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'asChild'
> & {
  /** Slider label */
  label?: string | undefined;
  /** Show current value */
  showValue?: boolean | undefined;
  /** Value formatter function */
  valueFormatter?: ((value: number) => string) | undefined;
  /** Custom CSS styles */
  css?: CSS;
};

/**
 * Slider component (Radix UI wrapper)
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Volume"
 *   defaultValue={[50]}
 *   max={100}
 *   step={1}
 *   showValue
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Playback Speed"
 *   defaultValue={[1]}
 *   min={0.5}
 *   max={2}
 *   step={0.25}
 *   showValue
 *   valueFormatter={(val) => `${val}x`}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Slider
 *   label="Trim Range"
 *   defaultValue={[0, 100]}
 *   max={100}
 *   step={1}
 *   showValue
 *   valueFormatter={(val) => `${val}s`}
 * />
 * ```
 */
export const Slider = ({
  label,
  showValue,
  valueFormatter,
  value,
  defaultValue,
  css: customCss,
  ...props
}: SliderProps) => {
  const currentValue = value || defaultValue || [0];
  const displayValue = Array.isArray(currentValue)
    ? currentValue.length > 1
      ? `${valueFormatter ? valueFormatter(currentValue[0]!) : currentValue[0]} - ${valueFormatter ? valueFormatter(currentValue[1]!) : currentValue[1]}`
      : valueFormatter
        ? valueFormatter(currentValue[0]!)
        : currentValue[0]!.toString()
    : String(currentValue);

  const sliderElement = (
    <StyledSlider
      {...props}
      value={value}
      defaultValue={defaultValue}
      css={customCss as object | undefined}
    >
      <StyledTrack>
        <StyledRange />
      </StyledTrack>
      {currentValue.map((_, index) => (
        <StyledThumb key={index} />
      ))}
    </StyledSlider>
  );

  if (label || showValue) {
    return (
      <SliderWrapper>
        {(label || showValue) && (
          <SliderHeader>
            {label && <SliderLabel>{label}</SliderLabel>}
            {showValue && <SliderValue>{displayValue}</SliderValue>}
          </SliderHeader>
        )}
        {sliderElement}
      </SliderWrapper>
    );
  }

  return sliderElement;
};
