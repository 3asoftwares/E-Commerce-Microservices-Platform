import type { Meta, StoryObj } from '@storybook/react';
import { ToasterBox } from '../components/Toaster/ToasterBox';

const meta: Meta<typeof ToasterBox> = {
  title: 'Feedback/ToasterBox',
  component: ToasterBox,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
    },
    message: { control: 'text' },
    onClose: { action: 'closed' },
  },
};

export default meta;

type Story = StoryObj<typeof ToasterBox>;

export const Success: Story = {
  args: {
    message: 'Operation completed successfully!',
    type: 'success',
  },
};

export const Error: Story = {
  args: {
    message: 'Something went wrong. Please try again.',
    type: 'error',
  },
};

export const Info: Story = {
  args: {
    message: 'This is an informational message.',
    type: 'info',
  },
};

export const Warning: Story = {
  args: {
    message: 'Warning: Please check your input.',
    type: 'warning',
  },
};

export const Closable: Story = {
  args: {
    message: 'You can close this toaster.',
    type: 'info',
    onClose: () => {},
  },
};
