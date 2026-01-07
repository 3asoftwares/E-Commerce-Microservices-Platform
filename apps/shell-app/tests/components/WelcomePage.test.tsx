import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WelcomePage } from '../../src/components/WelcomePage';

// Mock window.location
const mockLocation = {
  href: '',
  assign: jest.fn(),
};

Object.defineProperty(window, 'location', {
  writable: true,
  value: mockLocation,
});

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

describe('WelcomePage Component', () => {
  const mockOnSignupClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
  });

  it('should render the welcome heading', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getByText(/welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/3A Softwares/i)).toBeInTheDocument();
  });

  it('should display platform description', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getByText(/complete e-commerce platform solution/i)).toBeInTheDocument();
  });

  it('should render Get Started button', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });

  it('should scroll to platform features when Get Started is clicked', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);

    // Create a mock element for getElementById to return
    const mockElement = document.createElement('div');
    mockElement.id = 'platform-features';
    document.body.appendChild(mockElement);

    const getStartedButton = screen.getByRole('button', { name: /get started/i });
    fireEvent.click(getStartedButton);

    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(mockElement);
  });

  it('should display Admin Portal card', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getAllByText(/admin portal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/user & seller management/i)).toBeInTheDocument();
  });

  it('should display Seller Portal card', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getAllByText(/seller portal/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/product catalog management/i)).toBeInTheDocument();
  });

  it('should display Customer Storefront card', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getByText(/customer storefront/i)).toBeInTheDocument();
    expect(screen.getByText(/advanced product search/i)).toBeInTheDocument();
  });

  it('should navigate to admin portal when button clicked', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);

    const adminButton = screen.getByRole('button', { name: /open admin portal/i });
    fireEvent.click(adminButton);

    expect(mockLocation.href).toBe('http://localhost:3001');
  });

  it('should navigate to seller portal when button clicked', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);

    const sellerButton = screen.getByRole('button', { name: /open seller portal/i });
    fireEvent.click(sellerButton);

    expect(mockLocation.href).toBe('http://localhost:3002');
  });

  it('should navigate to storefront when button clicked', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);

    const storefrontButton = screen.getByRole('button', { name: /open storefront/i });
    fireEvent.click(storefrontButton);

    expect(mockLocation.href).toBe('http://localhost:3003');
  });

  it('should call onSignupClick when Create Account button is clicked', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);

    const createAccountButton = screen.getByRole('button', { name: /create account/i });
    fireEvent.click(createAccountButton);

    expect(mockOnSignupClick).toHaveBeenCalledTimes(1);
  });

  it('should display support button', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getByRole('button', { name: /support/i })).toBeInTheDocument();
  });

  it('should open support modal when Support button is clicked', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);

    const supportButton = screen.getByRole('button', { name: /support/i });
    fireEvent.click(supportButton);

    expect(screen.getByText(/contact support/i)).toBeInTheDocument();
  });

  it('should display Ready to Get Started section', () => {
    render(<WelcomePage onSignupClick={mockOnSignupClick} />);
    expect(screen.getByText(/ready to get started/i)).toBeInTheDocument();
  });
});
