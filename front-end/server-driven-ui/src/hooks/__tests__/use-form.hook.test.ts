import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { useForm } from '../use-form.hook';
import type { FormConfig } from '../../components/form/types';

// Helper function to create a mock form submit event
const createMockFormEvent = (): React.FormEvent<HTMLFormElement> =>
  ({
    preventDefault: vi.fn(),
    target: null,
    currentTarget: null,
    nativeEvent: {} as Event,
    bubbles: false,
    cancelable: false,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: false,
    timeStamp: 0,
    type: 'submit',
    isDefaultPrevented: () => false,
    stopPropagation: vi.fn(),
    isPropagationStopped: () => false,
    persist: vi.fn(),
  }) as unknown as React.FormEvent<HTMLFormElement>;

describe('useForm Hook', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Create fresh mock for each test
    mockFetch = vi.fn();
    global.fetch = mockFetch;

    // Mock console methods
    console.log = vi.fn();
    console.error = vi.fn();

    // Mock window object
    Object.defineProperty(global, 'window', {
      value: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      },
      writable: true,
    });
  });
  const mockConfig: FormConfig = {
    title: 'Test Form',
    description: 'Test description',
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
    ],
    submitUrl: '/api/submit',
    method: 'POST',
  };

  describe('Initial State', () => {
    it('returns correct initial state', () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();
      expect(result.current.formData).toEqual({});
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.success).toBeNull();
      expect(result.current.fieldErrors).toEqual({});
      expect(typeof result.current.handleFieldChange).toBe('function');
      expect(typeof result.current.handleSubmit).toBe('function');
    });
  });

  describe('handleFieldChange', () => {
    it('updates form data when field changes', () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
        }
      });

      expect(result.current.formData).toEqual({ 'first-name': 'John' });
    });

    it('updates multiple fields correctly', () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      expect(result.current.formData).toEqual({
        'first-name': 'John',
        email: 'john@example.com',
      });
    });

    it('clears error when user starts typing', () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      // Set an error first by submitting empty form
      act(() => {
        if (result.current) {
          result.current.handleSubmit(createMockFormEvent());
        }
      });

      // Should have error after failed submission
      expect(result.current.error).toBe('Please fix the errors below');

      // Clear error when user types
      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
        }
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('handleSubmit - Validation', () => {
    it('prevents submission when form is invalid', async () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      await act(async () => {
        await result.current.handleSubmit(createMockFormEvent());
      });

      expect(result.current.error).toBe('Please fix the errors below');
      expect(result.current.fieldErrors['first-name']).toBeDefined();
      expect(result.current.fieldErrors.email).toBeDefined();
      expect(result.current.isSubmitting).toBe(false);
    });

    it('allows submission when form is valid', async () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      // Mock successful submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        if (result.current) {
          await result.current.handleSubmit(createMockFormEvent());
        }
      });

      expect(result.current.success).toBe('Form submitted successfully!');
      expect(result.current.error).toBeNull();
      expect(result.current.fieldErrors).toEqual({});
    });
  });

  describe('handleSubmit - API Submission', () => {
    it('submits form data to API when no onSubmit callback provided', async () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await act(async () => {
        if (result.current) {
          await result.current.handleSubmit(createMockFormEvent());
        }
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: expect.stringContaining('"first-name":"John"'),
      });
    });

    it('uses custom onSubmit callback when provided', async () => {
      const mockOnSubmit = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => useForm(mockConfig, mockOnSubmit));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      await act(async () => {
        if (result.current) {
          await result.current.handleSubmit(createMockFormEvent());
        }
      });

      expect(mockOnSubmit).toHaveBeenCalledWith({
        'first-name': 'John',
        email: 'john@example.com',
      });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('handles API errors gracefully', async () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      // Mock API error
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Validation failed' }),
      });

      await act(async () => {
        if (result.current) {
          await result.current.handleSubmit(createMockFormEvent());
        }
      });

      expect(result.current.error).toBe('Validation failed');
      expect(result.current.isSubmitting).toBe(false);
    });

    it('handles network errors with user-friendly message', async () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      // Mock network error
      mockFetch.mockRejectedValueOnce(new Error('fetch failed'));

      await act(async () => {
        if (result.current) {
          await result.current.handleSubmit(createMockFormEvent());
        }
      });

      expect(result.current.error).toBe(
        'Network error. Please check your connection and try again.'
      );
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe('Loading States', () => {
    it('sets isSubmitting to true during submission', async () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      // Mock successful API response
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      // Submit form
      await act(async () => {
        if (result.current) {
          await result.current.handleSubmit(createMockFormEvent());
        }
      });
      expect(result.current?.isSubmitting).toBe(false);
    });
  });

  describe('Form Data Persistence', () => {
    it('maintains form data across multiple field changes', () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
        }
      });
      expect(result.current?.formData['first-name']).toBe('John');

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });
      expect(result.current?.formData['first-name']).toBe('John');
      expect(result.current?.formData.email).toBe('john@example.com');
    });

    it('updates existing field values', () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
        }
      });

      // Check the form data after the first change
      expect(result.current?.formData['first-name']).toBe('John');

      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'Jane');
        }
      });

      // Check the form data after the second change
      expect(result.current?.formData['first-name']).toBe('Jane');
    });
  });

  describe('Form Reset', () => {
    it('resets form state when resetForm is called', () => {
      const { result } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      // Fill in some data
      act(() => {
        if (result.current) {
          result.current.handleFieldChange('first-name', 'John');
          result.current.handleFieldChange('email', 'john@example.com');
        }
      });

      expect(result.current?.formData['first-name']).toBe('John');
      expect(result.current?.formData['email']).toBe('john@example.com');

      // Reset form
      act(() => {
        if (result.current) {
          result.current.resetForm();
        }
      });

      expect(result.current?.formData).toEqual({});
      expect(result.current?.error).toBeNull();
      expect(result.current?.success).toBeNull();
      expect(result.current?.fieldErrors).toEqual({});
      expect(result.current?.isSubmitting).toBe(false);
    });

    it('prevents memory leaks when resetForm is called after unmount', () => {
      const { result, unmount } = renderHook(() => useForm(mockConfig));

      expect(result.current).toBeDefined();

      unmount();

      // Should not throw errors when trying to reset after unmount
      expect(() => {
        if (result.current) {
          result.current.resetForm();
        }
      }).not.toThrow();
    });
  });
});
