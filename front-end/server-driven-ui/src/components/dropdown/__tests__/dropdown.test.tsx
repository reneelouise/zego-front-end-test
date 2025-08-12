import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Dropdown } from '../dropdown';

describe('Dropdown', () => {
  const mockOptions = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
  ];
  const mockOnChange = vi.fn();

  const renderDropdown = (
    props: Partial<React.ComponentProps<typeof Dropdown>> = {}
  ) =>
    render(
      <Dropdown
        options={mockOptions}
        value=""
        onChange={mockOnChange}
        {...props}
      />
    );

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders dropdown with options', () => {
    renderDropdown();
    expect(screen.getByRole('combobox')).toBeTruthy();
    expect(screen.getByText('Select an option')).toBeTruthy();
  });

  it('renders with label', () => {
    renderDropdown({ label: 'Country' });
    expect(screen.getByText('Country')).toBeTruthy();
  });

  it('calls onChange when selection changes', () => {
    renderDropdown();
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'us' } });
    expect(mockOnChange).toHaveBeenCalledWith('us');
  });

  it('renders required field with asterisk', () => {
    renderDropdown({ label: 'Country', required: true });
    // Check for required attributes on the select element
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('required');
    expect(select).toHaveAttribute('aria-required', 'true');
    // Check that the asterisk is rendered
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('renders with custom id', () => {
    renderDropdown({ id: 'test-dropdown' });
    expect(screen.getByRole('combobox')).toHaveAttribute('id', 'test-dropdown');
  });

  it('displays selected value', () => {
    renderDropdown({ value: 'us' });
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('us');
  });

  it('renders all options', () => {
    renderDropdown();
    expect(screen.getByText('United States')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    expect(screen.getByText('Canada')).toBeInTheDocument();
  });

  it('has proper ARIA attributes', () => {
    renderDropdown({ required: true });
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-required', 'true');
    expect(select).toHaveAttribute('aria-invalid', 'false');
  });
});
