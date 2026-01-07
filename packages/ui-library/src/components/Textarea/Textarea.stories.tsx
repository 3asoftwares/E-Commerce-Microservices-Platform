import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Form/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    rows: { control: 'number' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: {
    placeholder: 'Type your message...',
    rows: 4,
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Description',
    placeholder: 'Describe your product...',
    rows: 4,
  },
};

export const WithError: Story = {
  args: {
    label: 'Description',
    placeholder: 'Describe your product...',
    error: 'Description is required',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled',
    placeholder: 'Cannot type here',
    disabled: true,
    rows: 4,
  },
};
