import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

const meta = {
  title: 'Data Display/Table',
  component: Table,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Manager', status: 'Active' },
];

export const Default: Story = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Role', accessor: 'role' },
      { header: 'Status', accessor: 'status' },
    ],
    data: sampleData,
  },
};

export const WithCustomCells: Story = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      {
        header: 'Status',
        accessor: 'status',
        cell: (row: Record<string, any>) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              row.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {row.status}
          </span>
        ),
      },
    ],
    data: sampleData,
  },
};

export const Hoverable: Story = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Role', accessor: 'role' },
    ],
    data: sampleData,
    hoverable: true,
  },
};

export const Striped: Story = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
      { header: 'Role', accessor: 'role' },
    ],
    data: sampleData,
    striped: true,
  },
};

export const Loading: Story = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
    ],
    data: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    columns: [
      { header: 'ID', accessor: 'id' },
      { header: 'Name', accessor: 'name' },
      { header: 'Email', accessor: 'email' },
    ],
    data: [],
    emptyMessage: 'No users found',
  },
};
