import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from '../components/Pagination';

const meta = {
  title: 'Data Display/Pagination',
  component: Pagination,
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { currentPage: 1, totalPages: 10, onPageChange: () => {} } };

export const FirstPage: Story = { args: { currentPage: 1, totalPages: 5, onPageChange: () => {} } };

export const MiddlePage: Story = { args: { currentPage: 3, totalPages: 5, onPageChange: () => {} } };

export const LastPage: Story = { args: { currentPage: 5, totalPages: 5, onPageChange: () => {} } };

export const ManyPages: Story = { args: { currentPage: 10, totalPages: 50, onPageChange: () => {} } };
