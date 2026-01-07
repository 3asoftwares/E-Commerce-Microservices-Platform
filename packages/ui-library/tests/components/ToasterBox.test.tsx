import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { ToasterBox } from '../../src/components/Toaster/ToasterBox';

describe('ToasterBox', () => {
  it('renders message', () => {
    render(<ToasterBox message="Test notification" />);
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('renders with alert role', () => {
    render(<ToasterBox message="Alert message" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies info type by default', () => {
    render(<ToasterBox message="Info message" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-blue-500');
  });

  it('applies success type styling', () => {
    render(<ToasterBox message="Success!" type="success" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-green-500');
  });

  it('applies error type styling', () => {
    render(<ToasterBox message="Error!" type="error" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-red-500');
  });

  it('applies warning type styling', () => {
    render(<ToasterBox message="Warning!" type="warning" />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('border-yellow-500');
  });

  it('shows close button when onClose is provided', () => {
    render(<ToasterBox message="Test" onClose={vi.fn()} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });

  it('does not show close button when onClose is not provided', () => {
    render(<ToasterBox message="Test" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<ToasterBox message="Test" onClose={onClose} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('displays success icon for success type', () => {
    const { container } = render(<ToasterBox message="Success!" type="success" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('displays error icon for error type', () => {
    const { container } = render(<ToasterBox message="Error!" type="error" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
