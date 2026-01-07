import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { Info } from '../../src/components/Info/Info';

describe('Info', () => {
  it('does not render when open is false', () => {
    render(<Info open={false} message="Info message" onClose={vi.fn()} />);
    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
  });

  it('renders when open is true', () => {
    render(<Info open={true} message="Info message" onClose={vi.fn()} />);
    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('displays default title', () => {
    render(<Info open={true} message="Test message" onClose={vi.fn()} />);
    expect(screen.getByText('Info')).toBeInTheDocument();
  });

  it('displays custom title when provided', () => {
    render(<Info open={true} title="Notice" message="Test message" onClose={vi.fn()} />);
    expect(screen.getByText('Notice')).toBeInTheDocument();
  });

  it('displays OK button', () => {
    render(<Info open={true} message="Test" onClose={vi.fn()} />);
    expect(screen.getByText('OK')).toBeInTheDocument();
  });

  it('calls onClose when OK button is clicked', () => {
    const onClose = vi.fn();
    render(<Info open={true} message="Test" onClose={onClose} />);
    fireEvent.click(screen.getByText('OK'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has info icon', () => {
    const { container } = render(<Info open={true} message="Test" onClose={vi.fn()} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('text-blue-500');
  });

  it('displays message correctly', () => {
    const message = 'This is an important information message for the user.';
    render(<Info open={true} message={message} onClose={vi.fn()} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
