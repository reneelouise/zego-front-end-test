import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Dropdown } from '../../dropdown';

describe('Dropdown', () => {
  const mockOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ];
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders dropdown with options', () => {
    render(<Dropdown options={mockOptions} value="" onChange={mockOnChange} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(
      <Dropdown
        label="Country"
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('calls onChange when selection changes', () => {
    render(<Dropdown options={mockOptions} value="" onChange={mockOnChange} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'us' } });
    expect(mockOnChange).toHaveBeenCalledWith('us');
  });

  it('renders required field with asterisk', () => {
    render(
      <Dropdown
        label="Country"
        required
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders disabled field', () => {
    render(
      <Dropdown
        disabled
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('renders with custom id', () => {
    render(
      <Dropdown
        id="test-dropdown"
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'test-dropdown');
  });

  it('displays selected value', () => {
    render(
      <Dropdown options={mockOptions} value="us" onChange={mockOnChange} />
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('us');
  });

  it('renders all options', () => {
    render(<Dropdown options={mockOptions} value="" onChange={mockOnChange} />);
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    render(
      <Dropdown
        required
        options={mockOptions}
        value=""
        onChange={mockOnChange}
      />
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-required', 'true');
    expect(select).toHaveAttribute('aria-invalid', 'false');
  });
});
