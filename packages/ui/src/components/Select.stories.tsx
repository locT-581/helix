import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectGroupLabel,
  SelectSeparator,
} from './Select';

const meta = {
  title: 'Components/Select',
  component: Select,
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
    required: {
      control: 'boolean',
    },
  },
  args: {
    onValueChange: fn(),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Select an option',
    children: (
      <>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </>
    ),
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Video Quality',
    placeholder: 'Select quality',
    children: (
      <>
        <SelectItem value="720p">720p HD</SelectItem>
        <SelectItem value="1080p">1080p Full HD</SelectItem>
        <SelectItem value="4k">4K Ultra HD</SelectItem>
      </>
    ),
  },
};

export const WithGroups: Story = {
  args: {
    label: 'Effect Type',
    placeholder: 'Choose effect',
    children: (
      <>
        <SelectGroup>
          <SelectGroupLabel>Video Effects</SelectGroupLabel>
          <SelectItem value="blur">Blur</SelectItem>
          <SelectItem value="sharpen">Sharpen</SelectItem>
          <SelectItem value="brightness">Brightness</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectGroupLabel>Filters</SelectGroupLabel>
          <SelectItem value="grayscale">Grayscale</SelectItem>
          <SelectItem value="sepia">Sepia</SelectItem>
          <SelectItem value="vintage">Vintage</SelectItem>
        </SelectGroup>
      </>
    ),
  },
};

export const WithDisabledItem: Story = {
  args: {
    label: 'Export Format',
    placeholder: 'Select format',
    children: (
      <>
        <SelectItem value="mp4">MP4</SelectItem>
        <SelectItem value="webm">WebM</SelectItem>
        <SelectItem value="mov" disabled>
          MOV (Coming Soon)
        </SelectItem>
        <SelectItem value="avi" disabled>
          AVI (Coming Soon)
        </SelectItem>
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small select',
    children: (
      <>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
      </>
    ),
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large select',
    children: (
      <>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    placeholder: 'Cannot select',
    disabled: true,
    children: (
      <>
        <SelectItem value="1">Option 1</SelectItem>
        <SelectItem value="2">Option 2</SelectItem>
      </>
    ),
  },
};

export const DefaultValue: Story = {
  args: {
    label: 'Aspect Ratio',
    defaultValue: '16:9',
    children: (
      <>
        <SelectItem value="16:9">16:9 (Widescreen)</SelectItem>
        <SelectItem value="4:3">4:3 (Standard)</SelectItem>
        <SelectItem value="1:1">1:1 (Square)</SelectItem>
        <SelectItem value="9:16">9:16 (Vertical)</SelectItem>
      </>
    ),
  },
};
