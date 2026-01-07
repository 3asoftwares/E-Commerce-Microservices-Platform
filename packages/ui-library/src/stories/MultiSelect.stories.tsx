import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelect } from '../components/MultiSelect';
import { useState } from 'react';

const meta: Meta<typeof MultiSelect> = {
  title: 'Form/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultiSelect>;

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
  { value: 'au', label: 'Australia' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'in', label: 'India' },
];

export const Default: Story = {
  args: {
    options: countries,
    placeholder: 'Select countries',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <MultiSelect options={countries} variant="outline" placeholder="Outline" />
      <MultiSelect options={countries} variant="filled" placeholder="Filled" />
      <MultiSelect options={countries} variant="underline" placeholder="Underline" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <MultiSelect options={countries} size="sm" placeholder="Small" />
      <MultiSelect options={countries} size="md" placeholder="Medium" />
      <MultiSelect options={countries} size="lg" placeholder="Large" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <MultiSelect options={countries} placeholder="Normal" />
      <MultiSelect options={countries} error placeholder="Error state" />
      <MultiSelect options={countries} disabled placeholder="Disabled" />
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
      { value: 'de', label: 'Germany' },
    ],
    placeholder: 'Select countries',
  },
};

export const PreSelected: Story = {
  args: {
    options: countries,
    value: ['us', 'uk', 'ca'],
    placeholder: 'Select countries',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-4 w-80">
        <MultiSelect
          options={countries}
          value={value}
          onChange={setValue}
          placeholder="Select countries"
        />
        <p className="text-sm text-gray-600">
          Selected: {value.length > 0 ? value.join(', ') : 'None'}
        </p>
      </div>
    );
  },
};

export const CustomMaxHeight: Story = {
  args: {
    options: countries,
    maxHeight: '150px',
    placeholder: 'Select countries (custom height)',
  },
};
