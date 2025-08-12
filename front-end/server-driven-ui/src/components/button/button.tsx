import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button.withConfig({
  shouldForwardProp: prop => prop !== 'loading',
})<{ variant: string; loading: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  min-height: 2.75rem;
  position: relative;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          color: #ffffff;
          
          &:hover:not(:disabled) {
            background-color: #2563eb;
          }
          
          &:active:not(:disabled) {
            background-color: #1d4ed8;
          }
        `;
      case 'secondary':
        return `
          background-color: #ffffff;
          color: #374151;
          border: 1px solid #d1d5db;
          
          &:hover:not(:disabled) {
            background-color: #f9fafb;
            border-color: #9ca3af;
          }
          
          &:active:not(:disabled) {
            background-color: #f3f4f6;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          color: #ffffff;
          
          &:hover:not(:disabled) {
            background-color: #dc2626;
          }
          
          &:active:not(:disabled) {
            background-color: #b91c1c;
          }
        `;
      default:
        return `
          background-color: #6b7280;
          color: #ffffff;
          
          &:hover:not(:disabled) {
            background-color: #4b5563;
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ScreenReaderText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

interface ButtonProps {
  id?: string;
  label: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  autoFocus?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  id,
  label,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  onClick,
  ariaLabel,
  ariaDescribedBy,
  autoFocus = false,
}) => {
  const handleClick = () => {
    if (onClick && !loading && !disabled) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Handle Enter and Space key presses
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const buttonId = id || `button-${Math.random().toString(36).substr(2, 9)}`;
  const isDisabled = disabled || loading;

  return (
    <StyledButton
      id={buttonId}
      data-automation={`button-${id || 'default'}`}
      type={type}
      variant={variant}
      loading={loading}
      disabled={isDisabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-disabled={isDisabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-busy={loading}
      autoFocus={autoFocus}
      tabIndex={isDisabled ? -1 : 0}
    >
      {loading && (
        <>
          <LoadingSpinner aria-hidden="true" />
          <ScreenReaderText>Loading...</ScreenReaderText>
        </>
      )}
      {label}
    </StyledButton>
  );
};
