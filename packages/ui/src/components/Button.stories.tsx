import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Play, Pause, Download } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Export Video',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Save Draft',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Preview',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Cancel',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete Project',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
};

export const WithIconLeft: Story = {
  args: {
    iconLeft: <Play size={20} />,
    children: 'Play Video',
  },
};

export const WithIconRight: Story = {
  args: {
    iconRight: <Download size={20} />,
    children: 'Download',
  },
};

export const WithBothIcons: Story = {
  args: {
    iconLeft: <Play size={20} />,
    iconRight: <Pause size={20} />,
    children: 'Play/Pause',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Processing...',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled Button',
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    children: 'Full Width Button',
  },
  parameters: {
    layout: 'padded',
  },
};
