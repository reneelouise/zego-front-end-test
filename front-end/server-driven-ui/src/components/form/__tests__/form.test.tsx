import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { Form } from '../form';

// Helper function to get elements by data-automation attribute
const getByAutomation = (automationId: string) => {
  return document.querySelector(`[data-automation="${automationId}"]`) as HTMLElement;
};
import type { FormConfig } from '../types';

describe('Form Component', () => {
  const mockConfig: FormConfig = {
    title: 'Test Form',
    description: 'Test form description',
    components: [
      {
        id: 'first-name',
        type: 'input',
        label: 'First Name',
        required: true,
        placeholder: 'Enter your first name',
      },
      {
        id: 'email',
        type: 'input',
        label: 'Email',
        required: true,
        placeholder: 'Enter your email',
      },
      {
        id: 'country',
        type: 'dropdown',
        label: 'Country',
        required: true,
        options: [
          { value: 'us', label: 'United States' },
          { value: 'uk', label: 'United Kingdom' },
        ],
      },
      {
        id: 'submit',
        type: 'button',
        label: 'Submit',
      },
    ],
    submitUrl: '/api/submit',
    method: 'POST',
  };

  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    vi.clearAllMocks();
  });

  it('renders form with title and description', () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByText('Test form description')).toBeInTheDocument();
  });

  it('renders all form components correctly', () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('handles input changes and stores values correctly', async () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    await waitFor(() => {
      expect(firstNameInput).toHaveValue('John');
      expect(emailInput).toHaveValue('john@example.com');
    });
  });

  it('handles dropdown selection correctly', async () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    const countrySelect = getByAutomation('dropdown-field-country') as HTMLSelectElement;
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    await waitFor(() => {
      expect(countrySelect).toHaveValue('us');
    });
  });

  it('validates required fields on submission', async () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please fix the errors below')
      ).toBeInTheDocument();
      // Check for all required field errors without assuming order
      const errorMessages = screen.getAllByText(/is required/);
      expect(errorMessages).toHaveLength(3);
      expect(screen.getByText('First Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Country is required')).toBeInTheDocument();
    });
  });

  it('submits form with valid data', async () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    // Fill in required fields using data-automation selectors
    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;
    const countrySelect = getByAutomation('dropdown-field-country') as HTMLSelectElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        'first-name': 'John',
        email: 'john@example.com',
        country: 'us',
      });
    });
  });

  it('validates email format correctly', async () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;
    const countrySelect = getByAutomation('dropdown-field-country') as HTMLSelectElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    mockOnSubmit.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    // Fill in required fields using data-automation selectors
    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;
    const countrySelect = getByAutomation('dropdown-field-country') as HTMLSelectElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveAttribute('aria-disabled', 'true');
    });
  });

  it('shows success message after successful submission', async () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    // Fill in required fields using data-automation selectors
    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;
    const countrySelect = getByAutomation('dropdown-field-country') as HTMLSelectElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Form submitted successfully!')
      ).toBeInTheDocument();
    });
  });

  it('shows error message on submission failure', async () => {
    const errorMessage = 'Submission failed';
    mockOnSubmit.mockRejectedValue(new Error(errorMessage));

    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    // Fill in required fields using data-automation selectors
    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;
    const countrySelect = getByAutomation('dropdown-field-country') as HTMLSelectElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('clears errors when user starts typing', async () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please fix the errors below')
      ).toBeInTheDocument();
    });

    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    await waitFor(() => {
      expect(
        screen.queryByText('Please fix the errors below')
      ).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('aria-labelledby', 'form-title');
    expect(form).toHaveAttribute('aria-describedby', 'form-description');
    expect(form).toHaveAttribute('novalidate');
  });

  it('announces required fields count to screen readers', () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    expect(
      screen.getByText(
        'This form has 3 required fields. Required fields are marked with an asterisk (*).'
      )
    ).toBeInTheDocument();
  });

  it('handles form with no required fields', () => {
    const configWithoutRequired = {
      ...mockConfig,
      components: mockConfig.components.map(comp => ({
        ...comp,
        required: false,
      })),
    };

    render(<Form config={configWithoutRequired} onSubmit={mockOnSubmit} />);

    expect(
      screen.getByText(
        'This form has 0 required fields. Required fields are marked with an asterisk (*).'
      )
    ).toBeInTheDocument();
  });

  it('resets form after successful submission', async () => {
    const successfulOnSubmit = vi.fn().mockResolvedValue(undefined);
    render(<Form config={mockConfig} onSubmit={successfulOnSubmit} />);

    // Fill in required fields
    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;
    const countrySelect = getByAutomation('dropdown-field-country') as HTMLSelectElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(countrySelect, { target: { value: 'us' } });

    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submitButton);

    // Wait for success message using data-automation
    await waitFor(() => {
      const successElement = document.querySelector(
        '[data-automation="form-success"]'
      );
      expect(successElement).toBeInTheDocument();
    });

    // Wait for auto-reset (2 seconds)
    await waitFor(
      () => {
        expect(firstNameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(countrySelect).toHaveValue('');
      },
      { timeout: 3000 }
    );
  });

  it('shows reset button when form has data', () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    // Initially no reset button
    expect(screen.queryByText('Reset Form')).not.toBeInTheDocument();

    // Fill in a field
    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    fireEvent.change(firstNameInput, { target: { value: 'John' } });

    // Reset button should appear
    expect(screen.getByText('Reset Form')).toBeInTheDocument();
  });

  it('resets form when reset button is clicked', () => {
    render(<Form config={mockConfig} onSubmit={mockOnSubmit} />);

    // Fill in fields
    const firstNameInput = getByAutomation('input-field-first-name') as HTMLInputElement;
    const emailInput = getByAutomation('input-field-email') as HTMLInputElement;

    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

    // Click reset button
    const resetButton = screen.getByText('Reset Form');
    fireEvent.click(resetButton);

    // Form should be reset
    expect(firstNameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(screen.queryByText('Reset Form')).not.toBeInTheDocument();
  });
});
