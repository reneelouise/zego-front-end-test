import { describe, it, expect } from 'vitest';
import {
  validateForm,
  validateField,
  isFormValid,
  getRequiredFieldsCount,
} from '../validation';
import type { FormConfig, FormData } from '../../components/form/types';

describe('Validation Utils', () => {
  const mockConfig: FormConfig = {
    title: 'Test Form',
    description: 'Test form',
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
      {
        id: 'phone',
        type: 'input',
        label: 'Phone',
        required: false,
      },
      {
        id: 'country',
        type: 'dropdown',
        label: 'Country',
        required: true,
      },
      {
        id: 'optional-text',
        type: 'text',
        label: 'Optional Text',
      },
    ],
    submitUrl: '/api/submit',
    method: 'POST',
  };

  describe('validateForm', () => {
    it('returns empty errors for valid form data', () => {
      const formData: FormData = {
        'first-name': 'John',
        email: 'john@example.com',
        country: 'us',
      };

      const errors = validateForm(mockConfig, formData);
      expect(errors).toEqual({});
    });

    it('returns errors for missing required fields', () => {
      const formData: FormData = {
        'first-name': 'John',
        // Missing email and country
      };

      const errors = validateForm(mockConfig, formData);
      expect(errors).toEqual({
        email: 'Email is required',
        country: 'Country is required',
      });
    });

    it('returns errors for empty required fields', () => {
      const formData: FormData = {
        'first-name': '   ', // Only whitespace
        email: '',
        country: 'us',
      };

      const errors = validateForm(mockConfig, formData);
      expect(errors).toEqual({
        'first-name': 'First Name is required',
        email: 'Email is required',
      });
    });

    it('validates email format correctly', () => {
      const formData: FormData = {
        'first-name': 'John',
        email: 'invalid-email',
        country: 'us',
      };

      const errors = validateForm(mockConfig, formData);
      expect(errors).toEqual({
        email: 'Please enter a valid email address',
      });
    });

    it('accepts valid email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        '123@numbers.com',
      ];

      validEmails.forEach(email => {
        const formData: FormData = {
          'first-name': 'John',
          email: email,
          country: 'us',
        };

        const errors = validateForm(mockConfig, formData);
        expect(errors).not.toHaveProperty('email');
      });
    });

    it('validates phone number format correctly', () => {
      const formData: FormData = {
        'first-name': 'John',
        email: 'john@example.com',
        country: 'us',
        phone: 'invalid-phone',
      };

      const errors = validateForm(mockConfig, formData);
      expect(errors).toEqual({
        phone: 'Please enter a valid phone number',
      });
    });

    it('accepts valid phone number formats', () => {
      const validPhones = [
        '+1234567890',
        '1234567890',
        '+44 20 7946 0958',
        '(555) 123-4567',
      ];

      validPhones.forEach(phone => {
        const formData: FormData = {
          'first-name': 'John',
          email: 'john@example.com',
          country: 'us',
          phone: phone,
        };

        const errors = validateForm(mockConfig, formData);
        expect(errors).not.toHaveProperty('phone');
      });
    });

    it('ignores non-input and non-dropdown components', () => {
      const configWithText = {
        ...mockConfig,
        components: [
          ...mockConfig.components,
          {
            id: 'text-component',
            type: 'text',
            label: 'Some text',
            required: true,
          },
        ],
      };

      const formData: FormData = {
        'first-name': 'John',
        email: 'john@example.com',
        country: 'us',
      };

      const errors = validateForm(configWithText as FormConfig, formData);
      expect(errors).toEqual({});
    });
  });

  describe('validateField', () => {
    it('returns null for valid field', () => {
      const error = validateField('first-name', 'John', mockConfig);
      expect(error).toBeNull();
    });

    it('returns error for missing required field', () => {
      const error = validateField('first-name', '', mockConfig);
      expect(error).toBe('First Name is required');
    });

    it('returns error for whitespace-only required field', () => {
      const error = validateField('first-name', '   ', mockConfig);
      expect(error).toBe('First Name is required');
    });

    it('returns null for optional field', () => {
      const error = validateField('phone', '', mockConfig);
      expect(error).toBeNull();
    });

    it('validates email format', () => {
      const error = validateField('email', 'invalid-email', mockConfig);
      expect(error).toBe('Please enter a valid email address');
    });

    it('validates phone format', () => {
      const error = validateField('phone', 'invalid-phone', mockConfig);
      expect(error).toBe('Please enter a valid phone number');
    });

    it('returns null for non-existent field', () => {
      const error = validateField('non-existent', 'value', mockConfig);
      expect(error).toBeNull();
    });

    it('returns null for non-input/dropdown field', () => {
      const error = validateField('optional-text', 'some text', mockConfig);
      expect(error).toBeNull();
    });
  });

  describe('isFormValid', () => {
    it('returns true for valid form', () => {
      const formData: FormData = {
        'first-name': 'John',
        email: 'john@example.com',
        country: 'us',
      };

      const isValid = isFormValid(mockConfig, formData);
      expect(isValid).toBe(true);
    });

    it('returns false for invalid form', () => {
      const formData: FormData = {
        'first-name': 'John',
        // Missing required fields
      };

      const isValid = isFormValid(mockConfig, formData);
      expect(isValid).toBe(false);
    });

    it('returns false for form with validation errors', () => {
      const formData: FormData = {
        'first-name': 'John',
        email: 'invalid-email',
        country: 'us',
      };

      const isValid = isFormValid(mockConfig, formData);
      expect(isValid).toBe(false);
    });
  });

  describe('getRequiredFieldsCount', () => {
    it('returns correct count of required fields', () => {
      const count = getRequiredFieldsCount(mockConfig);
      expect(count).toBe(3); // first-name, email, country
    });

    it('returns 0 for form with no required fields', () => {
      const configNoRequired = {
        ...mockConfig,
        components: mockConfig.components.map(comp => ({
          ...comp,
          required: false,
        })),
      };

      const count = getRequiredFieldsCount(configNoRequired);
      expect(count).toBe(0);
    });

    it('ignores non-input/dropdown components', () => {
      const configWithText = {
        ...mockConfig,
        components: [
          ...mockConfig.components,
          {
            id: 'text-component',
            type: 'text',
            label: 'Some text',
            required: true,
          },
        ],
      } as typeof mockConfig;

      const count = getRequiredFieldsCount(configWithText);
      expect(count).toBe(3); // Should still be 3, text component ignored
    });
  });
});
