import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  variant?: 'outline' | 'filled' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  error?: boolean;
  className?: string;
  label?: string;
}

const variantClasses = {
  outline: 'border-2 border-gray-300 bg-white hover:border-gray-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200',
  filled: 'border-0 bg-gray-100 hover:bg-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-200',
  underline: 'border-0 border-b-2 border-gray-400 bg-transparent hover:border-gray-600 focus:border-blue-600',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-5 py-3 text-lg',
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  variant = 'outline',
  size = 'md',
  disabled = false,
  error = false,
  className = '',
  label,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  const errorClasses = error ? 'border-red-600 focus:border-red-600 focus:ring-red-200' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'cursor-pointer';

  return (
    <div className="">
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`rounded-lg transition-all duration-200 outline-none text-gray-900 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${errorClasses} ${disabledClasses} ${className}`}
      >
        <option value="" disabled className="text-gray-500">
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className="text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
