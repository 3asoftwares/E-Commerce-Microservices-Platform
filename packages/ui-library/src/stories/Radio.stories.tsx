import type { Meta, StoryObj } from '@storybook/react';
import { Radio, RadioProps } from '../components/Radio';
import { useState } from 'react';

const meta = {
  title: 'Form/Radio',
  component: Radio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    orientation: {
      control: 'select',
      options: ['vertical', 'horizontal'],
    },
    variant: {
      control: 'select',
      options: ['default', 'card'],
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

const RadioWrapper = (args: RadioProps) => {
  const [value, setValue] = useState(args.value || '');
  return <Radio {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'default-radio',
    label: 'Choose an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const WithDescription: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'description-radio',
    label: 'Select a plan',
    options: [
      {
        value: 'basic',
        label: 'Basic Plan',
        description: 'Perfect for individuals and small projects',
      },
      {
        value: 'pro',
        label: 'Pro Plan',
        description: 'Best for professionals and growing teams',
      },
      {
        value: 'enterprise',
        label: 'Enterprise Plan',
        description: 'Advanced features for large organizations',
      },
    ],
  },
};

export const CardVariant: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'card-radio',
    label: 'Select delivery method',
    variant: 'card',
    options: [
      {
        value: 'standard',
        label: 'Standard Delivery',
        description: '5-7 business days',
      },
      {
        value: 'express',
        label: 'Express Delivery',
        description: '2-3 business days',
      },
      {
        value: 'overnight',
        label: 'Overnight Delivery',
        description: 'Next business day',
      },
    ],
  },
};

export const WithIcons: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'icon-radio',
    label: 'Payment method',
    variant: 'card',
    options: [
      { value: 'card', label: 'Credit/Debit Card', icon: '💳' },
      { value: 'bank', label: 'Bank Transfer', icon: '🏦' },
      { value: 'upi', label: 'UPI', icon: '📱' },
      { value: 'wallet', label: 'Digital Wallet', icon: '👛' },
    ],
  },
};

export const Horizontal: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'horizontal-radio',
    label: 'Choose size',
    orientation: 'horizontal',
    options: [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium' },
      { value: 'large', label: 'Large' },
      { value: 'xlarge', label: 'X-Large' },
    ],
  },
};

export const HorizontalCard: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'horizontal-card-radio',
    label: 'Select subscription',
    orientation: 'horizontal',
    variant: 'card',
    options: [
      { value: 'monthly', label: 'Monthly', description: '$9.99/mo' },
      { value: 'yearly', label: 'Yearly', description: '$99.99/yr (Save 17%)' },
    ],
  },
};

export const WithDisabledOption: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'disabled-option-radio',
    label: 'Choose a color',
    variant: 'card',
    options: [
      { value: 'red', label: 'Red', description: 'Available' },
      { value: 'blue', label: 'Blue', description: 'Out of stock', disabled: true },
      { value: 'green', label: 'Green', description: 'Available' },
    ],
  },
};

export const FullyDisabled: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'fully-disabled-radio',
    label: 'Disabled state',
    disabled: true,
    value: 'option2',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      { value: 'option3', label: 'Option 3' },
    ],
  },
};

export const WithError: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'error-radio',
    label: 'Select an option',
    error: 'Please select an option to continue',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
};

export const SmallSize: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'small-radio',
    label: 'Small size',
    size: 'sm',
    options: [
      { value: 'option1', label: 'Option 1', description: 'Description text' },
      { value: 'option2', label: 'Option 2', description: 'Description text' },
    ],
  },
};

export const LargeSize: Story = {
  render: (args: RadioProps) => <RadioWrapper {...args} />,
  args: {
    name: 'large-radio',
    label: 'Large size',
    size: 'lg',
    variant: 'card',
    options: [
      { value: 'option1', label: 'Option 1', description: 'Description text' },
      { value: 'option2', label: 'Option 2', description: 'Description text' },
    ],
  },
};
