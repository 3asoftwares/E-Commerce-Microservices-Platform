import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { Radio } from '../../src/components/Radio/Radio';

const mockOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3', disabled: true },
];

describe('Radio', () => {
  it('renders all options', () => {
    render(<Radio name="test" options={mockOptions} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<Radio name="test" options={mockOptions} label="Select an option" />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('selects correct option based on value', () => {
    render(<Radio name="test" options={mockOptions} value="option2" />);
    const radio2 = screen.getByDisplayValue('option2') as HTMLInputElement;
    expect(radio2.checked).toBe(true);
  });

  it('calls onChange when option is selected', () => {
    const onChange = vi.fn();
    render(<Radio name="test" options={mockOptions} onChange={onChange} />);
    fireEvent.click(screen.getByText('Option 1'));
    expect(onChange).toHaveBeenCalledWith('option1');
  });

  it('does not call onChange when disabled', () => {
    const onChange = vi.fn();
    render(<Radio name="test" options={mockOptions} onChange={onChange} disabled />);
    fireEvent.click(screen.getByText('Option 1'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('displays error message when provided', () => {
    render(<Radio name="test" options={mockOptions} error="Please select an option" />);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('applies vertical orientation by default', () => {
    const { container } = render(<Radio name="test" options={mockOptions} />);
    expect(container.querySelector('.space-y-3')).toBeInTheDocument();
  });

  it('applies horizontal orientation', () => {
    const { container } = render(
      <Radio name="test" options={mockOptions} orientation="horizontal" />
    );
    expect(container.querySelector('.flex.flex-wrap')).toBeInTheDocument();
  });

  it('renders with description when provided', () => {
    const optionsWithDesc = [{ value: 'opt1', label: 'Option 1', description: 'Description 1' }];
    render(<Radio name="test" options={optionsWithDesc} />);
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Radio name="test" options={mockOptions} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
