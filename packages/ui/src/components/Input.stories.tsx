import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Search, Mail, Lock, Eye } from 'lucide-react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    state: {
      control: 'select',
      options: ['error', 'success', 'warning'],
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Project Name',
    placeholder: 'My awesome video',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'Video URL',
    placeholder: 'https://example.com/video.mp4',
    helperText: 'Enter a valid video URL',
  },
};

export const Email: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    helperText: "We'll never share your email",
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    helperText: 'At least 8 characters',
  },
};

export const Number: Story = {
  args: {
    label: 'Video Duration (seconds)',
    type: 'number',
    placeholder: '0',
    min: 0,
    max: 300,
  },
};

export const WithIconLeft: Story = {
  args: {
    label: 'Search',
    placeholder: 'Search videos...',
    iconLeft: <Search size={20} />,
  },
};

export const WithIconRight: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    iconRight: <Mail size={20} />,
  },
};

export const WithBothIcons: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '••••••••',
    iconLeft: <Lock size={20} />,
    iconRight: <Eye size={20} />,
  },
};

export const Error: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address',
  },
};

export const Success: Story = {
  args: {
    label: 'Username',
    placeholder: 'johndoe',
    state: 'success',
    helperText: 'Username is available!',
  },
};

export const Warning: Story = {
  args: {
    label: 'File Size',
    placeholder: '1000',
    state: 'warning',
    helperText: 'File size is large, may take time to upload',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Small Input',
    placeholder: 'Small size',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    label: 'Large Input',
    placeholder: 'Large size',
  },
};
