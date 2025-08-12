import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
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

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
  line-height: 1.5;
  color: #111827;
  background-color: #ffffff;
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

  &::placeholder {
    color: #9ca3af;
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

interface InputProps {
  id?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  error?: string;
  ariaDescribedBy?: string;
  autoComplete?: string;
  autoFocus?: boolean;
}

export const Input: React.FC<InputProps> = ({
  id,
  label,
  placeholder,
  required = false,
  disabled = false,
  value,
  onChange,
  type = 'text',
  error,
  ariaDescribedBy,
  autoComplete,
  autoFocus = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Allow form submission on Enter key
    if (e.key === 'Enter' && e.currentTarget.form) {
      e.currentTarget.form.requestSubmit();
    }
  };

  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  // Use ariaDescribedBy if provided, otherwise use errorId
  const describedBy = ariaDescribedBy || errorId;

  return (
    <InputContainer>
      {label && (
        <StyledLabel
          htmlFor={inputId}
          data-automation={`input-label-${id || 'default'}`}
        >
          {label}
          {required && <RequiredAsterisk aria-hidden="true">*</RequiredAsterisk>}
        </StyledLabel>
      )}
      <StyledInput
        id={inputId}
        data-automation={`input-field-${id || 'default'}`}
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-label={!label ? placeholder : undefined}
      />
      {error && (
        <ErrorMessage id={errorId} role="alert" aria-live="polite">
          <ErrorIcon>⚠️</ErrorIcon>
          {error}
        </ErrorMessage>
      )}
    </InputContainer>
  );
};
