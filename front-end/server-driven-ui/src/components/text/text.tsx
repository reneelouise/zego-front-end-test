import React from 'react';
import styled from 'styled-components';

const StyledText = styled.div`
  font-size: 1rem;
  line-height: 1.5;
  color: #374151;
  margin-bottom: 1rem;

  &.label {
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.5rem;
  }

  &.paragraph {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  &.heading {
    font-size: 1.25rem;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1rem;
  }

  &.error {
    color: #dc2626;
    font-weight: 500;
  }

  &.success {
    color: #16a34a;
    font-weight: 500;
  }
`;

interface TextProps {
  id?: string;
  label: string;
  variant?: 'label' | 'paragraph' | 'heading' | 'error' | 'success';
  ariaLive?: 'polite' | 'assertive' | 'off';
  ariaLabel?: string;
}

export const Text: React.FC<TextProps> = ({
  id,
  label,
  variant = 'paragraph',
  ariaLive,
  ariaLabel,
}) => {
  if (!label) return null;

  return (
    <StyledText
      id={id}
      data-automation={`text-${id || 'default'}`}
      role={variant === 'heading' ? 'heading' : 'text'}
      aria-live={ariaLive}
      aria-label={ariaLabel}
    >
      {label}
    </StyledText>
  );
};
