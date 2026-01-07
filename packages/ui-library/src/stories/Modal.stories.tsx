import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Modal, ModalProps } from '../components/Modal';
import { Button } from '../components/Button';

const meta = {
  title: 'Feedback/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p className="text-gray-600">This is a simple modal with default settings.</p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Modal Title',
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};

export const WithContent: Story = {
  render: (args: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal with Content</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-4">
            <p className="text-gray-600">
              This modal contains more complex content including paragraphs and buttons.
            </p>
            <p className="text-gray-600">You can add any React components inside the modal body.</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsOpen(false)}>Confirm</Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Confirm Action',
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};

export const SmallSize: Story = {
  render: (args: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Small Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p className="text-gray-600">This is a small modal.</p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Small Modal',
    size: 'sm',
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};

export const LargeSize: Story = {
  render: (args: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Large Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p className="text-gray-600">
            This is a large modal with more space for content. It can accommodate larger forms,
            tables, or detailed information.
          </p>
        </Modal>
      </>
    );
  },
  args: {
    title: 'Large Modal',
    size: 'lg',
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};

export const WithoutCloseButton: Story = {
  render: (args: ModalProps) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal {...args} isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <p className="text-gray-600 mb-4">
            This modal doesn't have a close button. You must use the overlay or the button below.
          </p>
          <Button onClick={() => setIsOpen(false)}>Close Modal</Button>
        </Modal>
      </>
    );
  },
  args: {
    title: 'No Close Button',
    showCloseButton: false,
    isOpen: false,
    onClose: () => {},
    children: null,
  },
};
