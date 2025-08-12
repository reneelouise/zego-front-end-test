import styled from 'styled-components';

export const FormContainer = styled.form`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);

  /* Focus management */
  &:focus-within {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Loading state */
  &.submitting {
    pointer-events: none;
    opacity: 0.7;
  }
`;

export const FormTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  text-align: center;

  /* Ensure sufficient color contrast */
  @media (prefers-contrast: high) {
    color: #000000;
  }
`;

export const FormDescription = styled.p`
  color: #6b7280;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
  line-height: 1.5;
`;

export const ErrorMessage = styled.div`
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    background-color: #ffffff;
    border: 2px solid #dc2626;
    color: #000000;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const SuccessMessage = styled.div`
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    background-color: #ffffff;
    border: 2px solid #16a34a;
    color: #000000;
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const FormInstructions = styled.div`
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  padding: 1rem;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    background-color: #ffffff;
    border: 2px solid #475569;
    color: #000000;
  }
`;

export const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 0.5rem;
`;

export const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
`;

export const ResetButton = styled.button`
  background-color: #6b7280;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease-in-out;

  &:hover:not(:disabled) {
    background-color: #4b5563;
  }

  &:active:not(:disabled) {
    background-color: #374151;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.1);
  }
`;
