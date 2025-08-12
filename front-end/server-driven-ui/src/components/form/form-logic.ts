import { useMemo } from 'react';
import type { FormConfig, FormData } from './types';
import { getRequiredFieldsCount } from '../../utils/validation';

/**
 * Form business logic hooks and utilities
 */

export const useFormInstructions = (config: FormConfig) => {
  return useMemo(() => {
    const requiredFieldsCount = getRequiredFieldsCount(config);
    return `This form has ${requiredFieldsCount} required field${requiredFieldsCount !== 1 ? 's' : ''}. Required fields are marked with an asterisk (*).`;
  }, [config]);
};

export const useFormComponents = (
  config: FormConfig,
  formData: FormData,
  fieldErrors: Record<string, string>,
  isSubmitting: boolean,
  onFieldChange: (fieldId: string, value: string) => void
) => {
  return useMemo(
    () =>
      config.components.map(component => ({
        key: component.id,
        component,
        formData,
        fieldErrors,
        isSubmitting,
        onFieldChange,
      })),
    [config.components, formData, fieldErrors, isSubmitting, onFieldChange]
  );
};

export const useFormState = (config: FormConfig) => {
  return useMemo(
    () => ({
      hasRequiredFields: getRequiredFieldsCount(config) > 0,
      totalComponents: config.components.length,
      hasSubmitButton: config.components.some(c => c.type === 'button'),
      hasInputs: config.components.some(c => c.type === 'input'),
      hasDropdowns: config.components.some(c => c.type === 'dropdown'),
    }),
    [config]
  );
};
