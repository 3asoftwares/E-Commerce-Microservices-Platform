import React from 'react';

// Mock Button component
export const Button: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  size?: string;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, onClick, className, disabled, type = 'button' }) => (
  <button
    type={type}
    onClick={onClick}
    className={className}
    disabled={disabled}
    data-testid="mock-button"
  >
    {children}
  </button>
);

// Mock Input component
export const Input: React.FC<{
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  name?: string;
  id?: string;
  disabled?: boolean;
}> = ({ value, onChange, placeholder, type = 'text', className, name, id, disabled }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={className}
    name={name}
    id={id}
    disabled={disabled}
    data-testid="mock-input"
  />
);

// Mock Card component
export const Card: React.FC<{
  children?: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={className} data-testid="mock-card">
    {children}
  </div>
);

// Mock Badge component
export const Badge: React.FC<{
  children?: React.ReactNode;
  variant?: string;
}> = ({ children, variant }) => (
  <span data-testid="mock-badge" data-variant={variant}>
    {children}
  </span>
);

// Mock Spinner/Loading component
export const Spinner: React.FC<{
  size?: string;
}> = ({ size }) => <div data-testid="mock-spinner" data-size={size} />;

export const Loading: React.FC = () => <div data-testid="mock-loading">Loading...</div>;

// Mock Select component
export const Select: React.FC<{
  value?: string;
  onChange?: (value: string) => void;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}> = ({ value, onChange, options = [], placeholder }) => (
  <select value={value} onChange={(e) => onChange?.(e.target.value)} data-testid="mock-select">
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);
