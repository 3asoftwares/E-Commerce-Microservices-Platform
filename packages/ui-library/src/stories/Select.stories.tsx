import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '../components/Select';
import { useState } from 'react';

const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
];

export const Default: Story = {
  args: {
    options: countries,
    placeholder: 'Select a country',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select options={countries} variant="outline" placeholder="Outline" />
      <Select options={countries} variant="filled" placeholder="Filled" />
      <Select options={countries} variant="underline" placeholder="Underline" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select options={countries} size="sm" placeholder="Small" />
      <Select options={countries} size="md" placeholder="Medium" />
      <Select options={countries} size="lg" placeholder="Large" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-64">
      <Select options={countries} placeholder="Normal" />
      <Select options={countries} error placeholder="Error state" />
      <Select options={countries} disabled placeholder="Disabled" />
    </div>
  ),
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { value: 'us', label: 'United States' },
      { value: 'uk', label: 'United Kingdom', disabled: true },
      { value: 'ca', label: 'Canada' },
      { value: 'au', label: 'Australia', disabled: true },
    ],
    placeholder: 'Select a country',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div className="flex flex-col gap-4 w-64">
        <Select
          options={countries}
          value={value}
          onChange={setValue}
          placeholder="Select a country"
        />
        <p className="text-sm text-gray-600">Selected: {value || 'None'}</p>
      </div>
    );
  },
};
