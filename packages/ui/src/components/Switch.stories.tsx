import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
  args: {
    onCheckedChange: fn(),
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithLabel: Story = {
  args: {
    label: 'Enable notifications',
  },
};

export const WithDescription: Story = {
  args: {
    label: 'Auto-save',
    description: 'Automatically save your project every 5 minutes',
  },
};

export const Checked: Story = {
  args: {
    label: 'Dark mode',
    defaultChecked: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full width switch',
    description: 'Label on left, switch on right',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small switch',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large switch',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled switch',
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    label: 'Disabled checked',
    disabled: true,
    defaultChecked: true,
  },
};

export const MultipleSettings: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Switch
        label="Enable notifications"
        description="Receive updates about your video exports"
        fullWidth
      />
      <Switch
        label="Auto-play preview"
        description="Automatically play videos when hovering"
        fullWidth
      />
      <Switch
        label="High quality rendering"
        description="Use maximum quality settings (slower export)"
        fullWidth
        defaultChecked
      />
      <Switch
        label="Dark mode"
        description="Switch to dark theme"
        fullWidth
      />
    </div>
  ),
};
