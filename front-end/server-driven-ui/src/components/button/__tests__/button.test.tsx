import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Button } from '../button';
import '@testing-library/jest-dom';

describe('Button', () => {
  const mockOnClick = vi.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders button with label', () => {
    render(<Button label="Click me" onClick={mockOnClick} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<Button label="Click me" onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with custom id', () => {
    render(<Button id="test-button" label="Click me" onClick={mockOnClick} />);
    expect(screen.getByRole('button')).toHaveAttribute('id', 'test-button');
  });

  it('renders with proper styling classes', () => {
    render(<Button label="Click me" onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    // Note: styled-components generates unique class names, so we test for presence
    expect(button.className).toBeTruthy();
  });

  it('renders different button types', () => {
    const { rerender } = render(
      <Button type="submit" label="Submit" onClick={mockOnClick} />
    );
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset" label="Reset" onClick={mockOnClick} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'reset');
  });

  it('renders disabled button', () => {
    render(<Button disabled label="Disabled" onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('renders loading button', () => {
    render(<Button loading label="Loading" onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('does not call onClick when disabled', () => {
    render(<Button disabled label="Disabled" onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when loading', () => {
    render(<Button loading label="Loading" onClick={mockOnClick} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has proper ARIA attributes when disabled', () => {
    render(<Button disabled label="Disabled" onClick={mockOnClick} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
  });
});
