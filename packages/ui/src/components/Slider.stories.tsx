import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Slider } from './Slider';

const meta = {
  title: 'Components/Slider',
  component: Slider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    showValue: {
      control: 'boolean',
    },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    max: 100,
    step: 1,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Volume',
    defaultValue: [75],
    max: 100,
    step: 1,
  },
};

export const WithValue: Story = {
  args: {
    label: 'Brightness',
    defaultValue: [50],
    max: 100,
    step: 1,
    showValue: true,
  },
};

export const WithFormatter: Story = {
  args: {
    label: 'Playback Speed',
    defaultValue: [1],
    min: 0.5,
    max: 2,
    step: 0.25,
    showValue: true,
    valueFormatter: (val) => `${val}x`,
  },
};

export const Range: Story = {
  args: {
    label: 'Trim Range',
    defaultValue: [25, 75],
    max: 100,
    step: 1,
    showValue: true,
    valueFormatter: (val) => `${val}s`,
  },
};

export const VideoProgress: Story = {
  args: {
    label: 'Video Progress',
    defaultValue: [0],
    max: 300,
    step: 1,
    showValue: true,
    valueFormatter: (val) => {
      const minutes = Math.floor(val / 60);
      const seconds = val % 60;
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    },
  },
};

export const Opacity: Story = {
  args: {
    label: 'Opacity',
    defaultValue: [100],
    min: 0,
    max: 100,
    step: 1,
    showValue: true,
    valueFormatter: (val) => `${val}%`,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Slider',
    defaultValue: [50],
    max: 100,
    step: 1,
    disabled: true,
    showValue: true,
  },
};
