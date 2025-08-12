import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Input } from '../input';
import '@testing-library/jest-dom';

describe('Input Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders input field correctly', () => {
    render(<Input id="test-input" value="" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(
      <Input id="test-input" label="Name" value="" onChange={mockOnChange} />
    );
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(
      <Input
        id="test-input"
        placeholder="Enter your name"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByPlaceholderText('Enter your name')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    render(<Input id="test-input" value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('renders required field with asterisk', () => {
    render(
      <Input
        id="test-input"
        label="Name"
        required
        value=""
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders disabled field', () => {
    render(<Input id="test-input" disabled value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders with custom id', () => {
    render(<Input id="custom-input" value="" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-input');
  });

  it('renders with different input types', () => {
    const { rerender } = render(
      <Input id="test-input" type="email" value="" onChange={mockOnChange} />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');

    rerender(
      <Input id="test-input" type="password" value="" onChange={mockOnChange} />
    );
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');

    rerender(
      <Input id="test-input" type="number" value="" onChange={mockOnChange} />
    );
    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'number');
  });

  it('has proper ARIA attributes', () => {
    render(<Input id="test-input" required value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-required', 'true');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows error state correctly', () => {
    render(
      <Input
        id="test-input"
        error="This field is required"
        value=""
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('supports autoComplete attribute', () => {
    render(
      <Input
        id="test-input"
        autoComplete="email"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'autocomplete',
      'email'
    );
  });

  it('supports autoFocus prop', () => {
    render(
      <Input
        id="test-input"
        autoFocus={true}
        value=""
        onChange={mockOnChange}
      />
    );
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('handles keyboard events internally', () => {
    render(<Input id="test-input" value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input).toBeInTheDocument();
  });

  it('displays current value correctly', () => {
    render(
      <Input id="test-input" value="current value" onChange={mockOnChange} />
    );
    expect(screen.getByRole('textbox')).toHaveValue('current value');
  });

  it('handles empty string value', () => {
    render(<Input id="test-input" value="" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('handles special characters in value', () => {
    const specialValue = 'test@example.com & <script>alert("xss")</script>';
    render(
      <Input id="test-input" value={specialValue} onChange={mockOnChange} />
    );
    expect(screen.getByRole('textbox')).toHaveValue(specialValue);
  });

  it('supports aria-describedby for error messages', () => {
    render(
      <Input
        id="test-input"
        ariaDescribedBy="error-message"
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByRole('textbox')).toHaveAttribute(
      'aria-describedby',
      'error-message'
    );
  });

  it('still calls onChange when disabled (component behavior)', () => {
    render(<Input id="test-input" disabled value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockOnChange).toHaveBeenCalledWith('test');
  });

  it('handles rapid input changes', async () => {
    render(<Input id="test-input" value="" onChange={mockOnChange} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'a' } });
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.change(input, { target: { value: 'abc' } });

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(3);
      expect(mockOnChange).toHaveBeenLastCalledWith('abc');
    });
  });
});
