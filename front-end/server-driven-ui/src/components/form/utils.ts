import type { UIComponent } from '../types/ui';

/**
 * Gets the appropriate autocomplete value for a field
 * @param fieldId - The field ID
 * @returns Autocomplete value or undefined
 */
export const getAutoCompleteValue = (fieldId: string): string | undefined => {
  const autoCompleteMap: Record<string, string> = {
    email: 'email',
    'first-name': 'given-name',
    'last-name': 'family-name',
    phone: 'tel',
    address: 'street-address',
    city: 'address-level2',
    state: 'address-level1',
    zip: 'postal-code',
    country: 'country-name',
    password: 'current-password',
    'new-password': 'new-password',
    'confirm-password': 'new-password',
  };

  return autoCompleteMap[fieldId];
};

/**
 * Gets the appropriate input type for a field
 * @param fieldId - The field ID
 * @returns Input type or 'text' as default
 */
export const getInputType = (fieldId: string): string => {
  const typeMap: Record<string, string> = {
    email: 'email',
    phone: 'tel',
    password: 'password',
    'confirm-password': 'password',
    'new-password': 'password',
    url: 'url',
    number: 'number',
    date: 'date',
    time: 'time',
  };

  return typeMap[fieldId] || 'text';
};

/**
 * Determines if a component should be focused based on error state
 * @param componentId - The component ID
 * @param fieldErrors - Current field errors
 * @returns True if component should be focused
 */
export const shouldAutoFocus = (
  componentId: string,
  fieldErrors: Record<string, string>
): boolean => {
  return (
    Object.keys(fieldErrors).length > 0 &&
    Object.keys(fieldErrors)[0] === componentId
  );
};

/**
 * Gets the error message ID for a field
 * @param fieldId - The field ID
 * @param fieldErrors - Current field errors
 * @returns Error message ID or undefined
 */
export const getErrorId = (
  fieldId: string,
  fieldErrors: Record<string, string>
): string | undefined => {
  return fieldErrors[fieldId] ? `${fieldId}-error` : undefined;
};

/**
 * Gets the appropriate ARIA described by value
 * @param fieldId - The field ID
 * @param fieldErrors - Current field errors
 * @returns ARIA described by value or undefined
 */
export const getAriaDescribedBy = (
  fieldId: string,
  fieldErrors: Record<string, string>
): string | undefined => {
  return getErrorId(fieldId, fieldErrors);
};

/**
 * Determines the text variant based on className
 * @param className - The component className
 * @returns Text variant
 */
export const getTextVariant = (className?: string): string => {
  if (className?.includes('error')) return 'error';
  if (className?.includes('success')) return 'success';
  return 'paragraph';
};

/**
 * Checks if a component is a form field (input or dropdown)
 * @param component - The component to check
 * @returns True if component is a form field
 */
export const isFormField = (component: UIComponent): boolean => {
  return component.type === 'input' || component.type === 'dropdown';
};

/**
 * Formats error message for screen readers
 * @param error - The error message
 * @returns Formatted error message
 */
export const formatErrorForScreenReader = (error: string): string => {
  return `Error: ${error}`;
};

/**
 * Formats success message for screen readers
 * @param success - The success message
 * @returns Formatted success message
 */
export const formatSuccessForScreenReader = (success: string): string => {
  return `Success: ${success}`;
};
