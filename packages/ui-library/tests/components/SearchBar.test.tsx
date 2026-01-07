import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../../src/components/SearchBar/SearchBar';

describe('SearchBar', () => {
  const mockProps = {
    value: '',
    onChange: vi.fn(),
    onSearch: vi.fn(),
  };

  it('renders search input', () => {
    render(<SearchBar {...mockProps} />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('displays custom placeholder', () => {
    render(<SearchBar {...mockProps} placeholder="Search items..." />);
    expect(screen.getByPlaceholderText('Search items...')).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<SearchBar {...mockProps} value="test query" />);
    expect(screen.getByDisplayValue('test query')).toBeInTheDocument();
  });

  it('calls onChange when typing', async () => {
    const onChange = vi.fn();
    render(<SearchBar {...mockProps} onChange={onChange} />);
    const input = screen.getByPlaceholderText('Search products...');
    await userEvent.type(input, 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onSearch when form is submitted', () => {
    const onSearch = vi.fn();
    render(<SearchBar {...mockProps} value="test" onSearch={onSearch} />);
    const form = screen.getByPlaceholderText('Search products...').closest('form');
    fireEvent.submit(form!);
    expect(onSearch).toHaveBeenCalledWith('test');
  });

  it('shows clear button when value is not empty', () => {
    const { container } = render(<SearchBar {...mockProps} value="test" />);
    const clearButton = container.querySelector('button[type="button"]');
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear button when value is empty', () => {
    const { container } = render(<SearchBar {...mockProps} value="" />);
    const clearButton = container.querySelector('button[type="button"]');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear button is clicked', () => {
    const onChange = vi.fn();
    const { container } = render(<SearchBar {...mockProps} value="test" onChange={onChange} />);
    const clearButton = container.querySelector('button[type="button"]');
    fireEvent.click(clearButton!);
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('shows suggestions when focused and showSuggestions is true', async () => {
    const suggestions = ['Product 1', 'Product 2', 'Product 3'];
    render(<SearchBar {...mockProps} suggestions={suggestions} showSuggestions />);
    const input = screen.getByPlaceholderText('Search products...');
    await userEvent.click(input);
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });

  it('does not show suggestions when showSuggestions is false', async () => {
    const suggestions = ['Product 1', 'Product 2'];
    render(<SearchBar {...mockProps} suggestions={suggestions} showSuggestions={false} />);
    const input = screen.getByPlaceholderText('Search products...');
    await userEvent.click(input);
    expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
  });

  it('handles suggestion click', async () => {
    const onChange = vi.fn();
    const onSearch = vi.fn();
    const suggestions = ['Product 1', 'Product 2'];
    render(
      <SearchBar
        {...mockProps}
        onChange={onChange}
        onSearch={onSearch}
        suggestions={suggestions}
        showSuggestions
      />
    );
    const input = screen.getByPlaceholderText('Search products...');
    await userEvent.click(input);
    fireEvent.click(screen.getByText('Product 1'));
    expect(onChange).toHaveBeenCalledWith('Product 1');
    expect(onSearch).toHaveBeenCalledWith('Product 1');
  });

  it('applies custom className', () => {
    const { container } = render(<SearchBar {...mockProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders search icon', () => {
    const { container } = render(<SearchBar {...mockProps} />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
