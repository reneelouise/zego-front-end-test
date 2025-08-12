import React from 'react';
import styled from 'styled-components';

const DropdownContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const StyledLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const RequiredAsterisk = styled.span`
  color: #ef4444;
  margin-left: 0.25rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #111827;
  background-color: #ffffff;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  appearance: none;
  transition:
    border-color 0.15s ease-in-out,
    box-shadow 0.15s ease-in-out;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:disabled {
    background-color: #f9fafb;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &.error {
    border-color: #ef4444;

    &:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }
`;

const ErrorMessage = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ErrorIcon = styled.span`
  font-size: 1rem;
`;

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  id?: string;
  className?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  ariaDescribedBy?: string;
  autoFocus?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  id,
  className,
  label,
  required = false,
  disabled = false,
  options,
  value,
  onChange,
  error,
  ariaDescribedBy,
  autoFocus = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    // Allow form submission on Enter key
    if (e.key === 'Enter' && e.currentTarget.form) {
      e.currentTarget.form.requestSubmit();
    }
  };

  const selectId = id || `dropdown-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${selectId}-error` : undefined;
  // Use ariaDescribedBy if provided, otherwise use errorId
  const describedBy = ariaDescribedBy || errorId;

  return (
    <DropdownContainer className={className}>
      {label && (
        <StyledLabel
          htmlFor={selectId}
          data-automation={`dropdown-label-${id || 'default'}`}
        >
          {label}
          {required && <RequiredAsterisk aria-hidden="true">*</RequiredAsterisk>}
        </StyledLabel>
      )}
      <StyledSelect
        id={selectId}
        data-automation={`dropdown-field-${id || 'default'}`}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-label={!label ? 'Select an option' : undefined}
        className={error ? 'error' : ''}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </StyledSelect>
      {error && (
        <ErrorMessage id={errorId} role="alert" aria-live="polite">
          <ErrorIcon>⚠️</ErrorIcon>
          {error}
        </ErrorMessage>
      )}
    </DropdownContainer>
  );
};
