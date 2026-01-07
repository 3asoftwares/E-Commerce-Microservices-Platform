import type { Meta, StoryObj } from '@storybook/react';
import { SearchBar } from '../components/SearchBar';

const meta = {
  title: 'Form/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSearch: () => {},
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: '',
    onChange: () => {},
    onSearch: () => {},
    placeholder: 'Search products...',
  },
};

export const WithQuery: Story = {
  args: {
    value: 'laptop',
    onChange: () => {},
    onSearch: () => {},
  },
};
