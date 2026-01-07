import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { Textarea } from '../../src/components/Textarea/Textarea';

describe('Textarea', () => {
  it('renders without crashing', () => {
    render(<Textarea />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<Textarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('does not display label when not provided', () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<Textarea error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('applies error styling', () => {
    render(<Textarea error="Error" />);
    const errorText = screen.getByText('Error');
    expect(errorText).toHaveClass('text-red-500');
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Textarea onChange={handleChange} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('applies placeholder', () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText('Enter description')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it('applies disabled attribute', () => {
    render(<Textarea disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('sets rows attribute', () => {
    render(<Textarea rows={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});
