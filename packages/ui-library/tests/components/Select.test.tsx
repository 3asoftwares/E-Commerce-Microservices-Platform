import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { Select } from '../../src/components/Select/Select';

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3', disabled: true },
];

describe('Select', () => {
  it('renders select element', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('displays placeholder', () => {
    render(<Select options={mockOptions} placeholder="Select option" />);
    expect(screen.getByText('Select option')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select options={mockOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('handles onChange event', () => {
    const handleChange = vi.fn();
    render(<Select options={mockOptions} onChange={handleChange} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    expect(handleChange).toHaveBeenCalledWith('1');
  });

  it('sets selected value', () => {
    render(<Select options={mockOptions} value="2" />);
    expect(screen.getByRole('combobox')).toHaveValue('2');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Select options={mockOptions} size="sm" />);
    expect(screen.getByRole('combobox')).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Select options={mockOptions} size="md" />);
    expect(screen.getByRole('combobox')).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(<Select options={mockOptions} size="lg" />);
    expect(screen.getByRole('combobox')).toHaveClass('px-5', 'py-3', 'text-lg');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Select options={mockOptions} variant="outline" />);
    expect(screen.getByRole('combobox')).toHaveClass('border-2', 'border-gray-300', 'bg-white');

    rerender(<Select options={mockOptions} variant="filled" />);
    expect(screen.getByRole('combobox')).toHaveClass('border-0', 'bg-gray-100');

    rerender(<Select options={mockOptions} variant="underline" />);
    expect(screen.getByRole('combobox')).toHaveClass('border-0', 'border-b-2');
  });

  it('disables select when disabled prop is true', () => {
    render(<Select options={mockOptions} disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies error styling', () => {
    render(<Select options={mockOptions} error />);
    expect(screen.getByRole('combobox')).toHaveClass('border-red-600');
  });

  it('disables specific options', () => {
    render(<Select options={mockOptions} />);
    const options = screen.getAllByRole('option');
    expect(options[3]).toBeDisabled(); 
  });

  it('applies custom className', () => {
    render(<Select options={mockOptions} className="custom-class" />);
    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });
});
