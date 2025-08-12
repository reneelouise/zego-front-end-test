import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Page from '../app/page';
import { getMockFetch, mockApiResponses } from './mocks';
import type { FormConfig } from '../components/form/types';

describe('End-to-End Tests', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch = getMockFetch();
  });

  const createFormConfig = (
    overrides: Partial<FormConfig> = {}
  ): FormConfig => ({
    title: 'User Registration',
    description: 'Please fill out the form below',
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
      { id: 'submit', type: 'button', label: 'Submit Registration' },
    ],
    submitUrl: '/api/submit',
    method: 'POST',
    ...overrides,
  });

  // Helper function to mock config fetch
  const mockConfigFetch = (config: FormConfig) => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: config }),
    });
  };

  // Helper function to fill form fields
  const fillFormFields = (fields: Record<string, string>) => {
    Object.entries(fields).forEach(([label, value]) => {
      // Map labels to data-automation IDs
      const automationMap: Record<string, string> = {
        'First Name': 'input-field-first-name',
        'Email': 'input-field-email',
        'Country': 'dropdown-field-country',
      };
      
      const automationId = automationMap[label];
      if (!automationId) {
        throw new Error(`No automation ID found for label: ${label}`);
      }
      
      const field = document.querySelector(`[data-automation="${automationId}"]`) as HTMLInputElement | HTMLSelectElement;
      if (!field) {
        throw new Error(`Field not found with automation ID: ${automationId}`);
      }
      
      fireEvent.change(field, { target: { value } });
    });
  };

  // Helper function to wait for form to load
  const waitForFormLoad = async (title: string) => {
    await waitFor(() => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  };

  it('complete flow: config fetch → render → fill form → submit', async () => {
    const config = createFormConfig();
    mockConfigFetch(config);
    mockFetch.mockResolvedValueOnce(mockApiResponses.submit.success);

    render(<Page />);
    await waitForFormLoad('User Registration');

    // Fill out form
    fillFormFields({
      'First Name': 'John',
      Email: 'john@example.com',
      Country: 'us',
    });

    // Submit form
    const submitButton = screen.getByRole('button', {
      name: /submit registration/i,
    });
    fireEvent.click(submitButton);

    // Wait for success message
    await waitFor(() => {
      expect(
        screen.getByText('Form submitted successfully!')
      ).toBeInTheDocument();
    });

    // Verify API calls
    expect(mockFetch).toHaveBeenCalledWith('/api/config');
    expect(mockFetch).toHaveBeenCalledWith(
      '/api/submit',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('John'),
      })
    );
  });

  it('handles validation errors in the flow', async () => {
    const config = createFormConfig({
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
        { id: 'submit', type: 'button', label: 'Submit' },
      ],
    });

    mockConfigFetch(config);
    mockFetch.mockResolvedValueOnce(mockApiResponses.submit.success);

    render(<Page />);
    await waitForFormLoad('User Registration');

    // Fill out form partially (missing required email)
    fillFormFields({ 'First Name': 'John' });

    // Submit form - should show validation error
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please fix the errors below/i)
      ).toBeInTheDocument();
    });

    // Fill in missing field and submit again
    fillFormFields({ Email: 'john@example.com' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Form submitted successfully!')
      ).toBeInTheDocument();
    });
  });

  it('handles network errors gracefully in the flow', async () => {
    // Mock config fetch failure
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<Page />);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Error Loading Form')).toBeInTheDocument();
    });

    // Mock successful retry
    const retryConfig = createFormConfig({
      title: 'Retry Success',
      description: 'Form loaded after retry',
      components: [
        { id: 'test', type: 'input', label: 'Test Input', required: true },
        { id: 'submit', type: 'button', label: 'Submit' },
      ],
    });
    mockConfigFetch(retryConfig);

    // Click retry
    const retryButton = screen.getByRole('button', { name: /try again/i });
    fireEvent.click(retryButton);

    // Should show success
    await waitFor(() => {
      expect(screen.getByText('Retry Success')).toBeInTheDocument();
    });
  });

  it('handles server errors during submission', async () => {
    const config = createFormConfig({
      components: [
        {
          id: 'first-name',
          type: 'input',
          label: 'First Name',
          required: true,
          placeholder: 'Enter your first name',
        },
        { id: 'submit', type: 'button', label: 'Submit' },
      ],
    });

    mockConfigFetch(config);
    mockFetch.mockResolvedValueOnce(mockApiResponses.submit.error);

    render(<Page />);
    await waitForFormLoad('User Registration');

    // Fill and submit form
    fillFormFields({ 'First Name': 'John' });
    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Validation failed')).toBeInTheDocument();
    });
  });

  it('handles email validation correctly', async () => {
    const config = createFormConfig({
      components: [
        {
          id: 'first-name',
          type: 'input',
          label: 'First Name',
          required: true,
        },
        {
          id: 'email',
          type: 'input',
          label: 'Email',
          required: true,
        },
        { id: 'submit', type: 'button', label: 'Submit' },
      ],
    });

    mockConfigFetch(config);
    mockFetch.mockResolvedValueOnce(mockApiResponses.submit.success);

    render(<Page />);
    await waitForFormLoad('User Registration');

    // Fill with invalid email
    fillFormFields({
      'First Name': 'John',
      Email: 'invalid-email',
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    // Should show email validation error
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeInTheDocument();
    });

    // Fix email and submit
    fillFormFields({ Email: 'john@example.com' });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Form submitted successfully!')
      ).toBeInTheDocument();
    });
  });
});
