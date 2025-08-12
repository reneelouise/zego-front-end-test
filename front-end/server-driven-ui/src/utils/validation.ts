import type { FormConfig, FormData } from '../components/form/types';

/**
 * Validates form data against the form configuration
 * @param config - The form configuration
 * @param formData - The current form data
 * @returns Object containing field errors
 */
export const validateForm = (
  config: FormConfig,
  formData: FormData
): Record<string, string> => {
  const errors: Record<string, string> = {};

  config.components.forEach(component => {
    if (component.type === 'input' || component.type === 'dropdown') {
      const value = (formData[component.id] as string) || '';

      // Required field validation
      if (component.required && !value.trim()) {
        errors[component.id] = `${component.label || 'This field'} is required`;
      }

      // Email validation
      if (component.type === 'input' && component.id === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors[component.id] = 'Please enter a valid email address';
        }
      }

      // Phone number validation
      if (component.type === 'input' && component.id === 'phone' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          errors[component.id] = 'Please enter a valid phone number';
        }
      }
    }
  });

  return errors;
};

/**
 * Validates a single field
 * @param fieldId - The field ID
 * @param value - The field value
 * @param config - The form configuration
 * @returns Error message or null if valid
 */
export const validateField = (
  fieldId: string,
  value: string,
  config: FormConfig
): string | null => {
  const component = config.components.find(c => c.id === fieldId);

  if (
    !component ||
    (component.type !== 'input' && component.type !== 'dropdown')
  ) {
    return null;
  }

  // Required field validation
  if (component.required && !value.trim()) {
    return `${component.label || 'This field'} is required`;
  }

  // Email validation
  if (component.type === 'input' && fieldId === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }

  // Phone number validation
  if (component.type === 'input' && fieldId === 'phone' && value) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      return 'Please enter a valid phone number';
    }
  }

  return null;
};

/**
 * Checks if the form is valid
 * @param config - The form configuration
 * @param formData - The current form data
 * @returns True if form is valid
 */
export const isFormValid = (
  config: FormConfig,
  formData: FormData
): boolean => {
  const errors = validateForm(config, formData);
  return Object.keys(errors).length === 0;
};

/**
 * Gets the count of required fields
 * @param config - The form configuration
 * @returns Number of required fields
 */
export const getRequiredFieldsCount = (config: FormConfig): number => {
  return config.components.filter(
    c => (c.type === 'input' || c.type === 'dropdown') && c.required
  ).length;
};
