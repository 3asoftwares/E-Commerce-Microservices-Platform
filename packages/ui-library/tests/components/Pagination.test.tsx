import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../src/test-utils';
import { Pagination } from '../../src/components/Pagination/Pagination';

describe('Pagination', () => {
  const mockProps = {
    currentPage: 1,
    totalPages: 10,
    onPageChange: vi.fn(),
  };

  it('renders pagination component', () => {
    render(<Pagination {...mockProps} />);
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('does not render when totalPages is 1 or less', () => {
    const { container } = render(<Pagination {...mockProps} totalPages={1} />);
    expect(container.firstChild).toBeNull();
  });

  it('disables Previous button on first page', () => {
    render(<Pagination {...mockProps} currentPage={1} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<Pagination {...mockProps} currentPage={10} totalPages={10} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onPageChange when Previous is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...mockProps} currentPage={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  it('calls onPageChange when Next is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...mockProps} currentPage={5} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(6);
  });

  it('calls onPageChange when page number is clicked', () => {
    const onPageChange = vi.fn();
    render(<Pagination {...mockProps} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByText('2'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('highlights current page', () => {
    render(<Pagination {...mockProps} currentPage={3} />);
    const currentButton = screen.getByText('3');
    expect(currentButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('shows ellipsis when pages exceed showPages limit', () => {
    render(<Pagination {...mockProps} currentPage={6} totalPages={20} showPages={5} />);
    expect(screen.getAllByText('...').length).toBeGreaterThan(0);
  });

  it('shows first and last page with ellipsis', () => {
    render(<Pagination {...mockProps} currentPage={10} totalPages={20} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Pagination {...mockProps} className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('renders correct number of page buttons based on showPages', () => {
    render(<Pagination {...mockProps} totalPages={3} showPages={5} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});
