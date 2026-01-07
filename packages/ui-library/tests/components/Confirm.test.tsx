import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { Confirm } from '../../src/components/Confirm/Confirm';
import '@testing-library/jest-dom';

describe('Confirm', () => {
  it('does not render when open is false', () => {
    render(<Confirm open={false} message="Are you sure?" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<Confirm open={true} message="Are you sure?" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('displays default title', () => {
    render(<Confirm open={true} message="Test message" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  it('displays custom title when provided', () => {
    render(
      <Confirm
        open={true}
        title="Delete Item"
        message="Are you sure?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
  });

  it('displays default button text', () => {
    render(<Confirm open={true} message="Test" onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('displays custom button text', () => {
    render(
      <Confirm
        open={true}
        message="Test"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<Confirm open={true} message="Test" onConfirm={onConfirm} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByText('Yes'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<Confirm open={true} message="Test" onConfirm={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('No'));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
