import { describe, it, expect } from 'vitest';
import { render, screen } from '../../src/test-utils';
import { Page } from '../../src/components/Page/Page';

describe('Page', () => {
  it('renders page component', () => {
    render(<Page />);
    expect(screen.getByText('Pages in Storybook')).toBeInTheDocument();
  });

  it('renders header component', () => {
    render(<Page />);
    expect(screen.getByText('3A Softwares')).toBeInTheDocument();
  });

  it('renders login button initially', () => {
    render(<Page />);
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('renders sign up button initially', () => {
    render(<Page />);
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  it('renders content about component-driven development', () => {
    render(<Page />);
    expect(screen.getAllByText(/component-driven/i).length).toBeGreaterThan(0);
  });

  it('renders tip section', () => {
    render(<Page />);
    expect(screen.getByText('Tip')).toBeInTheDocument();
  });

  it('contains links to Storybook resources', () => {
    render(<Page />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('has link to component-driven.org', () => {
    render(<Page />);
    const link = screen.getByRole('link', { name: /component-driven/i });
    expect(link).toHaveAttribute('href', 'https://componentdriven.org');
  });

  it('has link to Storybook tutorials', () => {
    render(<Page />);
    const link = screen.getByRole('link', { name: /storybook tutorials/i });
    expect(link).toHaveAttribute('href', 'https://storybook.js.org/tutorials/');
  });
});
